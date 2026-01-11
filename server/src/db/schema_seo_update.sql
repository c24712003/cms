-- SEO Enhancement Schema Update
-- Add SEO-related columns and tables

-- ============================================
-- PHASE 1: Extend page_contents table
-- ============================================

-- Add Open Graph image field
ALTER TABLE page_contents ADD COLUMN og_image TEXT;

-- Add Schema.org type field (WebPage, Article, Product, etc.)
ALTER TABLE page_contents ADD COLUMN schema_type TEXT DEFAULT 'WebPage';

-- Add noindex/nofollow flags for crawler control
ALTER TABLE page_contents ADD COLUMN noindex BOOLEAN DEFAULT 0;
ALTER TABLE page_contents ADD COLUMN nofollow BOOLEAN DEFAULT 0;

-- Add custom canonical URL (null = auto-generate)
ALTER TABLE page_contents ADD COLUMN canonical_url TEXT;

-- ============================================
-- PHASE 2: Same for page_drafts
-- ============================================

ALTER TABLE page_drafts ADD COLUMN og_image TEXT;
ALTER TABLE page_drafts ADD COLUMN schema_type TEXT DEFAULT 'WebPage';
ALTER TABLE page_drafts ADD COLUMN noindex BOOLEAN DEFAULT 0;
ALTER TABLE page_drafts ADD COLUMN nofollow BOOLEAN DEFAULT 0;
ALTER TABLE page_drafts ADD COLUMN canonical_url TEXT;

-- ============================================
-- PHASE 3: Global SEO Settings Table
-- ============================================

CREATE TABLE IF NOT EXISTS seo_settings (
    key TEXT PRIMARY KEY,
    value TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert default SEO settings
INSERT OR IGNORE INTO seo_settings (key, value) VALUES ('site_name', 'CMS Demo');
INSERT OR IGNORE INTO seo_settings (key, value) VALUES ('site_description', 'A powerful multilingual content management system');
INSERT OR IGNORE INTO seo_settings (key, value) VALUES ('default_og_image', '/assets/images/og-default.jpg');
INSERT OR IGNORE INTO seo_settings (key, value) VALUES ('twitter_handle', '@cmsdemo');
INSERT OR IGNORE INTO seo_settings (key, value) VALUES ('organization_name', 'CMS Demo Inc.');
INSERT OR IGNORE INTO seo_settings (key, value) VALUES ('organization_logo', '/assets/images/logo.svg');
INSERT OR IGNORE INTO seo_settings (key, value) VALUES ('organization_url', 'https://example.com');

-- ============================================
-- PHASE 4: Redirects Management Table
-- ============================================

CREATE TABLE IF NOT EXISTS redirects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    from_path TEXT UNIQUE NOT NULL,
    to_path TEXT NOT NULL,
    status_code INTEGER DEFAULT 301,  -- 301 (permanent) or 302 (temporary)
    is_active BOOLEAN DEFAULT 1,
    hit_count INTEGER DEFAULT 0,  -- Track redirect usage
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster lookup
CREATE INDEX IF NOT EXISTS idx_redirects_from_path ON redirects(from_path);
CREATE INDEX IF NOT EXISTS idx_redirects_active ON redirects(is_active);

-- Sample redirects
INSERT OR IGNORE INTO redirects (from_path, to_path, status_code) VALUES ('/old-page', '/new-page', 301);
INSERT OR IGNORE INTO redirects (from_path, to_path, status_code) VALUES ('/legacy/about', '/about', 301);
