import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { getDb } from '../index';
import { logActivity } from './audit-logs';
import { BoardingTemplate, TemplateVariable } from '../types/template.types';

const router = express.Router();
const TEMPLATES_DIR = path.join(__dirname, '../data/templates');

// Utility to read templates
const getTemplates = (): BoardingTemplate[] => {
    try {
        if (!fs.existsSync(TEMPLATES_DIR)) return [];
        const files = fs.readdirSync(TEMPLATES_DIR).filter(f => f.endsWith('.json'));
        return files.map(file => {
            const content = fs.readFileSync(path.join(TEMPLATES_DIR, file), 'utf-8');
            return JSON.parse(content);
        });
    } catch (e) {
        console.error('Error reading templates:', e);
        return [];
    }
};

// GET /api/templates - List all templates
router.get('/', (req: Request, res: Response) => {
    try {
        const templates = getTemplates();
        res.json(templates);
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

// POST /api/templates/instantiate
// Body: { templateId: string, variables: Record<string, string>, themeName: string }
router.post('/instantiate', async (req: Request, res: Response) => {
    const { templateId, variables, themeName } = req.body;

    if (!templateId || !themeName) {
        res.status(400).json({ error: 'Missing required fields: templateId, themeName' });
        return;
    }

    try {
        const templates = getTemplates();
        const template = templates.find(t => t.id === templateId);

        if (!template) {
            res.status(404).json({ error: 'Template not found' });
            return;
        }

        const db = getDb();

        // 1. Get Enabled Languages
        const languages = await db.all('SELECT code FROM languages WHERE enabled = 1');
        if (!languages || languages.length === 0) {
            // Fallback if no languages defined (unlikely)
            languages.push({ code: 'en-US' });
        }

        const createdPages = [];

        // 1. Create Theme Record
        // Check if there are any active themes. If none, make this one active by default.
        const activeCount = await db.get('SELECT COUNT(*) as count FROM themes WHERE is_active = 1');
        const isFirstTheme = activeCount.count === 0;

        const themeResult = await db.run(
            'INSERT INTO themes (name, template_id, is_active) VALUES (?, ?, ?)',
            [themeName, templateId, isFirstTheme ? 1 : 0]
        );
        const themeId = themeResult.lastID;

        // 2. Loop through Template Pages
        for (const pageDef of template.pages) {
            // 2a. Create Page Metadata
            // For Multi-Theme, slugs might duplicate across themes, but `slug_key` in `pages` is likely UNIQUE.
            // We need to handle this.
            // Strategy: If slug collision, we append suffix. 
            // Ideally, page slug should be unique per language scope, or we assume `slug_key` is system-wide unique.

            let finalSlug = pageDef.slug;
            let pageId: number | null = null;
            let retries = 0;

            // ... retry logic same as before ...
            while (pageId === null && retries < 5) {
                try {
                    // LINK TO THEME ID
                    const result = await db.run('INSERT INTO pages (slug_key, template, theme_id) VALUES (?, ?, ?)', [finalSlug, pageDef.template, themeId]);
                    pageId = result.lastID;
                } catch (e: any) {
                    if (e.message.includes('UNIQUE constraint failed')) {
                        finalSlug = `${pageDef.slug}-${Math.floor(Math.random() * 1000)}`;
                        retries++;
                    } else {
                        throw e;
                    }
                }
            }

            if (!pageId) continue; // Should not happen

            createdPages.push({ id: pageId, slug: finalSlug });

            // 2b. Hydrate Content
            let contentStr = JSON.stringify(pageDef.structure);

            // Apply variables
            if (variables) {
                Object.entries(variables).forEach(([key, value]) => {
                    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
                    contentStr = contentStr.replace(regex, value as string);
                });
            }
            // Apply defaults
            template.variables.forEach(v => {
                const regex = new RegExp(`\\{\\{${v.key}\\}\\}`, 'g');
                if (contentStr.match(regex)) {
                    contentStr = contentStr.replace(regex, v.defaultValue);
                }
            });

            // 2c. Create Page Contents for ALL Enabled Languages
            for (const lang of languages) {
                await db.run(`
                    INSERT INTO page_contents 
                    (page_id, lang_code, title, slug_localized, seo_title, seo_desc, content_json, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
                `, [
                    pageId,
                    lang.code,
                    pageDef.title, // Use same title for all langs (MVP)
                    finalSlug,     // Use same slug for all langs (MVP)
                    pageDef.title, // SEO Title
                    `Page created from ${template.name}`, // SEO Desc
                    contentStr
                ]);
            }
        }

        await logActivity('Theme Instantiated', `Instantiated theme "${themeName}" (${template.name})`, 'content');

        res.status(201).json({ success: true, themeId, pages: createdPages });

    } catch (e) {
        console.error(e);
        res.status(500).json({ error: String(e) });
    }
});

export default router;
