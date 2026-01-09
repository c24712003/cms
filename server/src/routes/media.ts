import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../../uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// POST /api/media/upload
router.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
    }
    // Return relative path for frontend usage
    res.json({
        filename: req.file.filename,
        url: `/uploads/${req.file.filename}`,
        size: req.file.size
    });
});

// GET /api/media - List files
router.get('/', (req, res) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
        res.json([]);
        return;
    }

    fs.readdir(uploadDir, (err, files) => {
        if (err) {
            res.status(500).json({ error: 'Unable to scan files' });
            return;
        }
        const fileInfos = files.map(file => ({
            filename: file,
            url: `/uploads/${file}`
        }));
        res.json(fileInfos);
    });
});

export default router;
