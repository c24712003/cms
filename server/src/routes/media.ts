
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { getDb } from '../index';
import { authenticateToken, requireRole } from '../middleware/auth.middleware';

const router = express.Router();

// Types for DB
interface MediaAssetRow {
    id: number;
    filename: string;
    type: 'image' | 'video_url' | 'document';
    provider: 'local' | 'youtube';
    url: string;
    thumbnail_url?: string;
    metadata_json?: string;
}

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
        // Keep extension
        const ext = path.extname(file.originalname);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + ext);
    }
});

const upload = multer({ storage: storage });

// Helper: Determine media type from mimetype
function getMediaType(mimetype: string): 'image' | 'document' {
    if (mimetype.startsWith('image/')) return 'image';
    return 'document';
}

// Migration Helper: Scan uploads dir and populate DB if missing
async function syncAssets() {
    console.log('Syncing assets from disk to media_assets DB...');
    const db = getDb();
    if (!fs.existsSync(uploadDir)) return;

    // Check if table exists (in case schema.sql hasn't run yet which is unlikely but good safety)
    try {
        await db.get('SELECT id FROM media_assets LIMIT 1');
    } catch (e) {
        console.warn('media_assets table not ready yet, skipping sync');
        return;
    }

    const files = fs.readdirSync(uploadDir);
    for (const file of files) {
        if (file.startsWith('.')) continue; // skip .DS_Store

        const existing = await db.get('SELECT id FROM media_assets WHERE filename = ?', file);
        if (!existing) {
            const stats = fs.statSync(path.join(uploadDir, file));
            const mimetype = file.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? 'image/jpeg' : 'application/octet-stream';
            const type = getMediaType(mimetype);

            await db.run(
                `INSERT INTO media_assets 
                (type, provider, filename, original_name, mimetype, size_bytes, url, path, created_at, updated_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
                [
                    type,
                    'local',
                    file,
                    file,
                    mimetype,
                    stats.size,
                    `/uploads/${file}`,
                    `/uploads/${file}`
                ]
            );
            console.log(`Imported asset: ${file}`);
        }
    }
}

// GET /api/media - List assets
router.get('/', async (req, res) => {
    try {
        await syncAssets();
        const db = getDb();
        const { type } = req.query;

        let query = 'SELECT * FROM media_assets';
        const params: any[] = [];

        if (type && type !== 'all') {
            query += ' WHERE type = ?';
            params.push(type);
        }

        query += ' ORDER BY created_at DESC';

        const assets = await db.all(query, params);

        // Parse metadata_json
        const parsedAssets = assets.map((a: any) => ({
            ...a,
            metadata: a.metadata_json ? JSON.parse(a.metadata_json) : {}
        }));

        res.json(parsedAssets);
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

// POST /api/media/upload - Local File Upload
router.post('/upload', authenticateToken, requireRole('editor'), upload.single('file'), async (req, res) => {
    if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
    }

    try {
        const db = getDb();
        const url = `/uploads/${req.file.filename}`;
        const type = getMediaType(req.file.mimetype);
        const metadata = {}; // Could add image dimensions extraction later

        const result = await db.run(
            `INSERT INTO media_assets 
            (type, provider, filename, original_name, mimetype, size_bytes, url, path, metadata_json, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
            [
                type,
                'local',
                req.file.filename,
                req.file.originalname,
                req.file.mimetype,
                req.file.size,
                url,
                url,
                JSON.stringify(metadata)
            ]
        );

        res.json({
            id: result.lastID,
            type,
            provider: 'local',
            filename: req.file.filename,
            url: url,
            size_bytes: req.file.size
        });
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

// POST /api/media/parse-url - Parse Metadata (YouTube)
router.post('/parse-url', async (req, res) => {
    const { url } = req.body;
    if (!url) {
        res.status(400).json({ error: 'URL is required' });
        return;
    }

    // Simple YouTube detection
    const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');
    if (!isYouTube) {
        res.status(400).json({ error: 'Only YouTube URLs are supported currently' });
        return;
    }

    try {
        // Fetch OEmbed
        const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
        const response = await fetch(oembedUrl);

        if (!response.ok) {
            throw new Error('Failed to fetch video metadata');
        }

        const data: any = await response.json();

        res.json({
            provider: 'youtube',
            type: 'video_url',
            title: data.title,
            thumbnail_url: data.thumbnail_url,
            // author_name: data.author_name,
            original_url: url
        });
    } catch (e) {
        res.status(500).json({ error: 'Could not parse URL', details: String(e) });
    }
});

// POST /api/media/external - Save External Media (YouTube)
router.post('/external', authenticateToken, requireRole('editor'), async (req, res) => {
    const { url, title, thumbnail_url, provider, type } = req.body;

    if (!url || !provider) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }

    try {
        const db = getDb();
        const metadata = {
            source_url: url,
            thumbnail_original: thumbnail_url
        };

        const result = await db.run(
            `INSERT INTO media_assets 
            (type, provider, filename, original_name, mimetype, size_bytes, url, thumbnail_url, metadata_json, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
            [
                type || 'video_url',
                provider, // 'youtube'
                title || 'External Video', // filename acts as display title for external
                title || 'External Video',
                'application/x-youtube',
                0,
                url, // The external URL
                thumbnail_url,
                JSON.stringify(metadata)
            ]
        );

        res.json({
            id: result.lastID,
            success: true
        });
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

// DELETE /api/media/:id
router.delete('/:id', authenticateToken, requireRole('editor'), async (req, res) => {
    const { id } = req.params;
    try {
        const db = getDb();
        const asset = await db.get('SELECT * FROM media_assets WHERE id = ?', id);

        if (!asset) {
            res.status(404).json({ error: 'Asset not found' });
            return;
        }

        // Only delete file if it's local
        if (asset.provider === 'local' && asset.path) {
            const absolutePath = path.join(uploadDir, asset.filename);
            if (fs.existsSync(absolutePath)) {
                fs.unlinkSync(absolutePath);
            }
        }

        await db.run('DELETE FROM media_assets WHERE id = ?', id);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

export default router;
