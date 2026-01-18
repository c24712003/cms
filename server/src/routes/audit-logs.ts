import express from 'express';
import { getDb } from '../index';

const router = express.Router();

// Helper function to log activity (to be used by other routes)
// Helper function to log activity (to be used by other routes)
export interface LogActivityOptions {
    action: string;
    description: string;
    type?: 'content' | 'system' | 'security';
    userId?: number | null;
    username?: string;
    role?: string;
    resourceType?: string;
    resourceId?: string;
    status?: 'SUCCESS' | 'FAILURE';
    details?: any;
    ip?: string;
}

export const logActivity = async (options: LogActivityOptions) => {
    try {
        const db = getDb();
        if (!db) return; // DB might not be ready yet

        const {
            action,
            description,
            type = 'content',
            userId = null,
            username = 'System',
            role = 'N/A',
            resourceType = null,
            resourceId = null,
            status = 'SUCCESS',
            details = null,
            ip = null
        } = options;

        await db.run(
            `INSERT INTO audit_logs 
            (action, description, type, user_id, username, role, resource_type, resource_id, status, details, ip_address) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                action,
                description,
                type,
                userId,
                username,
                role,
                resourceType,
                resourceId,
                status,
                details ? JSON.stringify(details) : null,
                ip
            ]
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
