
-- Insert Keys
INSERT OR IGNORE INTO translation_keys (key, namespace) VALUES 
('PAGE_SETTINGS_HEADER', 'editor'),
('PAGE_TITLE_LABEL', 'editor'),
('PAGE_URL_SLUG_LABEL', 'editor'),
('STATUS_DRAFT', 'editor'),
('BTN_SAVE_DRAFT', 'editor'),
('BTN_DEPLOY_PUBLISH', 'editor'),
('ADD_BLOCK_TITLE', 'editor'),
('ADD_BLOCK_DESC', 'editor');

-- EN
INSERT INTO translation_values (trans_key, lang_code, value) VALUES 
('PAGE_SETTINGS_HEADER', 'en', 'Page Settings (SEO)'),
('PAGE_TITLE_LABEL', 'en', 'Title'),
('PAGE_URL_SLUG_LABEL', 'en', 'URL Slug'),
('STATUS_DRAFT', 'en', 'Draft'),
('BTN_SAVE_DRAFT', 'en', 'Save Draft'),
('BTN_DEPLOY_PUBLISH', 'en', 'Deploy / Publish'),
('ADD_BLOCK_TITLE', 'en', 'Add Content Block'),
('ADD_BLOCK_DESC', 'en', 'Click to browse available components')
ON CONFLICT(trans_key, lang_code) DO UPDATE SET value = excluded.value;

-- ZH-TW
INSERT INTO translation_values (trans_key, lang_code, value) VALUES 
('PAGE_SETTINGS_HEADER', 'zh-TW', '頁面設定 (SEO)'),
('PAGE_TITLE_LABEL', 'zh-TW', '標題'),
('PAGE_URL_SLUG_LABEL', 'zh-TW', '網址代稱 (Slug)'),
('STATUS_DRAFT', 'zh-TW', '草稿'),
('BTN_SAVE_DRAFT', 'zh-TW', '儲存草稿'),
('BTN_DEPLOY_PUBLISH', 'zh-TW', '部署 / 發佈'),
('ADD_BLOCK_TITLE', 'zh-TW', '新增內容區塊'),
('ADD_BLOCK_DESC', 'zh-TW', '點擊瀏覽可用元件')
ON CONFLICT(trans_key, lang_code) DO UPDATE SET value = excluded.value;

-- JA
INSERT INTO translation_values (trans_key, lang_code, value) VALUES 
('PAGE_SETTINGS_HEADER', 'ja', 'ページ設定 (SEO)'),
('PAGE_TITLE_LABEL', 'ja', 'タイトル'),
('PAGE_URL_SLUG_LABEL', 'ja', 'URLスラッグ'),
('STATUS_DRAFT', 'ja', '下書き'),
('BTN_SAVE_DRAFT', 'ja', '下書きを保存'),
('BTN_DEPLOY_PUBLISH', 'ja', 'デプロイ / 公開'),
('ADD_BLOCK_TITLE', 'ja', 'コンテンツブロックを追加'),
('ADD_BLOCK_DESC', 'ja', 'クリックして利用可能なコンポーネントを表示')
ON CONFLICT(trans_key, lang_code) DO UPDATE SET value = excluded.value;

-- KO
INSERT INTO translation_values (trans_key, lang_code, value) VALUES 
('PAGE_SETTINGS_HEADER', 'ko', '페이지 설정 (SEO)'),
('PAGE_TITLE_LABEL', 'ko', '제목'),
('PAGE_URL_SLUG_LABEL', 'ko', 'URL 슬러그'),
('STATUS_DRAFT', 'ko', '초안'),
('BTN_SAVE_DRAFT', 'ko', '초안 저장'),
('BTN_DEPLOY_PUBLISH', 'ko', '배포 / 게시'),
('ADD_BLOCK_TITLE', 'ko', '콘텐츠 블록 추가'),
('ADD_BLOCK_DESC', 'ko', '사용 가능한 구성 요소를 찾아보려면 클릭하세요')
ON CONFLICT(trans_key, lang_code) DO UPDATE SET value = excluded.value;
