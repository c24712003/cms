import express from 'express';
import { getDb } from '../index';

const router = express.Router();

/**
 * SEO-Enhanced Sitemap with:
 * - lastmod (from updated_at)
 * - priority (configurable)
 * - changefreq (based on page type)
 * - hreflang (for multilingual support)
 */
router.get('/sitemap.xml', async (req, res) => {
    try {
        const db = getDb();

        // Get all published pages with their localized content
        const pages = await db.all(`
            SELECT 
                p.id, 
                p.slug_key, 
                p.template,
                pc.lang_code, 
                pc.slug_localized, 
                pc.updated_at,
                pc.noindex
            FROM pages p
            JOIN themes t ON p.theme_id = t.id
            LEFT JOIN page_contents pc ON p.id = pc.page_id
            WHERE (pc.noindex IS NULL OR pc.noindex = 0)
            AND t.is_active = 1
            ORDER BY p.id, pc.lang_code
        `);

        // Get all enabled languages for hreflang
        const languages = await db.all('SELECT code FROM languages WHERE enabled = 1');
        const langCodes = languages.map((l: any) => l.code);

        // Base URL (from environment or request)
        const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;

        // Group pages by page_id for hreflang alternates
        const pageGroups = new Map<number, any[]>();
        pages.forEach((p: any) => {
            if (!pageGroups.has(p.id)) {
                pageGroups.set(p.id, []);
            }
            pageGroups.get(p.id)!.push(p);
        });

        // Build XML
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
        xml += '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

        pageGroups.forEach((pageVersions) => {
            pageVersions.forEach((page: any) => {
                xml += '  <url>\n';

                // Location
                const slug = page.slug_localized || page.slug_key || '';
                const loc = slug === 'home' || slug === ''
                    ? `${baseUrl}/${page.lang_code}`
                    : `${baseUrl}/${page.lang_code}/${slug}`;
                xml += `    <loc>${escapeXml(loc)}</loc>\n`;

                // Last Modified
                if (page.updated_at) {
                    const lastmod = new Date(page.updated_at).toISOString().split('T')[0];
                    xml += `    <lastmod>${lastmod}</lastmod>\n`;
                }

                // Change Frequency & Priority based on page type
                const { changefreq, priority } = getPageFrequency(page.template, page.slug_key);
                xml += `    <changefreq>${changefreq}</changefreq>\n`;
                xml += `    <priority>${priority}</priority>\n`;

                // Hreflang alternates (for all language versions of this page)
                pageVersions.forEach((altPage: any) => {
                    if (langCodes.includes(altPage.lang_code)) {
                        const altSlug = altPage.slug_localized || altPage.slug_key || '';
                        const altLoc = altSlug === 'home' || altSlug === ''
                            ? `${baseUrl}/${altPage.lang_code}`
                            : `${baseUrl}/${altPage.lang_code}/${altSlug}`;
                        xml += `    <xhtml:link rel="alternate" hreflang="${altPage.lang_code}" href="${escapeXml(altLoc)}" />\n`;
                    }
                });

                // x-default for language negotiation fallback
                const defaultPage = pageVersions.find((p: any) => p.lang_code === 'en-US') || pageVersions[0];
                if (defaultPage) {
                    const defaultSlug = defaultPage.slug_localized || defaultPage.slug_key || '';
                    const defaultLoc = defaultSlug === 'home' || defaultSlug === ''
                        ? `${baseUrl}/${defaultPage.lang_code}`
                        : `${baseUrl}/${defaultPage.lang_code}/${defaultSlug}`;
                    xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(defaultLoc)}" />\n`;
                }

                xml += '  </url>\n';
            });
        });

        xml += '</urlset>';

        res.header('Content-Type', 'application/xml');
        res.header('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
        res.send(xml);
    } catch (e) {
        console.error('Sitemap generation error:', e);
        res.status(500).send('Error generating sitemap');
    }
});

/**
 * Determine changefreq and priority based on page type
 */
function getPageFrequency(template: string, slugKey: string): { changefreq: string; priority: string } {
    // Homepage has highest priority and updates frequently
    if (slugKey === 'home' || slugKey === 'corporate-home') {
        return { changefreq: 'daily', priority: '1.0' };
    }

    // News/blog pages update frequently
    if (template?.includes('news') || template?.includes('blog')) {
        return { changefreq: 'daily', priority: '0.8' };
    }

    // Product/service pages have high priority
    if (template?.includes('product') || template?.includes('service') || template?.includes('solution')) {
        return { changefreq: 'weekly', priority: '0.8' };
    }

    // About/contact pages are relatively static
    if (slugKey?.includes('about') || slugKey?.includes('contact')) {
        return { changefreq: 'monthly', priority: '0.6' };
    }

    // Default for other pages
    return { changefreq: 'weekly', priority: '0.5' };
}

/**
 * Escape special XML characters
 */
function escapeXml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

export default router;

