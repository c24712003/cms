-- ============================================
-- SITE SETTINGS TABLE
-- Created: 2026-01-13
-- Purpose: Store site-wide configuration including logo
-- ============================================

CREATE TABLE IF NOT EXISTS site_settings (
    key TEXT PRIMARY KEY,
    value TEXT,
    value_type TEXT DEFAULT 'string', -- 'string', 'number', 'boolean', 'json'
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- DEFAULT SITE SETTINGS
-- ============================================

-- Logo configuration
INSERT OR IGNORE INTO site_settings (key, value, value_type, description) 
VALUES ('logo_url', NULL, 'string', 'Default logo image URL (fallback)');

INSERT OR IGNORE INTO site_settings (key, value, value_type, description) 
VALUES ('logo_alt_text', 'Site Logo', 'string', 'Alt text for the logo image');

INSERT OR IGNORE INTO site_settings (key, value, value_type, description) 
VALUES ('site_name', 'CMS.Demo', 'string', 'Site name displayed as fallback when no logo');

-- Header specific logo
INSERT OR IGNORE INTO site_settings (key, value, value_type, description) 
VALUES ('header_logo_url', NULL, 'string', 'URL of the header logo image');

-- Footer specific logo
INSERT OR IGNORE INTO site_settings (key, value, value_type, description) 
VALUES ('footer_logo_url', NULL, 'string', 'URL of the footer logo image');
