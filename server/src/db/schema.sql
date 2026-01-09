-- Languages Table
CREATE TABLE IF NOT EXISTS languages (
    code TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    is_default BOOLEAN DEFAULT 0,
    direction TEXT DEFAULT 'ltr',
    enabled BOOLEAN DEFAULT 1
);

-- Translation Keys (Global Dictionary)
CREATE TABLE IF NOT EXISTS translation_keys (
    key TEXT PRIMARY KEY,
    namespace TEXT DEFAULT 'common',
    description TEXT
);

-- Translation Values
CREATE TABLE IF NOT EXISTS translation_values (
    trans_key TEXT,
    lang_code TEXT,
    value TEXT,
    FOREIGN KEY(trans_key) REFERENCES translation_keys(key),
    FOREIGN KEY(lang_code) REFERENCES languages(code),
    PRIMARY KEY(trans_key, lang_code)
);

-- Pages
CREATE TABLE IF NOT EXISTS pages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug_key TEXT UNIQUE,
    template TEXT NOT NULL
);

-- Page Contents (Localized)
CREATE TABLE IF NOT EXISTS page_contents (
    page_id INTEGER,
    lang_code TEXT,
    title TEXT,
    slug_localized TEXT,
    seo_title TEXT,
    seo_desc TEXT,
    content_json TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(page_id) REFERENCES pages(id),
    FOREIGN KEY(lang_code) REFERENCES languages(code),
    PRIMARY KEY(page_id, lang_code)
);

-- Initial Seed Data
INSERT OR IGNORE INTO languages (code, name, is_default) VALUES ('en', 'English', 1);
INSERT OR IGNORE INTO languages (code, name, is_default) VALUES ('zh-TW', '繁體中文', 0);
INSERT OR IGNORE INTO languages (code, name, is_default) VALUES ('jp', '日本語', 0);

INSERT OR IGNORE INTO translation_keys (key, namespace) VALUES ('NAV_HOME', 'common');
INSERT OR IGNORE INTO translation_values (trans_key, lang_code, value) VALUES ('NAV_HOME', 'en', 'Home');
INSERT OR IGNORE INTO translation_values (trans_key, lang_code, value) VALUES ('NAV_HOME', 'zh-TW', '首頁');
INSERT OR IGNORE INTO translation_values (trans_key, lang_code, value) VALUES ('NAV_HOME', 'jp', 'ホーム');
