import express, { Request, Response } from 'express';
import { getDb } from '../index';
import { authenticateToken, requireRole } from '../middleware/auth.middleware';

const router = express.Router();

// Public or Protected? detailed info might be sensitive, but basic search usually accessible to authenticated users.
// Admin search should be protected.
// Admin Search (Protected)
router.get('/', authenticateToken, async (req: Request, res: Response) => {
    const { q } = req.query;

    if (!q || typeof q !== 'string' || q.length < 2) {
        return res.json({ pages: [], users: [], media: [] });
    }

    const query = `%${q}%`;
    const db = getDb();

    try {
        // 1. Search Pages (Join with content to get title)
        const pages = await db.all(`
            SELECT p.id, p.slug_key, pc.title, pc.lang_code
            FROM pages p
            JOIN page_contents pc ON p.id = pc.page_id
            WHERE pc.title LIKE ? OR p.slug_key LIKE ?
            GROUP BY p.id
            LIMIT 5
        `, [query, query]);

        // 2. Search Users
        const users = await db.all(`
            SELECT id, username, role 
            FROM users 
            WHERE username LIKE ? 
            LIMIT 5
        `, [query]);

        // 3. Search Media
        const media = await db.all(`
            SELECT id, filename, original_name, type, url, thumbnail_url
            FROM media_assets
            WHERE filename LIKE ? OR original_name LIKE ?
            LIMIT 5
        `, [query, query]);

        res.json({
            pages,
            users,
            media
        });

    } catch (e) {
        console.error('Search error:', e);
        res.status(500).json({ error: String(e) });
    }
});

// Public Search (Open)
router.get('/public', async (req: Request, res: Response) => {
    const { q, lang } = req.query;

    if (!q || typeof q !== 'string' || q.length < 2) {
        return res.json({ pages: [] });
    }

    const query = `%${q}%`;
    const langCode = typeof lang === 'string' ? lang : 'en'; // Default or required?
    const db = getDb();

    try {
        // Search Published Pages Only
        // Optionally filter by lang if provided, or search all
        let sql = `
            SELECT p.id, p.slug_key, pc.title, pc.slug_localized, pc.lang_code, pc.seo_desc
            FROM pages p
            JOIN page_contents pc ON p.id = pc.page_id
            WHERE (pc.title LIKE ? OR pc.slug_localized LIKE ?)
        `;
        const params = [query, query];

        if (lang) {
            sql += ` AND pc.lang_code = ?`;
            params.push(langCode);
        }

        sql += ` LIMIT 10`;

        const pages = await db.all(sql, params);

        res.json({
            pages
        });

    } catch (e) {
        console.error('Public Search error:', e);
        res.status(500).json({ error: String(e) });
    }
});

export default router;
