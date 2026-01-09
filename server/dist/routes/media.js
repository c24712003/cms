"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const router = express_1.default.Router();
// Storage Configuration
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path_1.default.join(__dirname, '../../uploads');
        if (!fs_1.default.existsSync(uploadDir)) {
            fs_1.default.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});
const upload = (0, multer_1.default)({ storage: storage });
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
    const uploadDir = path_1.default.join(__dirname, '../../uploads');
    if (!fs_1.default.existsSync(uploadDir)) {
        res.json([]);
        return;
    }
    fs_1.default.readdir(uploadDir, (err, files) => {
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
exports.default = router;
