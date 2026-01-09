"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedAdmin = void 0;
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_1 = require("../index");
const router = express_1.default.Router();
const SECRET = process.env.JWT_SECRET || 'dev_secret_key_123';
const SALT_ROUNDS = 10;
// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const db = (0, index_1.getDb)();
        const user = await db.get('SELECT * FROM users WHERE username = ?', [username]);
        if (!user) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        const match = await bcrypt_1.default.compare(password, user.password_hash);
        if (!match) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role, username: user.username }, SECRET, { expiresIn: '8h' });
        res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
    }
    catch (e) {
        res.status(500).json({ error: String(e) });
    }
});
// GET /api/auth/me - Validate token
router.get('/me', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({ error: 'No token provided' });
        return;
    }
    const token = authHeader.split(' ')[1];
    jsonwebtoken_1.default.verify(token, SECRET, (err, decoded) => {
        if (err) {
            res.status(403).json({ error: 'Invalid token' });
            return;
        }
        res.json({ user: decoded }); // decoded contains { id, role, iat, exp }
    });
});
// Helper to seed admin (Called on server index start)
const seedAdmin = async () => {
    try {
        const db = (0, index_1.getDb)();
        const admin = await db.get('SELECT * FROM users WHERE username = ?', ['admin']);
        if (!admin) {
            const hash = await bcrypt_1.default.hash('admin123', SALT_ROUNDS);
            await db.run('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)', ['admin', hash, 'admin']);
            console.log('Default Admin (admin/admin123) created.');
        }
    }
    catch (e) {
        console.error('Seed Admin Error:', e);
    }
};
exports.seedAdmin = seedAdmin;
exports.default = router;
