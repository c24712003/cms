"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = require("../index");
const router = express_1.default.Router();
// GET /api/translations/keys - List all keys
router.get('/keys', async (req, res) => {
    try {
        const db = (0, index_1.getDb)();
        const keys = await db.all('SELECT * FROM translation_keys ORDER BY key ASC');
        res.json(keys);
    }
    catch (e) {
        res.status(500).json({ error: String(e) });
    }
});
// GET /api/translations/:lang - Get compiled map for a language
router.get('/:lang', async (req, res) => {
    const { lang } = req.params;
    try {
        const db = (0, index_1.getDb)();
        // This is the optimized query for the frontend loader
        const rows = await db.all(`
            SELECT t.key, v.value 
            FROM translation_keys t 
            LEFT JOIN translation_values v ON t.key = v.trans_key AND v.lang_code = ?
        `, lang);
        const result = {};
        rows.forEach((row) => {
            if (row.value) {
                result[row.key] = row.value;
            }
        });
        res.json(result);
    }
    catch (e) {
        res.status(500).json({ error: String(e) });
    }
});
// POST /api/translations/keys - Create key
router.post('/keys', async (req, res) => {
    const { key, namespace, description } = req.body;
    try {
        const db = (0, index_1.getDb)();
        await db.run('INSERT INTO translation_keys (key, namespace, description) VALUES (?, ?, ?)', [key, namespace || 'common', description]);
        res.status(201).json({ success: true });
    }
    catch (e) {
        res.status(500).json({ error: String(e) });
    }
});
// PUT /api/translations - Bulk update/upsert value
// Payload: { key: string, lang: string, value: string }
router.put('/', async (req, res) => {
    const { key, lang, value } = req.body;
    try {
        const db = (0, index_1.getDb)();
        await db.run(`
            INSERT INTO translation_values (trans_key, lang_code, value)
            VALUES (?, ?, ?)
            ON CONFLICT(trans_key, lang_code) DO UPDATE SET value = excluded.value
        `, [key, lang, value]);
        res.json({ success: true });
    }
    catch (e) {
        res.status(500).json({ error: String(e) });
    }
});
exports.default = router;
