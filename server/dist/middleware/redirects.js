"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redirectMiddleware = redirectMiddleware;
const index_1 = require("../index");
/**
 * Redirect Middleware
 * Checks if the requested path has a redirect rule and executes it.
 * Must be placed early in the middleware chain.
 */
async function redirectMiddleware(req, res, next) {
    // Skip for API routes and static files
    if (req.path.startsWith('/api/') ||
        req.path.startsWith('/uploads/') ||
        req.path.includes('.')) {
        return next();
    }
    try {
        const db = (0, index_1.getDb)();
        if (!db) {
            return next();
        }
        // Check for redirect rule
        const redirect = await db.get(`
            SELECT to_path, status_code 
            FROM redirects 
            WHERE from_path = ? AND is_active = 1
        `, [req.path]);
        if (redirect) {
            // Increment hit count (fire and forget)
            db.run('UPDATE redirects SET hit_count = hit_count + 1 WHERE from_path = ?', [req.path])
                .catch(() => { }); // Ignore errors
            // Perform redirect
            return res.redirect(redirect.status_code, redirect.to_path);
        }
        next();
    }
    catch (e) {
        // Don't break the app on redirect errors
        console.error('Redirect middleware error:', e);
        next();
    }
}
exports.default = redirectMiddleware;
