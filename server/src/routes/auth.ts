import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getDb } from '../index';

const router = express.Router();
const SECRET = process.env.JWT_SECRET || 'dev_secret_key_123';
const SALT_ROUNDS = 10;

// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const db = getDb();
        const user = await db.get('SELECT * FROM users WHERE username = ?', [username]);

        if (!user) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        const token = jwt.sign({ id: user.id, role: user.role, username: user.username }, SECRET, { expiresIn: '8h' });
        res.json({ token, user: { id: user.id, username: user.username, role: user.role } });

    } catch (e) {
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

    jwt.verify(token, SECRET, (err: any, decoded: any) => {
        if (err) {
            res.status(403).json({ error: 'Invalid token' });
            return;
        }
        res.json({ user: decoded }); // decoded contains { id, role, iat, exp }
    });
});

// Helper to seed admin (Called on server index start)
export const seedAdmin = async () => {
    try {
        const db = getDb();
        const admin = await db.get('SELECT * FROM users WHERE username = ?', ['admin']);
        if (!admin) {
            const hash = await bcrypt.hash('admin123', SALT_ROUNDS);
            await db.run('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)', ['admin', hash, 'admin']);
            console.log('Default Admin (admin/admin123) created.');
        }
    } catch (e) {
        console.error('Seed Admin Error:', e);
    }
}

export default router;
