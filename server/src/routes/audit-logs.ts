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

// GET /api/audit-logs
router.get('/', async (req, res) => {
    try {
        const db = getDb();
        const limit = parseInt(req.query.limit as string) || 10;

        const logs = await db.all(
            'SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT ?',
            [limit]
        );

        res.json(logs);
    } catch (error) {
        console.error('Error fetching audit logs:', error);
        res.status(500).json({ error: 'Failed to fetch logs' });
    }
});

export default router;
