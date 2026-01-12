"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditLogger = void 0;
const index_1 = require("../index");
const sanitizer_1 = require("../utils/sanitizer");
const auditLogger = (actionType) => {
    return (req, res, next) => {
        const originalSend = res.send;
        let responseBody;
        // Intercept response to check success status
        res.send = function (body) {
            responseBody = body;
            return originalSend.apply(this, arguments);
        };
        res.on('finish', async () => {
            try {
                // If the user context is available (assumed from auth middleware)
                const user = req.user;
                if (!user)
                    return;
                const db = (0, index_1.getDb)();
                if (!db)
                    return;
                const status = res.statusCode >= 400 ? 'FAILURE' : 'SUCCESS';
                // Determine resource type and ID from URL
                // Simple heuristic: /api/users/123 -> resource_type=users, resource_id=123
                const parts = req.baseUrl.split('/').filter(Boolean);
                const resourceType = parts.length > 1 ? parts[1] : 'unknown';
                const resourceId = req.params.id || null;
                const logEntry = {
                    user_id: user.id,
                    username: user.username,
                    role: user.role,
                    action: actionType,
                    resource_type: resourceType,
                    resource_id: resourceId,
                    details: JSON.stringify({
                        method: req.method,
                        url: req.originalUrl,
                        body: (0, sanitizer_1.sanitizePayload)(req.body),
                        query: req.query,
                        statusCode: res.statusCode
                    }),
                    ip_address: req.ip,
                    user_agent: req.get('User-Agent') || '',
                    status: status
                };
                await db.run(`
                    INSERT INTO audit_logs 
                    (user_id, username, role, action, resource_type, resource_id, details, ip_address, user_agent, status)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `, [
                    logEntry.user_id,
                    logEntry.username,
                    logEntry.role,
                    logEntry.action,
                    logEntry.resource_type,
                    logEntry.resource_id,
                    logEntry.details,
                    logEntry.ip_address,
                    logEntry.user_agent,
                    logEntry.status
                ]);
            }
            catch (error) {
                console.error('Audit Log writing failed:', error);
            }
        });
        next();
    };
};
exports.auditLogger = auditLogger;
