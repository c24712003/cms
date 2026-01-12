"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = require("../index");
const audit_logs_1 = require("./audit-logs");
const router = express_1.default.Router();
// GET /api/themes - List all themes
router.get('/', async (req, res) => {
    try {
        const db = (0, index_1.getDb)();
        // Get themes with page count
        const themes = await db.all(`
            SELECT 
                t.*, 
                COUNT(p.id) as page_count,
                GROUP_CONCAT(p.id || ':' || p.slug_key || ':' || COALESCE(pc.title, p.slug_key)) as pages_info
            FROM themes t 
            LEFT JOIN pages p ON t.id = p.theme_id 
            LEFT JOIN page_contents pc ON p.id = pc.page_id AND pc.lang_code = 'en-US' -- Default to en-US for preview
            GROUP BY t.id 
            ORDER BY t.created_at DESC
        `);
        // Parse pages_info
        const result = themes.map((t) => {
            const pages = t.pages_info ? t.pages_info.split(',').map((p) => {
                const parts = p.split(':');
                const id = parseInt(parts[0]);
                const slug = parts[1];
                const title = parts.slice(2).join(':'); // Handle titles with colons
                return { id, slug, title };
            }) : [];
            return { ...t, pages };
        });
        res.json(result);
    }
    catch (e) {
        res.status(500).json({ error: String(e) });
    }
});
// POST /api/themes - Create a new theme
router.post('/', async (req, res) => {
    const { name, template_id } = req.body;
    if (!name || !template_id) {
        res.status(400).json({ error: 'Name and Template ID are required' });
        return;
    }
    try {
        const db = (0, index_1.getDb)();
        const result = await db.run('INSERT INTO themes (name, template_id, is_active, created_at) VALUES (?, ?, 0, datetime("now"))', [name, template_id]);
        const newThemeId = result.lastID;
        await (0, audit_logs_1.logActivity)('Theme Created', `Created theme "${name}" (ID: ${newThemeId})`, 'system');
        res.json({ success: true, id: newThemeId });
    }
    catch (e) {
        res.status(500).json({ error: String(e) });
    }
});
// POST /api/themes/seed - Seed sample theme
router.post('/seed', async (req, res) => {
    try {
        const db = (0, index_1.getDb)();
        const sampleTheme = require('../seeds/sample-theme.json'); // Load seed file
        // Transaction
        await db.run('BEGIN TRANSACTION');
        const themeData = sampleTheme[0]; // Assuming one theme for now
        // Check availability
        // Check availability
        const existing = await db.get('SELECT id FROM themes WHERE name = ?', [themeData.name]);
        let themeId;
        if (existing) {
            themeId = existing.id;
            console.log(`Theme "${themeData.name}" exists (ID: ${themeId}). Updating content...`);
        }
        else {
            // 1. Create Theme
            const themeResult = await db.run('INSERT INTO themes (name, template_id, is_active, created_at) VALUES (?, ?, 0, datetime("now"))', [themeData.name, 'custom']);
            themeId = themeResult.lastID;
        }
        // 2. Create/Update Pages & Content
        for (const page of themeData.pages) {
            // Check for existing page with same slug
            const existingPage = await db.get('SELECT id FROM pages WHERE slug_key = ?', [page.slug]);
            let pageId;
            if (existingPage) {
                // Reuse existing page
                pageId = existingPage.id;
                // Optionally update template if needed
            }
            else {
                const pageResult = await db.run('INSERT INTO pages (theme_id, slug_key, template) VALUES (?, ?, ?)', [themeId, page.slug, 'default']);
                pageId = pageResult.lastID;
            }
            // Insert or Update Content (English Default)
            await db.run(`INSERT OR REPLACE INTO page_contents (page_id, lang_code, title, content_json, updated_at) 
                  VALUES (?, ?, ?, ?, datetime("now"))`, [pageId, 'en-US', page.title, JSON.stringify(page.blocks)]);
        }
        await db.run('COMMIT');
        await (0, audit_logs_1.logActivity)('Theme Seeded', `Installed sample theme "${themeData.name}"`, 'system');
        res.json({ success: true, message: 'Theme installed successfully' });
    }
    catch (e) {
        await (0, index_1.getDb)().run('ROLLBACK');
        res.status(500).json({ error: String(e) });
    }
});
// POST /api/themes/seed/construction - Seed construction company theme (Traditional Chinese)
router.post('/seed/construction', async (req, res) => {
    try {
        const db = (0, index_1.getDb)();
        const constructionTheme = require('../seeds/construction-theme.json');
        await db.run('BEGIN TRANSACTION');
        const themeData = constructionTheme[0];
        // Check if theme already exists
        const existing = await db.get('SELECT id FROM themes WHERE name = ?', [themeData.name]);
        let themeId;
        if (existing) {
            themeId = existing.id;
            console.log(`Theme "${themeData.name}" exists (ID: ${themeId}). Updating content...`);
        }
        else {
            const themeResult = await db.run('INSERT INTO themes (name, template_id, is_active, created_at) VALUES (?, ?, 0, datetime("now"))', [themeData.name, 'construction']);
            themeId = themeResult.lastID;
        }
        // Create/Update Pages & Content
        for (const page of themeData.pages) {
            const existingPage = await db.get('SELECT id FROM pages WHERE slug_key = ?', [page.slug]);
            let pageId;
            if (existingPage) {
                pageId = existingPage.id;
                // Update theme association
                await db.run('UPDATE pages SET theme_id = ? WHERE id = ?', [themeId, pageId]);
            }
            else {
                const pageResult = await db.run('INSERT INTO pages (theme_id, slug_key, template) VALUES (?, ?, ?)', [themeId, page.slug, 'default']);
                pageId = pageResult.lastID;
            }
            // Insert content for Traditional Chinese (zh-TW)
            await db.run(`INSERT OR REPLACE INTO page_contents (page_id, lang_code, title, content_json, updated_at) 
                  VALUES (?, ?, ?, ?, datetime("now"))`, [pageId, 'zh-TW', page.title, JSON.stringify(page.blocks)]);
            // Also create an English fallback for the title
            await db.run(`INSERT OR REPLACE INTO page_contents (page_id, lang_code, title, content_json, updated_at) 
                  VALUES (?, ?, ?, ?, datetime("now"))`, [pageId, 'en-US', page.title, JSON.stringify(page.blocks)]);
        }
        await db.run('COMMIT');
        await (0, audit_logs_1.logActivity)('Theme Seeded', `Installed construction theme "${themeData.name}"`, 'system');
        res.json({
            success: true,
            message: `營建工程主題已安裝成功！包含 ${themeData.pages.length} 個頁面。`,
            themeId
        });
    }
    catch (e) {
        await (0, index_1.getDb)().run('ROLLBACK');
        res.status(500).json({ error: String(e) });
    }
});
// PATCH /api/themes/:id/activate - Activate a theme
router.patch('/:id/activate', async (req, res) => {
    const { id } = req.params;
    try {
        const db = (0, index_1.getDb)();
        // Transaction to ensure atomicity
        await db.run('BEGIN TRANSACTION');
        // 1. Deactivate all
        await db.run('UPDATE themes SET is_active = 0');
        // 2. Activate target
        const result = await db.run('UPDATE themes SET is_active = 1 WHERE id = ?', [id]);
        if (result.changes === 0) {
            await db.run('ROLLBACK');
            res.status(404).json({ error: 'Theme not found' });
            return;
        }
        await db.run('COMMIT');
        await (0, audit_logs_1.logActivity)('Theme Activated', `Activated theme ID ${id} `, 'system');
        res.json({ success: true });
    }
    catch (e) {
        await (0, index_1.getDb)().run('ROLLBACK'); // Safety rollback attempt
        res.status(500).json({ error: String(e) });
    }
});
// PUT /api/themes/:id/pages - Update pages associated with a theme
router.put('/:id/pages', async (req, res) => {
    const { id } = req.params;
    const { pageIds } = req.body; // Array of page IDs
    if (!Array.isArray(pageIds)) {
        res.status(400).json({ error: 'pageIds must be an array' });
        return;
    }
    try {
        const db = (0, index_1.getDb)();
        await db.run('BEGIN TRANSACTION');
        // 1. Remove all pages from this theme (set theme_id = null)
        await db.run('UPDATE pages SET theme_id = NULL WHERE theme_id = ?', [id]);
        // 2. Add selected pages to this theme
        if (pageIds.length > 0) {
            // Create placeholders for IN clause (?, ?, ?)
            const placeholders = pageIds.map(() => '?').join(',');
            await db.run(`UPDATE pages SET theme_id = ? WHERE id IN (${placeholders})`, [id, ...pageIds]);
        }
        await db.run('COMMIT');
        await (0, audit_logs_1.logActivity)('Theme Pages Updated', `Updated pages for theme ID ${id}`, 'system');
        res.json({ success: true });
    }
    catch (e) {
        await (0, index_1.getDb)().run('ROLLBACK');
        res.status(500).json({ error: String(e) });
    }
});
// DELETE /api/themes/:id - Delete a theme and its pages
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const db = (0, index_1.getDb)();
        const theme = await db.get('SELECT * FROM themes WHERE id = ?', [id]);
        if (!theme) {
            res.status(404).json({ error: 'Theme not found' });
            return;
        }
        if (theme.is_active) {
            res.status(400).json({ error: 'Cannot delete the active theme' });
            return;
        }
        // Cascade delete (manually since SQLite FK cascade might not be on)
        // Delete contents
        await db.run(`
            DELETE FROM page_contents 
            WHERE page_id IN(SELECT id FROM pages WHERE theme_id = ?)
        `, [id]);
        // Delete pages
        await db.run('DELETE FROM pages WHERE theme_id = ?', [id]);
        // Delete theme
        await db.run('DELETE FROM themes WHERE id = ?', [id]);
        await (0, audit_logs_1.logActivity)('Theme Deleted', `Deleted theme ${theme.name} (ID: ${id})`, 'system');
        res.json({ success: true });
    }
    catch (e) {
        res.status(500).json({ error: String(e) });
    }
});
exports.default = router;
