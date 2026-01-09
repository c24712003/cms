"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite_1 = require("sqlite");
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Database Initialization
let db;
(async () => {
    db = await (0, sqlite_1.open)({
        filename: path_1.default.join(__dirname, 'db', 'cms.db'),
        driver: sqlite3_1.default.Database
    });
    // Load Schema
    const fs = require('fs');
    const schemaSql = fs.readFileSync(path_1.default.join(__dirname, 'db', 'schema.sql'), 'utf8');
    await db.exec(schemaSql);
    console.log('Database initialized');
})();
// API: Get Languages
app.get('/api/languages', async (req, res) => {
    try {
        const langs = await db.all('SELECT * FROM languages WHERE enabled = 1');
        res.json(langs);
    }
    catch (e) {
        res.status(500).json({ error: String(e) });
    }
});
// API: Get Translations (by Lang)
app.get('/api/translations/:lang', async (req, res) => {
    const { lang } = req.params;
    try {
        const rows = await db.all(`
            SELECT t.key, v.value 
            FROM translation_keys t 
            LEFT JOIN translation_values v ON t.key = v.trans_key AND v.lang_code = ?
        `, lang);
        const result = {};
        rows.forEach((row) => {
            result[row.key] = row.value || '';
        });
        res.json(result);
    }
    catch (e) {
        res.status(500).json({ error: String(e) });
    }
});
app.listen(PORT, () => {
    console.log(`CMS Server running on port ${PORT}`);
});
