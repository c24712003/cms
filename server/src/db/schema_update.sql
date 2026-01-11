
-- ============================================
-- NAVIGATION MODULE (Added 2026-01-11)
-- ============================================

-- Menu Items (Hierarchical)
CREATE TABLE IF NOT EXISTS menu_items (
    id TEXT PRIMARY KEY, -- UUID
    menu_code TEXT NOT NULL,
    parent_id TEXT, -- UUID, Nullable for root items
    title TEXT NOT NULL,
    link_type TEXT DEFAULT 'internal', -- 'internal', 'external'
    url TEXT,
    icon TEXT,
    item_order INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT 1,
    target TEXT DEFAULT '_self', -- '_self', '_blank'
    FOREIGN KEY(parent_id) REFERENCES menu_items(id) ON DELETE CASCADE
    -- Note: Foreign key to menus(code) is logical since menus.code is unique but not PK in schema (id is PK). 
    -- We can enforce it at app level or rely on code being unique.
);

-- Social Links
CREATE TABLE IF NOT EXISTS social_links (
    id TEXT PRIMARY KEY, -- UUID
    platform TEXT NOT NULL, -- 'facebook', 'instagram', 'custom', etc.
    name TEXT, -- Display name (especially for custom)
    url TEXT NOT NULL,
    icon_path TEXT, -- For custom icons or override
    is_active BOOLEAN DEFAULT 1,
    item_order INTEGER DEFAULT 0
);
