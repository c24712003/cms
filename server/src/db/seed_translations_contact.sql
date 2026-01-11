
-- Insert Keys
INSERT OR IGNORE INTO translation_keys (key, namespace) VALUES 
('CONTACT_TITLE', 'contact'),
('CONTACT_SUBTITLE', 'contact'),
('FORM_NAME', 'contact'),
('FORM_EMAIL', 'contact'),
('FORM_MESSAGE', 'contact');

-- EN
INSERT INTO translation_values (trans_key, lang_code, value) VALUES 
('CONTACT_TITLE', 'en', 'Contact Us'),
('CONTACT_SUBTITLE', 'en', 'Get in touch with our team'),
('FORM_NAME', 'en', 'Name'),
('FORM_EMAIL', 'en', 'Email'),
('FORM_MESSAGE', 'en', 'Message')
ON CONFLICT(trans_key, lang_code) DO UPDATE SET value = excluded.value;

-- ZH-TW
INSERT INTO translation_values (trans_key, lang_code, value) VALUES 
('CONTACT_TITLE', 'zh-TW', '聯絡我們'),
('CONTACT_SUBTITLE', 'zh-TW', '與我們的團隊聯繫'),
('FORM_NAME', 'zh-TW', '姓名'),
('FORM_EMAIL', 'zh-TW', '電子郵件'),
('FORM_MESSAGE', 'zh-TW', '訊息')
ON CONFLICT(trans_key, lang_code) DO UPDATE SET value = excluded.value;

-- JA
INSERT INTO translation_values (trans_key, lang_code, value) VALUES 
('CONTACT_TITLE', 'ja', 'お問い合わせ'),
('CONTACT_SUBTITLE', 'ja', 'チームにご連絡ください'),
('FORM_NAME', 'ja', 'お名前'),
('FORM_EMAIL', 'ja', 'メールアドレス'),
('FORM_MESSAGE', 'ja', 'メッセージ')
ON CONFLICT(trans_key, lang_code) DO UPDATE SET value = excluded.value;

-- KO
INSERT INTO translation_values (trans_key, lang_code, value) VALUES 
('CONTACT_TITLE', 'ko', '문의하기'),
('CONTACT_SUBTITLE', 'ko', '저희 팀에 연락주세요'),
('FORM_NAME', 'ko', '이름'),
('FORM_EMAIL', 'ko', '이메일'),
('FORM_MESSAGE', 'ko', '메시지')
ON CONFLICT(trans_key, lang_code) DO UPDATE SET value = excluded.value;
