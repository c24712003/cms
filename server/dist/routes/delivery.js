"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = require("../index");
const router = express_1.default.Router();
// GET /api/delivery/pages/:slug?lang=en
// Headless API to get page content without admin metadata
router.get('/pages/:slug', async (req, res) => {
    const { slug } = req.params;
    const lang = req.query.lang || 'en-US';
    try {
        const db = (0, index_1.getDb)();
        const page = await db.get('SELECT id FROM pages WHERE slug_key = ?', slug);
        if (!page) {
            res.status(404).json({ error: 'Page not found' });
            return;
        }
        const content = await db.get('SELECT title, seo_title, seo_desc, content_json FROM page_contents WHERE page_id = ? AND lang_code = ?', [page.id, lang]);
        if (!content) {
            res.status(404).json({ error: 'Content not found for this language' });
            return;
        }
        // Parse JSON
        let blocks = [];
        try {
            blocks = JSON.parse(content.content_json);
        }
        catch (e) { }
        // Simplify response for consumers
        res.json({
            meta: {
                title: content.title,
                seo: {
                    title: content.seo_title,
                    description: content.seo_desc
                },
                lang
            },
            blocks: blocks
        });
    }
    catch (e) {
        res.status(500).json({ error: String(e) });
    }
});
// GET /api/delivery/menu/:code
// Headless API to get site menus
router.get('/menu/:code', async (req, res) => {
    const { code } = req.params;
    try {
        const db = (0, index_1.getDb)();
        const menu = await db.get('SELECT items_json FROM menus WHERE code = ?', code);
        if (!menu) {
            res.status(404).json({ error: 'Menu not found' });
            return;
        }
        res.json({
            code,
            items: JSON.parse(menu.items_json)
        });
    }
    catch (e) {
        res.status(500).json({ error: String(e) });
    }
});
exports.default = router;
