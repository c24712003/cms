"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = require("../index");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// GET /api/menus - List all menus
router.get('/', async (req, res) => {
    try {
        const db = (0, index_1.getDb)();
        const menus = await db.all('SELECT * FROM menus');
        res.json(menus);
    }
    catch (e) {
        res.status(500).json({ error: String(e) });
    }
});
// GET /api/menus/:code - Get specific menu by code (public)
router.get('/:code', async (req, res) => {
    try {
        const db = (0, index_1.getDb)();
        const menu = await db.get('SELECT * FROM menus WHERE code = ?', [req.params.code]);
        if (menu) {
            menu.items_json = JSON.parse(menu.items_json);
            res.json(menu);
        }
        else {
            res.status(404).json({ error: 'Menu not found' });
        }
    }
    catch (e) {
        res.status(500).json({ error: String(e) });
    }
});
// POST /api/menus - Create/Update Menu (Admin only)
router.post('/', auth_1.authenticateToken, async (req, res) => {
    const { code, items } = req.body;
    try {
        const db = (0, index_1.getDb)();
        const existing = await db.get('SELECT id FROM menus WHERE code = ?', [code]);
        const jsonStr = JSON.stringify(items);
        if (existing) {
            await db.run('UPDATE menus SET items_json = ? WHERE code = ?', [jsonStr, code]);
        }
        else {
            await db.run('INSERT INTO menus (code, items_json) VALUES (?, ?)', [code, jsonStr]);
        }
        res.json({ success: true });
    }
    catch (e) {
        res.status(500).json({ error: String(e) });
    }
});
exports.default = router;
