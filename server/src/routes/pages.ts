import express, { Request, Response } from 'express';
import { getDb } from '../index';

const router = express.Router();

// GET /api/pages - List all pages (metadata)
router.get('/', async (req: Request, res: Response) => {
    try {
        const db = getDb();
        const pages = await db.all('SELECT * FROM pages ORDER BY id ASC');
        res.json(pages);
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

// GET /api/pages/:slug/content - Get localized content for a page
// Query: ?lang=en
router.get('/:slug/content', async (req: Request, res: Response) => {
    const { slug } = req.params;
    const { lang } = req.query;

    if (!lang) {
        res.status(400).json({ error: 'lang query parameter is required' });
        return;
    }

    try {
        const db = getDb();
        const page = await db.get('SELECT id FROM pages WHERE slug_key = ?', slug);
        if (!page) {
            res.status(404).json({ error: 'Page not found' });
            return;
        }

        const content = await db.get(
            'SELECT * FROM page_contents WHERE page_id = ? AND lang_code = ?',
            [page.id, lang]
        );

        if (content && content.content_json) {
            try {
                content.content_json = JSON.parse(content.content_json);
            } catch (e) {
                // Keep as string if parsing fails
            }
        }

        res.json(content || {}); // Return empty object if no content yet
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

// GET /api/pages/:id/draft - Get draft content for editing
// If no draft exists, falls back to published content (so editor starts with current version)
router.get('/:id/draft', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { lang } = req.query;

    if (!lang) {
        res.status(400).json({ error: 'lang query parameter is required' });
        return;
    }

    try {
        const db = getDb();

        // 1. Try to fetch from drafts
        let content = await db.get(
            'SELECT * FROM page_drafts WHERE page_id = ? AND lang_code = ?',
            [id, lang]
        );

        // 2. If no draft, fallback to live content
        if (!content) {
            content = await db.get(
                'SELECT * FROM page_contents WHERE page_id = ? AND lang_code = ?',
                [id, lang]
            );
        }

        if (content && content.content_json) {
            try {
                content.content_json = JSON.parse(content.content_json);
            } catch (e) {
                // Keep as string if parsing fails
            }
        }

        res.json(content || {});
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

// POST /api/pages/:id/draft - Save Draft (Work In Progress)
// Does NOT update the live site
router.post('/:id/draft', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { lang, title, seo_title, seo_desc, content_json, slug_localized } = req.body;

    try {
        const db = getDb();
        await db.run(`
            INSERT INTO page_drafts (page_id, lang_code, title, slug_localized, seo_title, seo_desc, content_json, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(page_id, lang_code) DO UPDATE SET 
                title = excluded.title,
                slug_localized = excluded.slug_localized,
                seo_title = excluded.seo_title,
                seo_desc = excluded.seo_desc,
                content_json = excluded.content_json,
                updated_at = CURRENT_TIMESTAMP
        `, [id, lang, title, slug_localized, seo_title, seo_desc, JSON.stringify(content_json)]);

        res.json({ success: true, mode: 'draft' });
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

// POST /api/pages/:id/publish - Publish Draft to Live
// 1. Archives current live content to history
// 2. Promotes draft content to live
router.post('/:id/publish', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { lang, title, seo_title, seo_desc, content_json, slug_localized } = req.body;

    try {
        const db = getDb();

        // 1. Archive current live version (if exists)
        const currentLive = await db.get(
            'SELECT * FROM page_contents WHERE page_id = ? AND lang_code = ?',
            [id, lang]
        );

        if (currentLive) {
            await db.run(`
                INSERT INTO page_content_history (page_id, lang_code, title, slug_localized, seo_title, seo_desc, content_json, archived_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
            `, [currentLive.page_id, currentLive.lang_code, currentLive.title, currentLive.slug_localized, currentLive.seo_title, currentLive.seo_desc, currentLive.content_json]);
        }

        // 2. Insert/Update Live Content
        await db.run(`
            INSERT INTO page_contents (page_id, lang_code, title, slug_localized, seo_title, seo_desc, content_json, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(page_id, lang_code) DO UPDATE SET 
                title = excluded.title,
                slug_localized = excluded.slug_localized,
                seo_title = excluded.seo_title,
                seo_desc = excluded.seo_desc,
                content_json = excluded.content_json,
                updated_at = CURRENT_TIMESTAMP
        `, [id, lang, title, slug_localized, seo_title, seo_desc, JSON.stringify(content_json)]);

        // 3. Also update draft to match (so they are synced)
        await db.run(`
            INSERT INTO page_drafts (page_id, lang_code, title, slug_localized, seo_title, seo_desc, content_json, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(page_id, lang_code) DO UPDATE SET 
                title = excluded.title,
                slug_localized = excluded.slug_localized,
                seo_title = excluded.seo_title,
                seo_desc = excluded.seo_desc,
                content_json = excluded.content_json,
                updated_at = CURRENT_TIMESTAMP
        `, [id, lang, title, slug_localized, seo_title, seo_desc, JSON.stringify(content_json)]);

        res.json({ success: true, mode: 'published' });
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

// POST /api/pages - Create Page (Metadata)
router.post('/', async (req: Request, res: Response) => {
    const { slug_key, template } = req.body;
    try {
        const db = getDb();
        await db.run('INSERT INTO pages (slug_key, template) VALUES (?, ?)', [slug_key, template]);
        res.status(201).json({ success: true });
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

export default router;
