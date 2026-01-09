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

// POST /api/pages/:id/content - Update Content
router.post('/:id/content', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { lang, title, seo_title, seo_desc, content_json, slug_localized } = req.body;

    try {
        const db = getDb();
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

        res.json({ success: true });
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
