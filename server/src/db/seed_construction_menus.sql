-- Construction Company Menu Setup
-- Run this after the theme seed

-- DELETE EXISTING DATA
DELETE FROM menu_items WHERE menu_code IN ('main', 'footer');
DELETE FROM social_links;
DELETE FROM menus WHERE code IN ('main', 'footer');

-- ENSURE MENUS EXIST
INSERT INTO menus (code, items_json) VALUES ('main', '[]');
INSERT INTO menus (code, items_json) VALUES ('footer', '[]');

-- ==========================================
-- MAIN MENU (Header) - 營建公司
-- ==========================================

-- 1. 首頁
INSERT INTO menu_items (id, menu_code, parent_id, title, link_type, url, item_order, is_visible, translation_key)
VALUES ('construction-home', 'main', NULL, '首頁', 'internal', '/construction-home', 0, 1, 'NAV_HOME');

-- 2. 關於我們
INSERT INTO menu_items (id, menu_code, parent_id, title, link_type, url, item_order, is_visible, translation_key)
VALUES ('construction-about', 'main', NULL, '關於我們', 'internal', '/about', 1, 1, 'NAV_ABOUT');

-- 3. 服務項目 (Parent)
INSERT INTO menu_items (id, menu_code, parent_id, title, link_type, url, item_order, is_visible, translation_key)
VALUES ('construction-services', 'main', NULL, '服務項目', 'internal', '/construction-services', 2, 1, 'NAV_SERVICES');

    -- 3.1 住宅工程
    INSERT INTO menu_items (id, menu_code, parent_id, title, link_type, url, item_order, is_visible, translation_key)
    VALUES ('service-residential', 'main', 'construction-services', '住宅工程', 'internal', '/services/residential', 0, 1, 'NAV_RESIDENTIAL');

    -- 3.2 商業建築
    INSERT INTO menu_items (id, menu_code, parent_id, title, link_type, url, item_order, is_visible, translation_key)
    VALUES ('service-commercial', 'main', 'construction-services', '商業建築', 'internal', '/services/commercial', 1, 1, 'NAV_COMMERCIAL');

    -- 3.3 公共工程
    INSERT INTO menu_items (id, menu_code, parent_id, title, link_type, url, item_order, is_visible, translation_key)
    VALUES ('service-public', 'main', 'construction-services', '公共工程', 'internal', '/services/public', 2, 1, 'NAV_PUBLIC');

-- 4. 工程實績
INSERT INTO menu_items (id, menu_code, parent_id, title, link_type, url, item_order, is_visible, translation_key)
VALUES ('construction-projects', 'main', NULL, '工程實績', 'internal', '/construction-projects', 3, 1, 'NAV_PROJECTS');

-- 5. 聯絡我們
INSERT INTO menu_items (id, menu_code, parent_id, title, link_type, url, item_order, is_visible, translation_key)
VALUES ('construction-contact', 'main', NULL, '聯絡我們', 'internal', '/contact', 4, 1, 'NAV_CONTACT');


-- ==========================================
-- FOOTER MENU - 營建公司
-- ==========================================

-- Column 1: 關於公司
INSERT INTO menu_items (id, menu_code, parent_id, title, link_type, url, item_order, is_visible, translation_key)
VALUES ('footer-about', 'footer', NULL, '關於公司', 'internal', '/about', 0, 1, 'NAV_ABOUT');

INSERT INTO menu_items (id, menu_code, parent_id, title, link_type, url, item_order, is_visible, translation_key)
VALUES ('footer-team', 'footer', NULL, '專業團隊', 'internal', '/team', 1, 1, 'NAV_TEAM');

INSERT INTO menu_items (id, menu_code, parent_id, title, link_type, url, item_order, is_visible, translation_key)
VALUES ('footer-careers', 'footer', NULL, '人才招募', 'internal', '/careers', 2, 1, 'NAV_CAREERS');

-- Column 2: 服務資訊
INSERT INTO menu_items (id, menu_code, parent_id, title, link_type, url, item_order, is_visible, translation_key)
VALUES ('footer-services', 'footer', NULL, '服務項目', 'internal', '/construction-services', 3, 1, 'NAV_SERVICES');

INSERT INTO menu_items (id, menu_code, parent_id, title, link_type, url, item_order, is_visible, translation_key)
VALUES ('footer-projects', 'footer', NULL, '工程實績', 'internal', '/construction-projects', 4, 1, 'NAV_PROJECTS');

INSERT INTO menu_items (id, menu_code, parent_id, title, link_type, url, item_order, is_visible, translation_key)
VALUES ('footer-faq', 'footer', NULL, '常見問題', 'internal', '/faq', 5, 1, 'NAV_FAQ');

-- Column 3: 法律資訊
INSERT INTO menu_items (id, menu_code, parent_id, title, link_type, url, item_order, is_visible, translation_key)
VALUES ('footer-privacy', 'footer', NULL, '隱私權政策', 'internal', '/privacy', 6, 1, 'NAV_PRIVACY');

INSERT INTO menu_items (id, menu_code, parent_id, title, link_type, url, item_order, is_visible, translation_key)
VALUES ('footer-terms', 'footer', NULL, '服務條款', 'internal', '/terms', 7, 1, 'NAV_TERMS');


-- ==========================================
-- SOCIAL LINKS - 營建公司
-- ==========================================

INSERT INTO social_links (id, platform, name, url, is_active, item_order)
VALUES ('social-fb', 'facebook', 'Facebook', 'https://facebook.com/constructiontw', 1, 0);

INSERT INTO social_links (id, platform, name, url, is_active, item_order)
VALUES ('social-line', 'line', 'Line', 'https://line.me/ti/p/constructiontw', 1, 1);

INSERT INTO social_links (id, platform, name, url, is_active, item_order)
VALUES ('social-youtube', 'youtube', 'YouTube', 'https://youtube.com/@constructiontw', 1, 2);

INSERT INTO social_links (id, platform, name, url, is_active, item_order)
VALUES ('social-ig', 'instagram', 'Instagram', 'https://instagram.com/constructiontw', 1, 3);
