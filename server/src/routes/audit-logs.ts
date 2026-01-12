import express from 'express';
import { getDb } from '../index';

const router = express.Router();

// Helper function to log activity (to be used by other routes)
export const logActivity = async (action: string, description: string, type: 'content' | 'system' | 'security' = 'content', userId: number | null = null) => {
    try {
        const db = getDb();
        if (!db) return; // DB might not be ready yet

        await db.run(
            'INSERT INTO audit_logs (action, description, type, user_id) VALUES (?, ?, ?, ?)',
            [action, description, type, userId]
        );
    } catch (err) {
        console.error('Failed to log activity:', err);
    }
};

// Middleware to protect routes
import { authenticateToken, requireRole } from '../middleware/auth.middleware';

router.use(authenticateToken);
router.use(requireRole('admin'));

// GET /api/audit-logs
router.get('/', async (req, res) => {
    try {
        const db = getDb();
        const limit = parseInt(req.query.limit as string) || 50;
        const offset = parseInt(req.query.offset as string) || 0;
        const action = req.query.action as string;
        const userId = req.query.user_id;

        let query = 'SELECT * FROM audit_logs WHERE 1=1';
        const params: any[] = [];

        if (action) {
            query += ' AND action = ?';
            params.push(action);
        }
        if (userId) {
            query += ' AND user_id = ?';
            params.push(userId);
        }

        query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
        params.push(limit, offset);

        const logs = await db.all(query, params);

        // Get total count for pagination
        const countResult = await db.get('SELECT COUNT(*) as count FROM audit_logs');

        res.json({
            data: logs,
            total: countResult?.count || 0,
            limit,
            offset
        });
    } catch (error) {
        console.error('Error fetching audit logs:', error);
        res.status(500).json({ error: 'Failed to fetch logs' });
    }
});

export default router;
