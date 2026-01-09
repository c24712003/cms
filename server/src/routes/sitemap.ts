import express from 'express';
import { getDb } from '../index';

const router = express.Router();

router.get('/sitemap.xml', async (req, res) => {
    try {
        const db = getDb();
        const pages = await db.all('SELECT slug_localized, lang_code FROM page_contents');
        const languages = await db.all('SELECT code FROM languages WHERE enabled = 1');

        let xml = '<?xml version="1.0" encoding="UTF-8"?>';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

        // Base URL (In real app, getting from config or req.hostname)
        const baseUrl = 'https://example.com';

        pages.forEach((p: any) => {
            xml += '<url>';
            xml += `<loc>${baseUrl}/${p.lang_code}/${p.slug_localized || ''}</loc>`;
            xml += '</url>';
        });

        xml += '</urlset>';

        res.header('Content-Type', 'application/xml');
        res.send(xml);
    } catch (e) {
        res.status(500).send('Error generating sitemap');
    }
});

export default router;
