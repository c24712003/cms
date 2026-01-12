"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const index_1 = require("../index");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
// Storage Configuration
const uploadDir = path_1.default.join(__dirname, '../../uploads');
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Keep extension
        const ext = path_1.default.extname(file.originalname);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + ext);
    }
});
const upload = (0, multer_1.default)({ storage: storage });
// Helper: Determine media type from mimetype
function getMediaType(mimetype) {
    if (mimetype.startsWith('image/'))
        return 'image';
    return 'document';
}
// Migration Helper: Scan uploads dir and populate DB if missing
async function syncAssets() {
    console.log('Syncing assets from disk to media_assets DB...');
    const db = (0, index_1.getDb)();
    if (!fs_1.default.existsSync(uploadDir))
        return;
    // Check if table exists (in case schema.sql hasn't run yet which is unlikely but good safety)
    try {
        await db.get('SELECT id FROM media_assets LIMIT 1');
    }
    catch (e) {
        console.warn('media_assets table not ready yet, skipping sync');
        return;
    }
    const files = fs_1.default.readdirSync(uploadDir);
    for (const file of files) {
        if (file.startsWith('.'))
            continue; // skip .DS_Store
        const existing = await db.get('SELECT id FROM media_assets WHERE filename = ?', file);
        if (!existing) {
            const stats = fs_1.default.statSync(path_1.default.join(uploadDir, file));
            const mimetype = file.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? 'image/jpeg' : 'application/octet-stream';
            const type = getMediaType(mimetype);
            await db.run(`INSERT INTO media_assets 
                (type, provider, filename, original_name, mimetype, size_bytes, url, path, created_at, updated_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`, [
                type,
                'local',
                file,
                file,
                mimetype,
                stats.size,
                `/uploads/${file}`,
                `/uploads/${file}`
            ]);
            console.log(`Imported asset: ${file}`);
        }
    }
}
// GET /api/media - List assets
router.get('/', async (req, res) => {
    try {
        await syncAssets();
        const db = (0, index_1.getDb)();
        const { type } = req.query;
        let query = 'SELECT * FROM media_assets';
        const params = [];
        if (type && type !== 'all') {
            query += ' WHERE type = ?';
            params.push(type);
        }
        query += ' ORDER BY created_at DESC';
        const assets = await db.all(query, params);
        // Parse metadata_json
        const parsedAssets = assets.map((a) => ({
            ...a,
            metadata: a.metadata_json ? JSON.parse(a.metadata_json) : {}
        }));
        res.json(parsedAssets);
    }
    catch (e) {
        res.status(500).json({ error: String(e) });
    }
});
// POST /api/media/upload - Local File Upload with Image Processing
router.post('/upload', auth_middleware_1.authenticateToken, (0, auth_middleware_1.requireRole)('editor'), upload.single('file'), async (req, res) => {
    if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
    }
    try {
        const db = (0, index_1.getDb)();
        const url = `/uploads/${req.file.filename}`;
        const type = getMediaType(req.file.mimetype);
        let metadata = {};
        let thumbnailUrl = null;
        let webpUrl = null;
        // Process images with sharp (if available)
        if (type === 'image') {
            try {
                // Dynamic import to handle case where sharp is not installed
                const { processImage, getImageMetadata } = await Promise.resolve().then(() => __importStar(require('../utils/image-processor')));
                const inputPath = path_1.default.join(uploadDir, req.file.filename);
                const processed = await processImage(inputPath, uploadDir, {
                    generateWebP: true,
                    generateThumbnail: true,
                    generateResponsive: true,
                    responsiveSizes: [320, 640, 1024, 1280]
                });
                if (processed.metadata) {
                    metadata = {
                        width: processed.metadata.width,
                        height: processed.metadata.height,
                        format: processed.metadata.format
                    };
                }
                if (processed.thumbnail) {
                    thumbnailUrl = processed.thumbnail;
                }
                if (processed.webp) {
                    webpUrl = processed.webp;
                }
                if (processed.responsive && processed.responsive.length > 0) {
                    metadata.responsive = processed.responsive;
                }
            }
            catch (e) {
                console.warn('Sharp processing failed, continuing without optimization:', e);
                // Fallback: just store the original without processing
            }
        }
        const result = await db.run(`INSERT INTO media_assets 
            (type, provider, filename, original_name, mimetype, size_bytes, url, path, thumbnail_url, metadata_json, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`, [
            type,
            'local',
            req.file.filename,
            req.file.originalname,
            req.file.mimetype,
            req.file.size,
            url,
            url,
            thumbnailUrl,
            JSON.stringify(metadata)
        ]);
        res.json({
            id: result.lastID,
            type,
            provider: 'local',
            filename: req.file.filename,
            url: url,
            thumbnail_url: thumbnailUrl,
            webp_url: webpUrl,
            size_bytes: req.file.size,
            metadata
        });
    }
    catch (e) {
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
        const data = await response.json();
        res.json({
            provider: 'youtube',
            type: 'video_url',
            title: data.title,
            thumbnail_url: data.thumbnail_url,
            // author_name: data.author_name,
            original_url: url
        });
    }
    catch (e) {
        res.status(500).json({ error: 'Could not parse URL', details: String(e) });
    }
});
// POST /api/media/external - Save External Media (YouTube)
router.post('/external', auth_middleware_1.authenticateToken, (0, auth_middleware_1.requireRole)('editor'), async (req, res) => {
    const { url, title, thumbnail_url, provider, type } = req.body;
    if (!url || !provider) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }
    try {
        const db = (0, index_1.getDb)();
        const metadata = {
            source_url: url,
            thumbnail_original: thumbnail_url
        };
        const result = await db.run(`INSERT INTO media_assets 
            (type, provider, filename, original_name, mimetype, size_bytes, url, thumbnail_url, metadata_json, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`, [
            type || 'video_url',
            provider, // 'youtube'
            title || 'External Video', // filename acts as display title for external
            title || 'External Video',
            'application/x-youtube',
            0,
            url, // The external URL
            thumbnail_url,
            JSON.stringify(metadata)
        ]);
        res.json({
            id: result.lastID,
            success: true
        });
    }
    catch (e) {
        res.status(500).json({ error: String(e) });
    }
});
// DELETE /api/media/:id
router.delete('/:id', auth_middleware_1.authenticateToken, (0, auth_middleware_1.requireRole)('editor'), async (req, res) => {
    const { id } = req.params;
    try {
        const db = (0, index_1.getDb)();
        const asset = await db.get('SELECT * FROM media_assets WHERE id = ?', id);
        if (!asset) {
            res.status(404).json({ error: 'Asset not found' });
            return;
        }
        // Only delete file if it's local
        if (asset.provider === 'local' && asset.path) {
            const absolutePath = path_1.default.join(uploadDir, asset.filename);
            if (fs_1.default.existsSync(absolutePath)) {
                fs_1.default.unlinkSync(absolutePath);
            }
        }
        await db.run('DELETE FROM media_assets WHERE id = ?', id);
        res.json({ success: true });
    }
    catch (e) {
        res.status(500).json({ error: String(e) });
    }
});
exports.default = router;
