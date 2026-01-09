import express from 'express';
import { getDb } from '../index';

// Fix TS7006: Parameter 'req' implicitly has an 'any' type.
// We should import types, but for now we are using skipLibCheck: true usually.
// Adding explicit types for safety.
import { Request, Response } from 'express';

const router = express.Router();

// GET /api/translations/keys - List all keys
router.get('/keys', async (req: Request, res: Response) => {
    try {
        const db = getDb();
        const keys = await db.all('SELECT * FROM translation_keys ORDER BY key ASC');
        res.json(keys);
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

// GET /api/translations/:lang - Get compiled map for a language
router.get('/:lang', async (req: Request, res: Response) => {
    const { lang } = req.params;
    try {
        const db = getDb();
        // This is the optimized query for the frontend loader
        const rows = await db.all(`
            SELECT t.key, v.value 
            FROM translation_keys t 
            LEFT JOIN translation_values v ON t.key = v.trans_key AND v.lang_code = ?
        `, lang);

        const result: Record<string, string> = {};
        rows.forEach((row: any) => {
            if (row.value) {
                result[row.key] = row.value;
            }
        });
        res.json(result);
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

// POST /api/translations/keys - Create key
router.post('/keys', async (req: Request, res: Response) => {
    const { key, namespace, description } = req.body;
    try {
        const db = getDb();
        await db.run(
            'INSERT INTO translation_keys (key, namespace, description) VALUES (?, ?, ?)',
            [key, namespace || 'common', description]
        );
        res.status(201).json({ success: true });
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

// PUT /api/translations - Bulk update/upsert value
// Payload: { key: string, lang: string, value: string }
router.put('/', async (req: Request, res: Response) => {
    const { key, lang, value } = req.body;
    try {
        const db = getDb();
        await db.run(`
            INSERT INTO translation_values (trans_key, lang_code, value)
            VALUES (?, ?, ?)
            ON CONFLICT(trans_key, lang_code) DO UPDATE SET value = excluded.value
        `, [key, lang, value]);

        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

export default router;
