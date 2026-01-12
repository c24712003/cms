"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
/**
 * SEO: Dynamic robots.txt
 * - In production: allow all crawlers
 * - In dev/staging: disallow all to prevent accidental indexing
 */
router.get('/robots.txt', (req, res) => {
    const isProduction = process.env.NODE_ENV === 'production';
    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
    let robotsTxt;
    if (isProduction) {
        robotsTxt = `# robots.txt for CMS
User-agent: *
Allow: /

# Disallow admin and API routes
Disallow: /admin/
Disallow: /api/
Disallow: /uploads/

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml

# Crawl-delay for polite crawling
Crawl-delay: 1
`;
    }
    else {
        // Block all crawlers in non-production environments
        robotsTxt = `# robots.txt - Development/Staging Environment
# DO NOT INDEX - This is not a production site

User-agent: *
Disallow: /
`;
    }
    res.header('Content-Type', 'text/plain');
    res.send(robotsTxt);
});
exports.default = router;
