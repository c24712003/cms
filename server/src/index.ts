import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Database Initialization
let db: any;
(async () => {
    db = await open({
        filename: path.join(__dirname, 'db', 'cms.db'),
        driver: sqlite3.Database
    });

    // Load Schema
    const fs = require('fs');
    const schemaSql = fs.readFileSync(path.join(__dirname, 'db', 'schema.sql'), 'utf8');
    await db.exec(schemaSql);
    console.log('Database initialized');

    // Load SEO Schema Extensions (safely ignore if columns already exist)
    try {
        const seoSchemaSql = fs.readFileSync(path.join(__dirname, 'db', 'schema_seo_update.sql'), 'utf8');
        // Execute statement by statement to handle ALTER errors gracefully
        const statements = seoSchemaSql.split(';').filter((s: string) => s.trim());
        for (const stmt of statements) {
            try {
                await db.exec(stmt + ';');
            } catch (e: any) {
                // Ignore "duplicate column" errors
                if (!e.message?.includes('duplicate column')) {
                    console.warn('SEO schema statement warning:', e.message);
                }
            }
        }
        console.log('SEO schema extensions loaded');
    } catch (e) {
        console.log('SEO schema file not found or error, skipping');
    }

    // Load Audit Schema Extensions
    try {
        const auditSchemaSql = fs.readFileSync(path.join(__dirname, 'db', 'schema_audit_update.sql'), 'utf8');
        const statements = auditSchemaSql.split(';').filter((s: string) => s.trim());
        for (const stmt of statements) {
            try {
                await db.exec(stmt + ';');
            } catch (e: any) {
                if (!e.message?.includes('duplicate column')) {
                    console.warn('Audit schema statement warning:', e.message);
                }
            }
        }
        console.log('Audit schema extensions loaded');
    } catch (e) {
        console.log('Audit schema file not found or error, skipping', e);
    }

    // Seed Admin
    const { seedAdmin } = require('./routes/auth');
    await seedAdmin();
    // Run schema again to ensure new tables if any
    await db.exec(schemaSql);
})();

export const getDb = () => db;

// Import Routes
import languagesRouter from './routes/languages';
import translationsRouter from './routes/translations';
import pagesRouter from './routes/pages';
import sitemapRouter from './routes/sitemap';
import robotsRouter from './routes/robots';
import seoRouter from './routes/seo';
import searchConsoleRouter from './routes/search-console';
import authRouter, { seedAdmin } from './routes/auth';
import mediaRouter from './routes/media';
import menusRouter from './routes/menus';
import deliveryRouter from './routes/delivery';
import usersRouter from './routes/users';
import searchRouter from './routes/search';
import auditLogsRouter from './routes/audit-logs';
import healthRouter from './routes/health';

// Import Middleware
import redirectMiddleware from './middleware/redirects';

// Serve Uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Apply Redirect Middleware (must be early to catch redirects)
app.use(redirectMiddleware);

// Register Routes
app.use('/api/auth', authRouter);
app.use('/api/media', mediaRouter);
app.use('/api/menus', menusRouter);
app.use('/api/languages', languagesRouter);
app.use('/api/translations', translationsRouter);
app.use('/api/pages', pagesRouter);
app.use('/api/delivery', deliveryRouter);
app.use('/api/users', usersRouter);
app.use('/api/seo', seoRouter);
app.use('/api/search-console', searchConsoleRouter);
app.use('/api/search', searchRouter);
app.use('/api/audit-logs', auditLogsRouter);
app.use('/api/health', healthRouter);
app.use('/', sitemapRouter); // Root level for /sitemap.xml
app.use('/', robotsRouter);  // Root level for /robots.txt

app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`CMS Server running on port ${PORT}`);
});

