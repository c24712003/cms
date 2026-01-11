
-- Enable Korean
UPDATE languages SET enabled = 1 WHERE code = 'ko';

-- Insert Japanese Values
INSERT INTO translation_values (trans_key, lang_code, value) VALUES 
('NAV_HOME', 'ja', 'ホーム'),
('NAV_ABOUT', 'ja', '私たちについて'),
('NAV_SERVICES', 'ja', 'サービス'),
('NAV_WEB_DEV', 'ja', 'ウェブ開発'),
('NAV_MOBILE_APPS', 'ja', 'モバイルアプリ'),
('NAV_CONTACT', 'ja', 'お問い合わせ'),
('NAV_PRIVACY', 'ja', 'プライバシーポリシー'),
('NAV_TERMS', 'ja', '利用規約'),
('FOOTER_DESC', 'ja', '最新のCMSソリューションで、あなたのデジタルプレゼンスを強化します。'),
('FOOTER_LINKS', 'ja', 'クイックリンク'),
('FOOTER_CONTACT', 'ja', 'お問い合わせ'),
('FOOTER_COPYRIGHT', 'ja', '© 2026 CMS Demo. All rights reserved.')
ON CONFLICT(trans_key, lang_code) DO UPDATE SET value = excluded.value;

-- Insert Korean Values
INSERT INTO translation_values (trans_key, lang_code, value) VALUES 
('NAV_HOME', 'ko', '홈'),
('NAV_ABOUT', 'ko', '회사 소개'),
('NAV_SERVICES', 'ko', '서비스'),
('NAV_WEB_DEV', 'ko', '웹 개발'),
('NAV_MOBILE_APPS', 'ko', '모바일 앱'),
('NAV_CONTACT', 'ko', '문의하기'),
('NAV_PRIVACY', 'ko', '개인정보 처리방침'),
('NAV_TERMS', 'ko', '이용약관'),
('FOOTER_DESC', 'ko', '현대적인 CMS 솔루션으로 디지털 존재감을 강화하세요.'),
('FOOTER_LINKS', 'ko', '빠른 링크'),
('FOOTER_CONTACT', 'ko', '연락처'),
('FOOTER_COPYRIGHT', 'ko', '© 2026 CMS Demo. All rights reserved.')
ON CONFLICT(trans_key, lang_code) DO UPDATE SET value = excluded.value;
