import express from 'express';
import { Request, Response } from 'express';
import * as fs from 'fs/promises';
import * as path from 'path';

const router = express.Router();

// Path to the i18n directory relative to the server root (process.cwd() is server/)
// Adjust if your deployment structure differs
// Path to the i18n directory relative to the server root
const I18N_DIR = path.resolve(process.cwd(), 'public/i18n');

// Supported language files (must match actual files in i18n directory)
const SUPPORTED_LANGS = ['en-US', 'zh-TW', 'ja', 'ko'];

// Helper: Get file path for a language
function getJsonPath(lang: string): string {
    return path.join(I18N_DIR, `${lang}.json`);
}

// Helper: Read JSON file
async function readJson(lang: string): Promise<Record<string, string>> {
    try {
        const filePath = getJsonPath(lang);
        const content = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(content);
    } catch (err) {
        console.warn(`Could not read ${lang}.json:`, err);
        return {};
    }
}

// Helper: Write JSON file (pretty printed)
async function writeJson(lang: string, data: Record<string, string>): Promise<void> {
    const filePath = getJsonPath(lang);
    const content = JSON.stringify(data, null, 2);
    await fs.writeFile(filePath, content, 'utf-8');
}

// GET /api/translations/keys - List all unique keys from all languages
router.get('/keys', async (req: Request, res: Response) => {
    try {
        const allKeys = new Set<string>();

        for (const lang of SUPPORTED_LANGS) {
            const data = await readJson(lang);
            Object.keys(data).forEach(key => allKeys.add(key));
        }

        // Return as array of { key } objects to match frontend expectation
        const keys = Array.from(allKeys).sort().map(key => ({ key, namespace: 'common' }));
        res.json(keys);
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

// GET /api/translations/:lang - Get compiled map for a language
router.get('/:lang', async (req: Request, res: Response) => {
    const { lang } = req.params;
    try {
        const data = await readJson(lang);
        res.json(data);
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

// POST /api/translations/keys - Create a new key in all language files
router.post('/keys', async (req: Request, res: Response) => {
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
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

// PUT /api/translations - Update a specific key in a specific language
// Payload: { key: string, lang: string, value: string }
router.put('/', async (req: Request, res: Response) => {
    const { key, lang, value } = req.body;
    if (!key || !lang) {
        return res.status(400).json({ error: 'Key and lang are required' });
    }

    try {
        const data = await readJson(lang);
        data[key] = value;
        await writeJson(lang, data);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

export default router;
