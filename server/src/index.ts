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
import authRouter, { seedAdmin } from './routes/auth';
import mediaRouter from './routes/media';
import menusRouter from './routes/menus';

// Serve Uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Register Routes
app.use('/api/auth', authRouter);
app.use('/api/media', mediaRouter);
app.use('/api/menus', menusRouter);
app.use('/api/languages', languagesRouter);
app.use('/api/translations', translationsRouter);
app.use('/api/pages', pagesRouter);
app.use('/', sitemapRouter); // Root level for /sitemap.xml

app.listen(PORT, () => {
    console.log(`CMS Server running on port ${PORT}`);
});
