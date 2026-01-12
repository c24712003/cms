"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const index_1 = require("../index");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
const SALT_ROUNDS = 10;
// Middleware: All user management requires Admin
router.use(auth_middleware_1.authenticateToken);
router.use((0, auth_middleware_1.requireRole)('admin'));
// GET /api/users - List all users
router.get('/', async (req, res) => {
    try {
        const db = (0, index_1.getDb)();
        const users = await db.all('SELECT id, username, role, is_active FROM users ORDER BY id ASC');
        res.json(users);
    }
    catch (e) {
        res.status(500).json({ error: String(e) });
    }
});
// POST /api/users - Create User
router.post('/', async (req, res) => {
    const { username, password, role } = req.body;
    if (!username || !password || !role) {
        res.status(400).json({ error: 'Username, password, and role are required' });
        return;
    }
    try {
        const db = (0, index_1.getDb)();
        const hash = await bcrypt_1.default.hash(password, SALT_ROUNDS);
        await db.run('INSERT INTO users (username, password_hash, role, is_active) VALUES (?, ?, ?, 1)', [username, hash, role]);
        res.status(201).json({ success: true });
    }
    catch (e) {
        if (e.message && e.message.includes('UNIQUE constraint failed')) {
            res.status(409).json({ error: 'Username already exists' });
        }
        else {
            res.status(500).json({ error: String(e) });
        }
    }
});
// PUT /api/users/:id - Update User (Role/Status)
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { role, is_active } = req.body;
    try {
        const db = (0, index_1.getDb)();
        const updates = [];
        const params = [];
        if (role) {
            updates.push('role = ?');
            params.push(role);
        }
        if (is_active !== undefined) {
            updates.push('is_active = ?');
            params.push(is_active ? 1 : 0);
        }
        if (updates.length > 0) {
            params.push(id);
            await db.run(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, params);
        }
        res.json({ success: true });
    }
    catch (e) {
        res.status(500).json({ error: String(e) });
    }
});
// PUT /api/users/:id/password - Reset Password
router.put('/:id/password', async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;
    if (!password) {
        res.status(400).json({ error: 'Password is required' });
        return;
    }
    try {
        const db = (0, index_1.getDb)();
        const hash = await bcrypt_1.default.hash(password, SALT_ROUNDS);
        await db.run('UPDATE users SET password_hash = ? WHERE id = ?', [hash, id]);
        res.json({ success: true });
    }
    catch (e) {
        res.status(500).json({ error: String(e) });
    }
});
// DELETE /api/users/:id - Delete User (Optional, preferred is deactivate)
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const db = (0, index_1.getDb)();
        await db.run('DELETE FROM users WHERE id = ?', [id]);
        res.json({ success: true });
    }
    catch (e) {
        res.status(500).json({ error: String(e) });
    }
});
exports.default = router;
