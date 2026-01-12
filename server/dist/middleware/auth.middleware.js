"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET = process.env.JWT_SECRET || 'dev_secret_key_123';
// Check if user is logged in
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        res.status(401).json({ error: 'Access token required' });
        return;
    }
    jsonwebtoken_1.default.verify(token, SECRET, (err, user) => {
        if (err) {
            res.status(403).json({ error: 'Invalid or expired token' });
            return;
        }
        req.user = user;
        next();
    });
};
exports.authenticateToken = authenticateToken;
// Check if user has specific role
// Hierarchy: admin > editor > viewer
const requireRole = (requiredRole) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user) {
            res.status(401).json({ error: 'User not authenticated' });
            return;
        }
        if (user.role === 'admin') {
            next(); // Admin can do anything
            return;
        }
        if (requiredRole === 'editor' && user.role === 'editor') {
            next();
            return;
        }
        res.status(403).json({ error: `Permission denied. Required role: ${requiredRole}` });
    };
};
exports.requireRole = requireRole;
