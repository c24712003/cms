import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'dev_secret_key_123';

export interface AuthRequest extends Request {
    user?: {
        id: number;
        username: string;
        role: string;
    }
}

// Check if user is logged in
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ error: 'Access token required' });
        return;
    }

    jwt.verify(token, SECRET, (err: any, user: any) => {
        if (err) {
            res.status(403).json({ error: 'Invalid or expired token' });
            return;
        }
        (req as AuthRequest).user = user;
        next();
    });
};

// Check if user has specific role
// Hierarchy: admin > editor > viewer
export const requireRole = (requiredRole: 'admin' | 'editor') => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as AuthRequest).user;

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
