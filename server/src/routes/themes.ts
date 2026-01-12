import express, { Request, Response } from 'express';
import { getDb } from '../index';
import { logActivity } from './audit-logs';

const router = express.Router();

// GET /api/themes - List all themes
router.get('/', async (req: Request, res: Response) => {
    try {
        const db = getDb();
        // Get themes with page count
        const themes = await db.all(`
            SELECT 
                t.*, 
                COUNT(p.id) as page_count,
                GROUP_CONCAT(p.slug_key || ':' || COALESCE(pc.title, p.slug_key)) as pages_info
            FROM themes t 
            LEFT JOIN pages p ON t.id = p.theme_id 
            LEFT JOIN page_contents pc ON p.id = pc.page_id AND pc.lang_code = 'en-US' -- Default to en-US for preview
            GROUP BY t.id 
            ORDER BY t.created_at DESC
        `);

        // Parse pages_info
        const result = themes.map((t: any) => {
            const pages = t.pages_info ? t.pages_info.split(',').map((p: string) => {
                const [slug, title] = p.split(':');
                return { slug, title };
            }) : [];
            return { ...t, pages };
        });

        res.json(result);
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

// PATCH /api/themes/:id/activate - Activate a theme
router.patch('/:id/activate', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const db = getDb();

        // Transaction to ensure atomicity
        await db.run('BEGIN TRANSACTION');

        // 1. Deactivate all
        await db.run('UPDATE themes SET is_active = 0');

        // 2. Activate target
        const result = await db.run('UPDATE themes SET is_active = 1 WHERE id = ?', [id]);

        if (result.changes === 0) {
            await db.run('ROLLBACK');
            res.status(404).json({ error: 'Theme not found' });
            return;
        }

        await db.run('COMMIT');

        await logActivity('Theme Activated', `Activated theme ID ${id} `, 'system');
        res.json({ success: true });

    } catch (e) {
        await getDb().run('ROLLBACK'); // Safety rollback attempt
        res.status(500).json({ error: String(e) });
    }
});

// DELETE /api/themes/:id - Delete a theme and its pages
router.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const db = getDb();
        const theme = await db.get('SELECT * FROM themes WHERE id = ?', [id]);

        if (!theme) {
            res.status(404).json({ error: 'Theme not found' });
            return;
        }

        if (theme.is_active) {
            res.status(400).json({ error: 'Cannot delete the active theme' });
            return;
        }

        // Cascade delete (manually since SQLite FK cascade might not be on)
        // Delete contents
        await db.run(`
            DELETE FROM page_contents 
            WHERE page_id IN(SELECT id FROM pages WHERE theme_id = ?)
        `, [id]);

        // Delete pages
        await db.run('DELETE FROM pages WHERE theme_id = ?', [id]);

        // Delete theme
        await db.run('DELETE FROM themes WHERE id = ?', [id]);

        await logActivity('Theme Deleted', `Deleted theme ${theme.name} (ID: ${id})`, 'system');
        res.json({ success: true });

    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

export default router;
