
-- DELETE EXISTING DATA
DELETE FROM menu_items;
DELETE FROM social_links;
DELETE FROM menus WHERE code IN ('main', 'footer');

-- ENSURE MENUS EXIST
INSERT INTO menus (code, items_json) VALUES ('main', '[]');
INSERT INTO menus (code, items_json) VALUES ('footer', '[]');

-- ==========================================
-- MAIN MENU (Header)
-- ==========================================

-- 1. Home
INSERT INTO menu_items (id, menu_code, parent_id, title, link_type, url, item_order, is_visible, translation_key)
VALUES ('uuid-home', 'main', NULL, 'Home', 'internal', '/', 0, 1, 'NAV_HOME');

-- 2. About
INSERT INTO menu_items (id, menu_code, parent_id, title, link_type, url, item_order, is_visible, translation_key)
VALUES ('uuid-about', 'main', NULL, 'About', 'internal', '/about', 1, 1, 'NAV_ABOUT');

-- 3. Services (Parent)
INSERT INTO menu_items (id, menu_code, parent_id, title, link_type, url, item_order, is_visible, translation_key)
VALUES ('uuid-services', 'main', NULL, 'Services', 'internal', '/services', 2, 1, 'NAV_SERVICES');

    -- 3.1 Web Dev
    INSERT INTO menu_items (id, menu_code, parent_id, title, link_type, url, item_order, is_visible, translation_key)
    VALUES ('uuid-web', 'main', 'uuid-services', 'Web Development', 'internal', '/services/web', 0, 1, 'NAV_WEB_DEV');

    -- 3.2 Mobile Apps
    INSERT INTO menu_items (id, menu_code, parent_id, title, link_type, url, item_order, is_visible, translation_key)
    VALUES ('uuid-mobile', 'main', 'uuid-services', 'Mobile Apps', 'internal', '/services/mobile', 1, 1, 'NAV_MOBILE_APPS');

-- 4. Contact
INSERT INTO menu_items (id, menu_code, parent_id, title, link_type, url, item_order, is_visible, translation_key)
VALUES ('uuid-contact', 'main', NULL, 'Contact', 'internal', '/contact', 3, 1, 'NAV_CONTACT');


-- ==========================================
-- FOOTER MENU
-- ==========================================

INSERT INTO menu_items (id, menu_code, parent_id, title, link_type, url, item_order, is_visible, translation_key)
VALUES ('uuid-privacy', 'footer', NULL, 'Privacy Policy', 'internal', '/privacy', 0, 1, 'NAV_PRIVACY');

INSERT INTO menu_items (id, menu_code, parent_id, title, link_type, url, item_order, is_visible, translation_key)
VALUES ('uuid-terms', 'footer', NULL, 'Terms of Service', 'internal', '/terms', 1, 1, 'NAV_TERMS');


-- ==========================================
-- SOCIAL LINKS
-- ==========================================

INSERT INTO social_links (id, platform, name, url, is_active, item_order)
VALUES ('uuid-fb', 'facebook', 'Facebook', 'https://facebook.com', 1, 0);

INSERT INTO social_links (id, platform, name, url, is_active, item_order)
VALUES ('uuid-x', 'x', 'X (Twitter)', 'https://x.com', 1, 1);

INSERT INTO social_links (id, platform, name, url, is_active, item_order)
VALUES ('uuid-ig', 'instagram', 'Instagram', 'https://instagram.com', 1, 2);
