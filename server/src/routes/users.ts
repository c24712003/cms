

import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { getDb } from '../index';
import { authenticateToken, requireRole } from '../middleware/auth.middleware';
import { auditLogger } from '../middleware/audit-logger';

const router = express.Router();
const SALT_ROUNDS = 10;

// Middleware: All user management requires Admin
router.use(authenticateToken);
router.use(requireRole('admin'));

// GET /api/users - List all users
router.get('/', async (req: Request, res: Response) => {
    try {
        const db = getDb();
        const users = await db.all('SELECT id, username, role, is_active FROM users ORDER BY id ASC');
        res.json(users);
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

// POST /api/users - Create User
router.post('/', auditLogger('CREATE_USER'), async (req: Request, res: Response) => {
    const { username, password, role } = req.body;
    if (!username || !password || !role) {
        res.status(400).json({ error: 'Username, password, and role are required' });
        return;
    }

    try {
        const db = getDb();
        const hash = await bcrypt.hash(password, SALT_ROUNDS);

        await db.run(
            'INSERT INTO users (username, password_hash, role, is_active) VALUES (?, ?, ?, 1)',
            [username, hash, role]
        );

        res.status(201).json({ success: true });
    } catch (e: any) {
        if (e.message && e.message.includes('UNIQUE constraint failed')) {
            res.status(409).json({ error: 'Username already exists' });
        } else {
            res.status(500).json({ error: String(e) });
        }
    }
});

// PUT /api/users/:id - Update User (Role/Status)
router.put('/:id', auditLogger('UPDATE_USER'), async (req: Request, res: Response) => {
    const { id } = req.params;
    const { role, is_active } = req.body;

    try {
        const db = getDb();
        const updates: string[] = [];
        const params: any[] = [];

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
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

// PUT /api/users/:id/password - Reset Password
router.put('/:id/password', auditLogger('UPDATE_PASSWORD'), async (req: Request, res: Response) => {
    const { id } = req.params;
    const { password } = req.body;

    if (!password) {
        res.status(400).json({ error: 'Password is required' });
        return;
    }

    try {
        const db = getDb();
        const hash = await bcrypt.hash(password, SALT_ROUNDS);
        await db.run('UPDATE users SET password_hash = ? WHERE id = ?', [hash, id]);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

// DELETE /api/users/:id - Delete User (Optional, preferred is deactivate)
router.delete('/:id', auditLogger('DELETE_USER'), async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const db = getDb();
        await db.run('DELETE FROM users WHERE id = ?', [id]);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

export default router;

