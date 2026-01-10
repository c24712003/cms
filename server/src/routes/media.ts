
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { getDb } from '../index';
import { authenticateToken, requireRole } from '../middleware/auth.middleware';

const router = express.Router();

// Storage Configuration
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Migration Helper: Scan uploads dir and populate DB if missing
async function syncAssets() {
    console.log('Syncing assets from disk to DB...');
    const db = getDb();
    if (!fs.existsSync(uploadDir)) return;

    const files = fs.readdirSync(uploadDir);
    for (const file of files) {
        if (file.startsWith('.')) continue; // skip .DS_Store

        const existing = await db.get('SELECT id FROM assets WHERE filename = ?', file);
        if (!existing) {
            const stats = fs.statSync(path.join(uploadDir, file));
            await db.run(
                'INSERT INTO assets (filename, original_name, mimetype, size, url, alt_text) VALUES (?, ?, ?, ?, ?, ?)',
                [file, file, 'application/octet-stream', stats.size, `/uploads/${file}`, '']
            );
            console.log(`Imported asset: ${file}`);
        }
    }
}

// POST /api/media/upload
router.post('/upload', authenticateToken, requireRole('editor'), upload.single('file'), async (req, res) => {
    if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
    }

    try {
        const db = getDb();
        const url = `/uploads/${req.file.filename}`;

        const result = await db.run(
            'INSERT INTO assets (filename, original_name, mimetype, size, url, alt_text) VALUES (?, ?, ?, ?, ?, ?)',
            [req.file.filename, req.file.originalname, req.file.mimetype, req.file.size, url, '']
        );

        res.json({
            id: result.lastID,
            filename: req.file.filename,
            url: url,
            size: req.file.size,
            alt_text: ''
        });
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

// GET /api/media - List assets (Syncs first)
router.get('/', async (req, res) => {
    try {
        await syncAssets(); // Ensure DB is up to date with disk
        const db = getDb();
        const assets = await db.all('SELECT * FROM assets ORDER BY created_at DESC');
        res.json(assets);
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

// PUT /api/media/:id - Update Metadata
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { alt_text, original_name } = req.body;

    try {
        const db = getDb();
        await db.run(
            'UPDATE assets SET alt_text = ?, original_name = ? WHERE id = ?',
            [alt_text || '', original_name || '', id]
        );
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

// DELETE /api/media/:id - Delete Asset
router.delete('/:id', authenticateToken, requireRole('editor'), async (req, res) => {
    const { id } = req.params;
    try {
        const db = getDb();
        const asset = await db.get('SELECT * FROM assets WHERE id = ?', id);

        if (!asset) {
            res.status(404).json({ error: 'Asset not found' });
            return;
        }

        // Delete from Disk
        const filePath = path.join(uploadDir, asset.filename);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // Delete from DB
        await db.run('DELETE FROM assets WHERE id = ?', id);

        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

export default router;
