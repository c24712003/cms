"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logActivity = void 0;
const express_1 = __importDefault(require("express"));
const index_1 = require("../index");
const router = express_1.default.Router();
// Helper function to log activity (to be used by other routes)
const logActivity = async (action, description, type = 'content', userId = null) => {
    try {
        const db = (0, index_1.getDb)();
        if (!db)
            return; // DB might not be ready yet
        await db.run('INSERT INTO audit_logs (action, description, type, user_id) VALUES (?, ?, ?, ?)', [action, description, type, userId]);
    }
    catch (err) {
        console.error('Failed to log activity:', err);
    }
};
exports.logActivity = logActivity;
// Middleware to protect routes
const auth_middleware_1 = require("../middleware/auth.middleware");
router.use(auth_middleware_1.authenticateToken);
router.use((0, auth_middleware_1.requireRole)('admin'));
// GET /api/audit-logs
router.get('/', async (req, res) => {
    try {
        const db = (0, index_1.getDb)();
        const limit = parseInt(req.query.limit) || 50;
        const offset = parseInt(req.query.offset) || 0;
        const action = req.query.action;
        const userId = req.query.user_id;
        let query = 'SELECT * FROM audit_logs WHERE 1=1';
        const params = [];
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
    }
    catch (error) {
        console.error('Error fetching audit logs:', error);
        res.status(500).json({ error: 'Failed to fetch logs' });
    }
});
exports.default = router;
