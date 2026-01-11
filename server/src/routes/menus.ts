
import express from 'express';
import { getDb } from '../index';
import { authenticateToken } from '../middleware/auth';
import { randomUUID } from 'crypto';

const router = express.Router();

// Helper to build tree from flat list
function buildTree(items: any[]) {
    const map = new Map();
    const roots: any[] = [];

    items.forEach(item => {
        map.set(item.id, { ...item, children: [] });
    });

    items.forEach(item => {
        const node = map.get(item.id);
        if (item.parent_id) {
            const parent = map.get(item.parent_id);
            if (parent) {
                parent.children.push(node);
            } else {
                // Orphaned item, maybe treat as root or ignore?
                // Treating as root for safety
                roots.push(node);
            }
        } else {
            roots.push(node);
        }
    });

    // Sort by order
    const sortRecursive = (nodes: any[]) => {
        nodes.sort((a, b) => a.item_order - b.item_order);
        nodes.forEach(node => {
            if (node.children.length > 0) {
                sortRecursive(node.children);
            }
        });
    };
    sortRecursive(roots);

    return roots;
}

// GET /api/menus - List all menus (Summary)
router.get('/', async (req, res) => {
    try {
        const db = getDb();
        const menus = await db.all('SELECT * FROM menus');
        // We might want to attach item count or something, but keeping it simple
        res.json(menus);
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

// GET /api/menus/social - Get social links
router.get('/social/links', async (req, res) => {
    try {
        const db = getDb();
        const links = await db.all('SELECT * FROM social_links ORDER BY item_order ASC');
        res.json(links);
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

// POST /api/menus/social - Update social links
router.post('/social/links', authenticateToken, async (req, res) => {
    const { links } = req.body;
    // Transactional replace
    const db = getDb();
    try {
        await db.run('BEGIN TRANSACTION');

        // Simplest strategy: Delete all and recreate. 
        // For more complex usage we might want upsert, but for a small list this is fine.
        await db.run('DELETE FROM social_links');

        const stmt = await db.prepare('INSERT INTO social_links (id, platform, name, url, icon_path, is_active, item_order) VALUES (?, ?, ?, ?, ?, ?, ?)');
        for (let i = 0; i < links.length; i++) {
            const link = links[i];
            await stmt.run([
                link.id || randomUUID(),
                link.platform,
                link.name,
                link.url,
                link.icon_path,
                link.is_active ? 1 : 0,
                i
            ]);
        }
        await stmt.finalize();

        await db.run('COMMIT');
        res.json({ success: true });
    } catch (e) {
        await db.run('ROLLBACK');
        res.status(500).json({ error: String(e) });
    }
});

// GET /api/menus/:code - Get specific menu tree
router.get('/:code', async (req, res) => {
    try {
        const db = getDb();
        // Check if menu exists, if not create it (legacy support/init)
        let menu = await db.get('SELECT * FROM menus WHERE code = ?', [req.params.code]);

        if (!menu && ['main', 'footer'].includes(req.params.code)) {
            await db.run('INSERT INTO menus (code, items_json) VALUES (?, ?)', [req.params.code, '[]']);
            menu = { code: req.params.code };
        }

        if (menu) {
            // Fetch items from new table
            const items = await db.all('SELECT * FROM menu_items WHERE menu_code = ? ORDER BY item_order ASC', [req.params.code]);
            const tree = buildTree(items);
            res.json({ ...menu, items: tree });
        } else {
            res.status(404).json({ error: 'Menu not found' });
        }
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

// POST /api/menus/:code - Save menu tree
router.post('/:code', authenticateToken, async (req, res) => {
    const { items } = req.body; // Expecting Tree structure or Flat structure with parent_ids?
    // Usually Frontend sends Tree. Let's assume Flattening happens here or we accept Flat.
    // Let's assume Frontend sends Tree and we flatten it recursively.

    const db = getDb();
    try {

        // Validation
        const MAX_DEPTH = 3;
        const validateTree = (nodes: any[], depth: number) => {
            if (depth > MAX_DEPTH) throw new Error(`Max menu depth of ${MAX_DEPTH} exceeded.`);
            for (const node of nodes) {
                if (node.link_type === 'external' && node.url && !/^https?:\/\//.test(node.url)) {
                    // Strict regex for external URLs
                    throw new Error(`Invalid external URL: ${node.url}. Must start with http:// or https://`);
                }
                if (node.children && node.children.length > 0) {
                    validateTree(node.children, depth + 1);
                }
            }
        };
        validateTree(items, 1);

        await db.run('BEGIN TRANSACTION');

        // Ensure menu exists
        await db.run('INSERT OR IGNORE INTO menus (code, items_json) VALUES (?, ?)', [req.params.code, '[]']);

        // Delete existing items for this menu
        await db.run('DELETE FROM menu_items WHERE menu_code = ?', [req.params.code]);

        const stmt = await db.prepare(`
            INSERT INTO menu_items (id, menu_code, parent_id, title, link_type, url, icon, item_order, is_visible, target, translation_key)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        // Helper to insert recursively
        const insertItems = async (nodes: any[], parentId: string | null) => {
            for (let i = 0; i < nodes.length; i++) {
                const node = nodes[i];
                const id = node.id || randomUUID();

                await stmt.run([
                    id,
                    req.params.code,
                    parentId,
                    node.title || node.label, // Handle both for compatibility or migration
                    node.link_type || 'internal',
                    node.url || node.link,
                    node.icon,
                    i,
                    node.is_visible !== false ? 1 : 0, // Default true
                    node.target || '_self',
                    node.translation_key || node.labelKey // Save translation key
                ]);

                if (node.children && node.children.length > 0) {
                    await insertItems(node.children, id);
                }
            }
        };

        await insertItems(items, null);
        await stmt.finalize();

        // Also update legacy items_json for backup/read-only access if needed?
        // Let's keep it null or updated for simple caching if we wanted, but let's ignore it for now.
        // Actually best to update it so if other parts of app read it they don't break immediately if they use raw SQL?
        // For now, let's just stick to relational.

        await db.run('COMMIT');
        res.json({ success: true });
    } catch (e) {
        try {
            await db.run('ROLLBACK');
        } catch (rollbackError) {
            console.error('Rollback failed (likely no transaction active):', rollbackError);
        }
        res.status(500).json({ error: String(e) });
    }
});

export default router;
