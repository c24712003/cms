-- Create themes table
CREATE TABLE IF NOT EXISTS themes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    template_id TEXT NOT NULL,
    is_active BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Add theme_id to pages if not exists
-- SQLite doesn't support IF NOT EXISTS for columns, so we try adding it.
-- If it fails (duplicate column), the application code handles the error normally.
ALTER TABLE pages ADD COLUMN theme_id INTEGER REFERENCES themes(id);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_pages_theme_id ON pages(theme_id);
