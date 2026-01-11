
-- Insert Keys
INSERT OR IGNORE INTO translation_keys (key, namespace) VALUES 
('NAV_HOME', 'navigation'),
('NAV_ABOUT', 'navigation'),
('NAV_SERVICES', 'navigation'),
('NAV_WEB_DEV', 'navigation'),
('NAV_MOBILE_APPS', 'navigation'),
('NAV_CONTACT', 'navigation'),
('NAV_PRIVACY', 'navigation'),
('NAV_TERMS', 'navigation'),
('FOOTER_DESC', 'footer'),
('FOOTER_LINKS', 'footer'),
('FOOTER_CONTACT', 'footer'),
('FOOTER_COPYRIGHT', 'footer');

-- Insert English Values
INSERT INTO translation_values (trans_key, lang_code, value) VALUES 
('NAV_HOME', 'en', 'Home'),
('NAV_ABOUT', 'en', 'About'),
('NAV_SERVICES', 'en', 'Services'),
('NAV_WEB_DEV', 'en', 'Web Development'),
('NAV_MOBILE_APPS', 'en', 'Mobile Apps'),
('NAV_CONTACT', 'en', 'Contact'),
('NAV_PRIVACY', 'en', 'Privacy Policy'),
('NAV_TERMS', 'en', 'Terms of Service'),
('FOOTER_DESC', 'en', 'Empowering your digital presence with modern CMS solutions.'),
('FOOTER_LINKS', 'en', 'Quick Links'),
('FOOTER_CONTACT', 'en', 'Contact Us'),
('FOOTER_COPYRIGHT', 'en', '© 2026 CMS Demo. All rights reserved.')
ON CONFLICT(trans_key, lang_code) DO UPDATE SET value = excluded.value;

-- Insert Traditional Chinese Values
INSERT INTO translation_values (trans_key, lang_code, value) VALUES 
('NAV_HOME', 'zh-TW', '首頁'),
('NAV_ABOUT', 'zh-TW', '關於我們'),
('NAV_SERVICES', 'zh-TW', '服務項目'),
('NAV_WEB_DEV', 'zh-TW', '網站開發'),
('NAV_MOBILE_APPS', 'zh-TW', '行動應用'),
('NAV_CONTACT', 'zh-TW', '聯絡我們'),
('NAV_PRIVACY', 'zh-TW', '隱私權政策'),
('NAV_TERMS', 'zh-TW', '服務條款'),
('FOOTER_DESC', 'zh-TW', '利用現代化 CMS 解決方案提升您的數位形象。'),
('FOOTER_LINKS', 'zh-TW', '快速連結'),
('FOOTER_CONTACT', 'zh-TW', '聯絡資訊'),
('FOOTER_COPYRIGHT', 'zh-TW', '© 2026 CMS Demo. 版權所有。')
ON CONFLICT(trans_key, lang_code) DO UPDATE SET value = excluded.value;
