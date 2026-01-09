import express from 'express';
import { getDb } from '../index';

const router = express.Router();

// GET /api/languages - List all
router.get('/', async (req, res) => {
    try {
        const db = getDb();
        // Return all for admin, usually admin wants to see disabled ones too
        const langs = await db.all('SELECT * FROM languages ORDER BY is_default DESC');
        res.json(langs);
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

// POST /api/languages - Add new
router.post('/', async (req, res) => {
    const { code, name, direction } = req.body;
    try {
        const db = getDb();
        await db.run(
            'INSERT INTO languages (code, name, direction, enabled) VALUES (?, ?, ?, 1)',
            [code, name, direction || 'ltr']
        );
        res.status(201).json({ success: true });
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

// PUT /api/languages/:code - Update
router.put('/:code', async (req, res) => {
    const { code } = req.params;
    const { name, is_default, enabled, direction } = req.body;
    try {
        const db = getDb();

        if (is_default) {
            // Unset other defaults
            await db.run('UPDATE languages SET is_default = 0');
        }

        await db.run(`
            UPDATE languages 
            SET name = COALESCE(?, name), 
                is_default = COALESCE(?, is_default), 
                enabled = COALESCE(?, enabled),
                direction = COALESCE(?, direction)
            WHERE code = ?
        `, [name, is_default, enabled, direction, code]);

        res.json({ success: true });
    } catch (e) {
        // console.error(e);
        res.status(500).json({ error: String(e) });
    }
});

// DELETE /api/languages/:code
router.delete('/:code', async (req, res) => {
    const { code } = req.params;
    try {
        const db = getDb();
        await db.run('DELETE FROM languages WHERE code = ?', [code]);
        // Also cleanup translations?? Optional for now.
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

export default router;
