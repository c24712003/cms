import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Database Initialization
let db: any;
(async () => {
    db = await open({
        filename: path.join(__dirname, 'db', 'cms.db'),
        driver: sqlite3.Database
    });
    
    // Load Schema
    const fs = require('fs');
    const schemaSql = fs.readFileSync(path.join(__dirname, 'db', 'schema.sql'), 'utf8');
    await db.exec(schemaSql);
    console.log('Database initialized');
})();

// API: Get Languages
app.get('/api/languages', async (req, res) => {
    try {
        const langs = await db.all('SELECT * FROM languages WHERE enabled = 1');
        res.json(langs);
    } catch (e) {
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
        
        const result: Record<string, string> = {};
        rows.forEach((row: any) => {
            result[row.key] = row.value || '';
        });
        res.json(result);
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

app.listen(PORT, () => {
    console.log(`CMS Server running on port ${PORT}`);
});
