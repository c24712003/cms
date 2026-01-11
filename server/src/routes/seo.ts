import express, { Request, Response } from 'express';
import { getDb } from '../index';

const router = express.Router();

// ============================================
// SEO SETTINGS API
// ============================================

/**
 * GET /api/seo/settings - Get all SEO settings
 */
router.get('/settings', async (req: Request, res: Response) => {
    try {
        const db = getDb();
        const settings = await db.all('SELECT key, value FROM seo_settings');

        // Convert to object for easier access
        const settingsObj: Record<string, string> = {};
        settings.forEach((s: any) => {
            settingsObj[s.key] = s.value;
        });

        res.json(settingsObj);
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

/**
 * PUT /api/seo/settings - Update SEO settings
 */
router.put('/settings', async (req: Request, res: Response) => {
    const updates = req.body; // { key: value, ... }

    try {
        const db = getDb();

        for (const [key, value] of Object.entries(updates)) {
            await db.run(`
                INSERT INTO seo_settings (key, value, updated_at)
                VALUES (?, ?, CURRENT_TIMESTAMP)
                ON CONFLICT(key) DO UPDATE SET 
                    value = excluded.value,
                    updated_at = CURRENT_TIMESTAMP
            `, [key, value]);
        }

        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

// ============================================
// PAGE SEO DATA API
// ============================================

/**
 * GET /api/seo/page/:slug - Get full SEO data for a page
 * Query params: ?lang=en
 * Returns: { seo_title, seo_desc, canonical_url, og_image, schema_type, noindex, nofollow }
 */
router.get('/page/:slug', async (req: Request, res: Response) => {
    const { slug } = req.params;
    const { lang } = req.query;

    if (!lang) {
        res.status(400).json({ error: 'lang query parameter is required' });
        return;
    }

    try {
        const db = getDb();

        // Get page and its content
        const page = await db.get('SELECT id, slug_key, template FROM pages WHERE slug_key = ?', slug);
        if (!page) {
            res.status(404).json({ error: 'Page not found' });
            return;
        }

        const content = await db.get(`
            SELECT 
                title, seo_title, seo_desc, og_image, schema_type, 
                noindex, nofollow, canonical_url, updated_at
            FROM page_contents 
            WHERE page_id = ? AND lang_code = ?
        `, [page.id, lang]);

        // Get site-wide settings for fallbacks
        const settings = await db.all('SELECT key, value FROM seo_settings');
        const settingsObj: Record<string, string> = {};
        settings.forEach((s: any) => {
            settingsObj[s.key] = s.value;
        });

        // Build canonical URL if not custom
        const baseUrl = process.env.BASE_URL || 'https://example.com';
        const canonicalUrl = content?.canonical_url ||
            (slug === 'home'
                ? `${baseUrl}/${lang}`
                : `${baseUrl}/${lang}/${content?.slug_localized || slug}`);

        // Build response
        const seoData = {
            title: content?.seo_title || content?.title || settingsObj.site_name,
            description: content?.seo_desc || settingsObj.site_description,
            canonical_url: canonicalUrl,
            og_image: content?.og_image || settingsObj.default_og_image,
            schema_type: content?.schema_type || 'WebPage',
            noindex: content?.noindex || false,
            nofollow: content?.nofollow || false,
            updated_at: content?.updated_at,
            // Additional data for structured data
            site_name: settingsObj.site_name,
            organization_name: settingsObj.organization_name,
            organization_logo: settingsObj.organization_logo,
            twitter_handle: settingsObj.twitter_handle,
            lang_code: lang,
            slug: slug,
            template: page.template
        };

        res.json(seoData);
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

// ============================================
// REDIRECTS API
// ============================================

/**
 * GET /api/seo/redirects - Get all redirect rules
 */
router.get('/redirects', async (req: Request, res: Response) => {
    try {
        const db = getDb();
        const redirects = await db.all(`
            SELECT id, from_path, to_path, status_code, is_active, hit_count, created_at
            FROM redirects
            ORDER BY created_at DESC
        `);
        res.json(redirects);
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

/**
 * POST /api/seo/redirects - Create a redirect rule
 */
router.post('/redirects', async (req: Request, res: Response) => {
    const { from_path, to_path, status_code = 301 } = req.body;

    if (!from_path || !to_path) {
        res.status(400).json({ error: 'from_path and to_path are required' });
        return;
    }

    try {
        const db = getDb();
        const result = await db.run(`
            INSERT INTO redirects (from_path, to_path, status_code)
            VALUES (?, ?, ?)
        `, [from_path, to_path, status_code]);

        res.status(201).json({ success: true, id: result.lastID });
    } catch (e: any) {
        if (e.message?.includes('UNIQUE constraint')) {
            res.status(409).json({ error: 'Redirect from this path already exists' });
        } else {
            res.status(500).json({ error: String(e) });
        }
    }
});

/**
 * PUT /api/seo/redirects/:id - Update a redirect rule
 */
router.put('/redirects/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { from_path, to_path, status_code, is_active } = req.body;

    try {
        const db = getDb();
        await db.run(`
            UPDATE redirects 
            SET from_path = COALESCE(?, from_path),
                to_path = COALESCE(?, to_path),
                status_code = COALESCE(?, status_code),
                is_active = COALESCE(?, is_active),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `, [from_path, to_path, status_code, is_active, id]);

        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

/**
 * DELETE /api/seo/redirects/:id - Delete a redirect rule
 */
router.delete('/redirects/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const db = getDb();
        await db.run('DELETE FROM redirects WHERE id = ?', [id]);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

/**
 * GET /api/seo/redirects/check - Check if a path has a redirect
 * Query: ?path=/old-page
 */
router.get('/redirects/check', async (req: Request, res: Response) => {
    const { path } = req.query;

    if (!path) {
        res.status(400).json({ error: 'path query parameter is required' });
        return;
    }

    try {
        const db = getDb();
        const redirect = await db.get(`
            SELECT to_path, status_code 
            FROM redirects 
            WHERE from_path = ? AND is_active = 1
        `, [path]);

        if (redirect) {
            // Increment hit count
            await db.run('UPDATE redirects SET hit_count = hit_count + 1 WHERE from_path = ?', [path]);
            res.json({ redirect: true, ...redirect });
        } else {
            res.json({ redirect: false });
        }
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

export default router;
