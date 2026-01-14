
import express from 'express';
import { getDb } from '../index';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

interface SiteSetting {
    key: string;
    value: string | null;
    value_type: string;
    description?: string;
}

// GET /api/site-settings - Get all site settings
router.get('/', async (req, res) => {
    try {
        const db = getDb();
        const settings = await db.all('SELECT key, value, value_type, description FROM site_settings');

        // Convert to key-value object for easier consumption
        const settingsMap: Record<string, any> = {};
        settings.forEach((s: SiteSetting) => {
            // Parse value based on type
            let parsedValue: any = s.value;
            if (s.value !== null) {
                if (s.value_type === 'number') {
                    parsedValue = Number(s.value);
                } else if (s.value_type === 'boolean') {
                    parsedValue = s.value === 'true' || s.value === '1';
                } else if (s.value_type === 'json') {
                    try {
                        parsedValue = JSON.parse(s.value);
                    } catch (e) {
                        // Keep as string if JSON parse fails
                    }
                }
            }
            settingsMap[s.key] = parsedValue;
        });

        res.json(settingsMap);
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

// GET /api/site-settings/:key - Get specific setting
router.get('/:key', async (req, res) => {
    try {
        const db = getDb();
        const setting = await db.get(
            'SELECT key, value, value_type, description FROM site_settings WHERE key = ?',
            [req.params.key]
        );

        if (!setting) {
            res.status(404).json({ error: 'Setting not found' });
            return;
        }

        // Parse value based on type
        let parsedValue = setting.value;
        if (setting.value !== null) {
            if (setting.value_type === 'number') {
                parsedValue = Number(setting.value);
            } else if (setting.value_type === 'boolean') {
                parsedValue = setting.value === 'true' || setting.value === '1';
            } else if (setting.value_type === 'json') {
                try {
                    parsedValue = JSON.parse(setting.value);
                } catch (e) {
                    // Keep as string
                }
            }
        }

        res.json({ key: setting.key, value: parsedValue });
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

// POST /api/site-settings - Update settings (admin only)
router.post('/', authenticateToken, async (req, res) => {
    const { settings } = req.body;

    if (!settings || !Array.isArray(settings)) {
        res.status(400).json({ error: 'Settings array is required' });
        return;
    }

    const db = getDb();
    try {
        await db.run('BEGIN TRANSACTION');

        const stmt = await db.prepare(`
            INSERT INTO site_settings (key, value, updated_at)
            VALUES (?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(key) DO UPDATE SET
                value = excluded.value,
                updated_at = CURRENT_TIMESTAMP
        `);

        for (const setting of settings) {
            if (!setting.key) continue;

            // Convert value to string for storage
            let stringValue = setting.value;
            if (typeof setting.value === 'object') {
                stringValue = JSON.stringify(setting.value);
            } else if (setting.value !== null && setting.value !== undefined) {
                stringValue = String(setting.value);
            }

            await stmt.run([setting.key, stringValue]);
        }

        await stmt.finalize();
        await db.run('COMMIT');

        res.json({ success: true });
    } catch (e) {
        await db.run('ROLLBACK');
        res.status(500).json({ error: String(e) });
    }
});

export default router;
