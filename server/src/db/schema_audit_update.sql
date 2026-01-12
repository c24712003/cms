CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    action TEXT NOT NULL,
    description TEXT,
    type TEXT, -- 'content', 'system', 'security'
    user_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Add new columns if they don't exist (handled by index.ts loop)
ALTER TABLE audit_logs ADD COLUMN username TEXT;
ALTER TABLE audit_logs ADD COLUMN role TEXT;
ALTER TABLE audit_logs ADD COLUMN resource_type TEXT;
ALTER TABLE audit_logs ADD COLUMN resource_id TEXT;
ALTER TABLE audit_logs ADD COLUMN details TEXT;
ALTER TABLE audit_logs ADD COLUMN ip_address TEXT;
ALTER TABLE audit_logs ADD COLUMN user_agent TEXT;
ALTER TABLE audit_logs ADD COLUMN status TEXT;
