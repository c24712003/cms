CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    action TEXT NOT NULL,
    description TEXT,
    type TEXT, -- 'content', 'system', 'security'
    user_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
