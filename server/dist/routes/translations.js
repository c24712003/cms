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
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const router = express_1.default.Router();
// Path to the i18n directory relative to the server root (process.cwd() is server/)
// Adjust if your deployment structure differs
// Path to the i18n directory relative to the server root
const I18N_DIR = path.resolve(process.cwd(), 'public/i18n');
// Supported language files (must match actual files in i18n directory)
const SUPPORTED_LANGS = ['en-US', 'zh-TW', 'ja', 'ko'];
// Helper: Get file path for a language
function getJsonPath(lang) {
    return path.join(I18N_DIR, `${lang}.json`);
}
// Helper: Read JSON file
async function readJson(lang) {
    try {
        const filePath = getJsonPath(lang);
        const content = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(content);
    }
    catch (err) {
        console.warn(`Could not read ${lang}.json:`, err);
        return {};
    }
}
// Helper: Write JSON file (pretty printed)
async function writeJson(lang, data) {
    const filePath = getJsonPath(lang);
    const content = JSON.stringify(data, null, 2);
    await fs.writeFile(filePath, content, 'utf-8');
}
// GET /api/translations/keys - List all unique keys from all languages
router.get('/keys', async (req, res) => {
    try {
        const allKeys = new Set();
        for (const lang of SUPPORTED_LANGS) {
            const data = await readJson(lang);
            Object.keys(data).forEach(key => allKeys.add(key));
        }
        // Return as array of { key } objects to match frontend expectation
        const keys = Array.from(allKeys).sort().map(key => ({ key, namespace: 'common' }));
        res.json(keys);
    }
    catch (e) {
        res.status(500).json({ error: String(e) });
    }
});
// GET /api/translations/:lang - Get compiled map for a language
router.get('/:lang', async (req, res) => {
    const { lang } = req.params;
    try {
        const data = await readJson(lang);
        res.json(data);
    }
    catch (e) {
        res.status(500).json({ error: String(e) });
    }
});
// POST /api/translations/keys - Create a new key in all language files
router.post('/keys', async (req, res) => {
    const { key } = req.body;
    if (!key) {
        return res.status(400).json({ error: 'Key is required' });
    }
    try {
        for (const lang of SUPPORTED_LANGS) {
            const data = await readJson(lang);
            if (!(key in data)) {
                data[key] = ''; // Add with empty value
            }
            await writeJson(lang, data);
        }
        res.status(201).json({ success: true });
    }
    catch (e) {
        res.status(500).json({ error: String(e) });
    }
});
// PUT /api/translations - Update a specific key in a specific language
// Payload: { key: string, lang: string, value: string }
router.put('/', async (req, res) => {
    const { key, lang, value } = req.body;
    if (!key || !lang) {
        return res.status(400).json({ error: 'Key and lang are required' });
    }
    try {
        const data = await readJson(lang);
        data[key] = value;
        await writeJson(lang, data);
        res.json({ success: true });
    }
    catch (e) {
        res.status(500).json({ error: String(e) });
    }
});
exports.default = router;
