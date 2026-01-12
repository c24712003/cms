"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Search Console OAuth Backend Service
 * Provides Google Search Console API integration
 *
 * Setup Requirements:
 * 1. Create project in Google Cloud Console
 * 2. Enable Search Console API
 * 3. Create OAuth 2.0 credentials
 * 4. Set environment variables:
 *    - GOOGLE_CLIENT_ID
 *    - GOOGLE_CLIENT_SECRET
 *    - GOOGLE_REDIRECT_URI
 */
const express_1 = __importDefault(require("express"));
const index_1 = require("../index");
const router = express_1.default.Router();
// OAuth Configuration (from environment variables)
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/search-console/oauth/callback';
// Google OAuth endpoints
const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const SEARCH_CONSOLE_API = 'https://searchconsole.googleapis.com/v1';
// Scopes needed for Search Console
const SCOPES = [
    'https://www.googleapis.com/auth/webmasters.readonly',
    'https://www.googleapis.com/auth/indexing'
].join(' ');
/**
 * GET /api/search-console/status - Check if Search Console is configured
 */
router.get('/status', async (req, res) => {
    try {
        const db = (0, index_1.getDb)();
        const token = await db.get("SELECT value FROM seo_settings WHERE key = 'search_console_token'");
        res.json({
            configured: !!CLIENT_ID && !!CLIENT_SECRET,
            connected: !!token?.value,
            hasCredentials: !!CLIENT_ID
        });
    }
    catch (e) {
        res.status(500).json({ error: String(e) });
    }
});
/**
 * GET /api/search-console/oauth/init - Start OAuth flow
 */
router.get('/oauth/init', (req, res) => {
    if (!CLIENT_ID) {
        res.status(400).json({ error: 'Google OAuth not configured. Set GOOGLE_CLIENT_ID environment variable.' });
        return;
    }
    const params = new URLSearchParams({
        client_id: CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        response_type: 'code',
        scope: SCOPES,
        access_type: 'offline',
        prompt: 'consent'
    });
    const authUrl = `${GOOGLE_AUTH_URL}?${params.toString()}`;
    res.json({ authUrl });
});
/**
 * GET /api/search-console/oauth/callback - OAuth callback handler
 */
router.get('/oauth/callback', async (req, res) => {
    const { code, error } = req.query;
    if (error) {
        res.status(400).send(`OAuth error: ${error}`);
        return;
    }
    if (!code) {
        res.status(400).send('No authorization code received');
        return;
    }
    try {
        // Exchange code for tokens
        const tokenResponse = await fetch(GOOGLE_TOKEN_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                code: code,
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                redirect_uri: REDIRECT_URI,
                grant_type: 'authorization_code'
            })
        });
        const tokens = await tokenResponse.json();
        if (tokens.error) {
            res.status(400).send(`Token error: ${tokens.error_description}`);
            return;
        }
        // Store tokens in database
        const db = (0, index_1.getDb)();
        await db.run(`
            INSERT INTO seo_settings (key, value, updated_at)
            VALUES ('search_console_token', ?, CURRENT_TIMESTAMP)
            ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
        `, [JSON.stringify(tokens)]);
        // Redirect to admin dashboard with success message
        res.redirect('/admin?search_console=connected');
    }
    catch (e) {
        res.status(500).send(`OAuth error: ${e}`);
    }
});
/**
 * Helper: Get valid access token (with refresh if needed)
 */
async function getAccessToken() {
    const db = (0, index_1.getDb)();
    const tokenRow = await db.get("SELECT value FROM seo_settings WHERE key = 'search_console_token'");
    if (!tokenRow?.value)
        return null;
    const tokens = JSON.parse(tokenRow.value);
    // Check if token is expired (with 5 minute buffer)
    const expiresAt = tokens.expires_at || (tokens.created_at + tokens.expires_in * 1000);
    const isExpired = Date.now() > expiresAt - 300000;
    if (isExpired && tokens.refresh_token) {
        // Refresh the token
        const refreshResponse = await fetch(GOOGLE_TOKEN_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                refresh_token: tokens.refresh_token,
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                grant_type: 'refresh_token'
            })
        });
        const newTokens = await refreshResponse.json();
        if (!newTokens.error) {
            // Preserve refresh token and update
            const updatedTokens = {
                ...tokens,
                access_token: newTokens.access_token,
                expires_in: newTokens.expires_in,
                expires_at: Date.now() + newTokens.expires_in * 1000
            };
            await db.run(`
                UPDATE seo_settings SET value = ?, updated_at = CURRENT_TIMESTAMP
                WHERE key = 'search_console_token'
            `, [JSON.stringify(updatedTokens)]);
            return newTokens.access_token;
        }
    }
    return tokens.access_token;
}
/**
 * POST /api/search-console/analytics - Get search analytics data
 */
router.post('/analytics', async (req, res) => {
    const { siteUrl, startDate, endDate, dimensions, rowLimit, startRow, dimensionFilterGroups } = req.body;
    const accessToken = await getAccessToken();
    if (!accessToken) {
        res.status(401).json({ error: 'Not authenticated with Search Console' });
        return;
    }
    try {
        const response = await fetch(`${SEARCH_CONSOLE_API}/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                startDate,
                endDate,
                dimensions: dimensions || ['query'],
                rowLimit: rowLimit || 100,
                startRow: startRow || 0,
                dimensionFilterGroups
            })
        });
        const data = await response.json();
        res.json(data);
    }
    catch (e) {
        res.status(500).json({ error: String(e) });
    }
});
/**
 * GET /api/search-console/inspect - Inspect URL index status
 */
router.get('/inspect', async (req, res) => {
    const { siteUrl, pageUrl } = req.query;
    const accessToken = await getAccessToken();
    if (!accessToken) {
        res.status(401).json({ error: 'Not authenticated with Search Console' });
        return;
    }
    try {
        const response = await fetch(`${SEARCH_CONSOLE_API}/urlInspection/index:inspect`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                inspectionUrl: pageUrl,
                siteUrl
            })
        });
        const data = await response.json();
        res.json(data.inspectionResult || data);
    }
    catch (e) {
        res.status(500).json({ error: String(e) });
    }
});
/**
 * POST /api/search-console/index - Submit URL for indexing
 */
router.post('/index', async (req, res) => {
    const { url, type } = req.body;
    const accessToken = await getAccessToken();
    if (!accessToken) {
        res.status(401).json({ error: 'Not authenticated with Search Console' });
        return;
    }
    try {
        const response = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url,
                type: type || 'URL_UPDATED'
            })
        });
        const data = await response.json();
        res.json({ success: !data.error, ...data });
    }
    catch (e) {
        res.status(500).json({ error: String(e) });
    }
});
/**
 * POST /api/search-console/sitemap/notify - Notify Google about sitemap update
 */
router.post('/sitemap/notify', async (req, res) => {
    const { siteUrl, sitemapUrl } = req.body;
    const accessToken = await getAccessToken();
    if (!accessToken) {
        res.status(401).json({ error: 'Not authenticated with Search Console' });
        return;
    }
    try {
        const response = await fetch(`${SEARCH_CONSOLE_API}/sites/${encodeURIComponent(siteUrl)}/sitemaps/${encodeURIComponent(sitemapUrl)}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        res.json({ success: response.ok });
    }
    catch (e) {
        res.status(500).json({ error: String(e) });
    }
});
/**
 * GET /api/search-console/coverage - Get index coverage summary
 */
router.get('/coverage', async (req, res) => {
    const { siteUrl } = req.query;
    const accessToken = await getAccessToken();
    if (!accessToken) {
        res.status(401).json({ error: 'Not authenticated with Search Console' });
        return;
    }
    // Note: Coverage API is not publicly available, return mock data
    // In production, you would need to use the URL Inspection API for each page
    res.json({
        valid: 0,
        warning: 0,
        error: 0,
        excluded: 0,
        message: 'Coverage API requires additional setup. Use URL Inspection API for individual page status.'
    });
});
/**
 * DELETE /api/search-console/disconnect - Disconnect Search Console
 */
router.delete('/disconnect', async (req, res) => {
    try {
        const db = (0, index_1.getDb)();
        await db.run("DELETE FROM seo_settings WHERE key = 'search_console_token'");
        res.json({ success: true });
    }
    catch (e) {
        res.status(500).json({ error: String(e) });
    }
});
exports.default = router;
