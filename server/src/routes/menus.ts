import express from 'express';
import { getDb } from '../index';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// GET /api/menus - List all menus
router.get('/', async (req, res) => {
    try {
        const db = getDb();
        const menus = await db.all('SELECT * FROM menus');
        res.json(menus);
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

// GET /api/menus/:code - Get specific menu by code (public)
router.get('/:code', async (req, res) => {
    try {
        const db = getDb();
        const menu = await db.get('SELECT * FROM menus WHERE code = ?', [req.params.code]);
        if (menu) {
            menu.items_json = JSON.parse(menu.items_json);
            res.json(menu);
        } else {
            res.status(404).json({ error: 'Menu not found' });
        }
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

// POST /api/menus - Create/Update Menu (Admin only)
router.post('/', authenticateToken, async (req, res) => {
    const { code, items } = req.body;
    try {
        const db = getDb();
        const existing = await db.get('SELECT id FROM menus WHERE code = ?', [code]);

        const jsonStr = JSON.stringify(items);

        if (existing) {
            await db.run('UPDATE menus SET items_json = ? WHERE code = ?', [jsonStr, code]);
        } else {
            await db.run('INSERT INTO menus (code, items_json) VALUES (?, ?)', [code, jsonStr]);
        }
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

export default router;
