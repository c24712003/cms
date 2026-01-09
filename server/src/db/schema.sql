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

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'admin'
);

-- Menus Table
CREATE TABLE IF NOT EXISTS menus (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL, 
    items_json TEXT NOT NULL
);

-- ============================================
-- SAMPLE DATA
-- ============================================

-- Languages
INSERT OR IGNORE INTO languages (code, name, is_default, enabled) VALUES ('en', 'English', 1, 1);
INSERT OR IGNORE INTO languages (code, name, is_default, enabled) VALUES ('zh-TW', '繁體中文', 0, 1);
INSERT OR IGNORE INTO languages (code, name, is_default, enabled) VALUES ('ja', '日本語', 0, 1);
INSERT OR IGNORE INTO languages (code, name, is_default, enabled) VALUES ('ko', '한국어', 0, 0);

-- Translation Keys
INSERT OR IGNORE INTO translation_keys (key, namespace, description) VALUES ('NAV_HOME', 'common', 'Home navigation link');
INSERT OR IGNORE INTO translation_keys (key, namespace, description) VALUES ('NAV_ABOUT', 'common', 'About navigation link');
INSERT OR IGNORE INTO translation_keys (key, namespace, description) VALUES ('NAV_CONTACT', 'common', 'Contact navigation link');
INSERT OR IGNORE INTO translation_keys (key, namespace, description) VALUES ('NAV_SERVICES', 'common', 'Services navigation link');
INSERT OR IGNORE INTO translation_keys (key, namespace, description) VALUES ('BTN_SUBMIT', 'common', 'Submit button text');
INSERT OR IGNORE INTO translation_keys (key, namespace, description) VALUES ('BTN_CANCEL', 'common', 'Cancel button text');
INSERT OR IGNORE INTO translation_keys (key, namespace, description) VALUES ('FOOTER_COPYRIGHT', 'common', 'Footer copyright text');
INSERT OR IGNORE INTO translation_keys (key, namespace, description) VALUES ('CONTACT_TITLE', 'contact', 'Contact page title');
INSERT OR IGNORE INTO translation_keys (key, namespace, description) VALUES ('CONTACT_SUBTITLE', 'contact', 'Contact page subtitle');
INSERT OR IGNORE INTO translation_keys (key, namespace, description) VALUES ('FORM_NAME', 'forms', 'Name field label');
INSERT OR IGNORE INTO translation_keys (key, namespace, description) VALUES ('FORM_EMAIL', 'forms', 'Email field label');
INSERT OR IGNORE INTO translation_keys (key, namespace, description) VALUES ('FORM_MESSAGE', 'forms', 'Message field label');

-- Translation Values (English)
INSERT OR IGNORE INTO translation_values (trans_key, lang_code, value) VALUES ('NAV_HOME', 'en', 'Home');
INSERT OR IGNORE INTO translation_values (trans_key, lang_code, value) VALUES ('NAV_ABOUT', 'en', 'About Us');
INSERT OR IGNORE INTO translation_values (trans_key, lang_code, value) VALUES ('NAV_CONTACT', 'en', 'Contact');
INSERT OR IGNORE INTO translation_values (trans_key, lang_code, value) VALUES ('NAV_SERVICES', 'en', 'Services');
INSERT OR IGNORE INTO translation_values (trans_key, lang_code, value) VALUES ('BTN_SUBMIT', 'en', 'Submit');
INSERT OR IGNORE INTO translation_values (trans_key, lang_code, value) VALUES ('BTN_CANCEL', 'en', 'Cancel');
INSERT OR IGNORE INTO translation_values (trans_key, lang_code, value) VALUES ('FOOTER_COPYRIGHT', 'en', '© 2026 CMS Demo. All rights reserved.');
INSERT OR IGNORE INTO translation_values (trans_key, lang_code, value) VALUES ('CONTACT_TITLE', 'en', 'Get in Touch');
INSERT OR IGNORE INTO translation_values (trans_key, lang_code, value) VALUES ('CONTACT_SUBTITLE', 'en', 'We would love to hear from you');
INSERT OR IGNORE INTO translation_values (trans_key, lang_code, value) VALUES ('FORM_NAME', 'en', 'Your Name');
INSERT OR IGNORE INTO translation_values (trans_key, lang_code, value) VALUES ('FORM_EMAIL', 'en', 'Email Address');
INSERT OR IGNORE INTO translation_values (trans_key, lang_code, value) VALUES ('FORM_MESSAGE', 'en', 'Your Message');

-- Translation Values (繁體中文)
INSERT OR IGNORE INTO translation_values (trans_key, lang_code, value) VALUES ('NAV_HOME', 'zh-TW', '首頁');
INSERT OR IGNORE INTO translation_values (trans_key, lang_code, value) VALUES ('NAV_ABOUT', 'zh-TW', '關於我們');
INSERT OR IGNORE INTO translation_values (trans_key, lang_code, value) VALUES ('NAV_CONTACT', 'zh-TW', '聯絡我們');
INSERT OR IGNORE INTO translation_values (trans_key, lang_code, value) VALUES ('NAV_SERVICES', 'zh-TW', '服務項目');
INSERT OR IGNORE INTO translation_values (trans_key, lang_code, value) VALUES ('BTN_SUBMIT', 'zh-TW', '送出');
INSERT OR IGNORE INTO translation_values (trans_key, lang_code, value) VALUES ('BTN_CANCEL', 'zh-TW', '取消');
INSERT OR IGNORE INTO translation_values (trans_key, lang_code, value) VALUES ('FOOTER_COPYRIGHT', 'zh-TW', '© 2026 CMS 演示系統。保留所有權利。');
INSERT OR IGNORE INTO translation_values (trans_key, lang_code, value) VALUES ('CONTACT_TITLE', 'zh-TW', '與我們聯絡');
INSERT OR IGNORE INTO translation_values (trans_key, lang_code, value) VALUES ('CONTACT_SUBTITLE', 'zh-TW', '我們很樂意聽取您的意見');
INSERT OR IGNORE INTO translation_values (trans_key, lang_code, value) VALUES ('FORM_NAME', 'zh-TW', '您的姓名');
INSERT OR IGNORE INTO translation_values (trans_key, lang_code, value) VALUES ('FORM_EMAIL', 'zh-TW', '電子郵件');
INSERT OR IGNORE INTO translation_values (trans_key, lang_code, value) VALUES ('FORM_MESSAGE', 'zh-TW', '您的訊息');

-- Translation Values (日本語)
INSERT OR IGNORE INTO translation_values (trans_key, lang_code, value) VALUES ('NAV_HOME', 'ja', 'ホーム');
INSERT OR IGNORE INTO translation_values (trans_key, lang_code, value) VALUES ('NAV_ABOUT', 'ja', '会社概要');
INSERT OR IGNORE INTO translation_values (trans_key, lang_code, value) VALUES ('NAV_CONTACT', 'ja', 'お問い合わせ');
INSERT OR IGNORE INTO translation_values (trans_key, lang_code, value) VALUES ('NAV_SERVICES', 'ja', 'サービス');
INSERT OR IGNORE INTO translation_values (trans_key, lang_code, value) VALUES ('BTN_SUBMIT', 'ja', '送信');
INSERT OR IGNORE INTO translation_values (trans_key, lang_code, value) VALUES ('BTN_CANCEL', 'ja', 'キャンセル');

-- Menus
INSERT OR IGNORE INTO menus (code, items_json) VALUES ('main', '[{"label": "Home", "link": "/home"}, {"label": "About", "link": "/about"}, {"label": "Services", "link": "/services"}, {"label": "Contact", "link": "/contact"}]');
INSERT OR IGNORE INTO menus (code, items_json) VALUES ('footer', '[{"label": "Privacy Policy", "link": "/privacy"}, {"label": "Terms of Service", "link": "/terms"}]');

-- Pages
INSERT OR IGNORE INTO pages (slug_key, template) VALUES ('home', 'home');
INSERT OR IGNORE INTO pages (slug_key, template) VALUES ('about', 'default');
INSERT OR IGNORE INTO pages (slug_key, template) VALUES ('services', 'default');
INSERT OR IGNORE INTO pages (slug_key, template) VALUES ('contact', 'contact');

-- Page Contents: Home (English) - Rich Content Blocks
INSERT OR IGNORE INTO page_contents (page_id, lang_code, title, slug_localized, seo_title, seo_desc, content_json, updated_at)
SELECT id, 'en', 'Welcome to Our CMS', 'home', 'Home | CMS Demo', 'A powerful multilingual content management system built with Angular and Node.js', 
'[
  {"type":"hero-carousel","slides":[
    {"title":"Welcome to Our CMS","subtitle":"A powerful multilingual content management system built with modern technologies","cta":{"text":"Get Started","link":"/contact"},"image":"/assets/images/hero-cms.jpg"},
    {"title":"Seamless Content Management","subtitle":"Create, edit, and publish content in multiple languages with ease","cta":{"text":"Learn More","link":"/about"},"image":"/assets/images/hero-content.jpg"}
  ]},
  {"type":"feature-grid","title":"Why Choose Our CMS?","items":[
    {"icon":"icon-certified","title":"Multi-language Support","description":"Native i18n support for unlimited languages with easy switching"},
    {"icon":"icon-experience","title":"Modern Technology","description":"Built with Angular 21, Node.js, and SQLite for optimal performance"},
    {"icon":"icon-support","title":"Easy to Use","description":"Intuitive admin interface that anyone can learn in minutes"}
  ]},
  {"type":"stats-counter","background":"gradient-brand","stats":[
    {"value":"10+","label":"Languages Supported"},
    {"value":"99.9%","label":"Uptime"},
    {"value":"1000+","label":"Happy Users"},
    {"value":"24/7","label":"Support"}
  ]},
  {"type":"cta-banner","title":"Ready to Transform Your Content Management?","description":"Start managing your multilingual content with our powerful CMS platform today.","primaryCta":{"text":"Contact Us","link":"/contact"}}
]', 
CURRENT_TIMESTAMP FROM pages WHERE slug_key = 'home';

-- Page Contents: Home (繁體中文) - Rich Content Blocks
INSERT OR IGNORE INTO page_contents (page_id, lang_code, title, slug_localized, seo_title, seo_desc, content_json, updated_at)
SELECT id, 'zh-TW', '歡迎來到我們的 CMS', '首頁', '首頁 | CMS 演示', '使用 Angular 和 Node.js 打造的強大多語言內容管理系統', 
'[
  {"type":"hero-carousel","slides":[
    {"title":"歡迎使用我們的 CMS","subtitle":"使用現代技術打造的強大多語言內容管理系統","cta":{"text":"立即開始","link":"/contact"},"image":"/assets/images/hero-cms.jpg"},
    {"title":"無縫內容管理","subtitle":"輕鬆創建、編輯和發布多語言內容","cta":{"text":"了解更多","link":"/about"},"image":"/assets/images/hero-content.jpg"}
  ]},
  {"type":"feature-grid","title":"為何選擇我們的 CMS？","items":[
    {"icon":"icon-certified","title":"多語言支援","description":"原生 i18n 支援，無限語言輕鬆切換"},
    {"icon":"icon-experience","title":"現代技術","description":"採用 Angular 21、Node.js 和 SQLite 構建，效能最佳化"},
    {"icon":"icon-support","title":"易於使用","description":"直覺的管理介面，任何人都能在幾分鐘內上手"}
  ]},
  {"type":"stats-counter","background":"gradient-brand","stats":[
    {"value":"10+","label":"支援語言"},
    {"value":"99.9%","label":"運行時間"},
    {"value":"1000+","label":"滿意用戶"},
    {"value":"24/7","label":"全天候支援"}
  ]},
  {"type":"cta-banner","title":"準備好轉變您的內容管理方式了嗎？","description":"立即使用我們強大的 CMS 平台開始管理您的多語言內容。","primaryCta":{"text":"聯絡我們","link":"/contact"}}
]', 
CURRENT_TIMESTAMP FROM pages WHERE slug_key = 'home';

-- Page Contents: About (English) - Rich Content Blocks
INSERT OR IGNORE INTO page_contents (page_id, lang_code, title, slug_localized, seo_title, seo_desc, content_json, updated_at)
SELECT id, 'en', 'About Us', 'about', 'About | CMS Demo', 'Learn more about our company and mission', 
'[
  {"type":"page-hero","title":"About Us","subtitle":"We are a team of passionate developers dedicated to creating the best content management solutions","breadcrumb":[{"label":"Home","link":"/"},{"label":"About Us"}],"image":"/assets/images/hero-about.jpg"},
  {"type":"content-with-image","imagePosition":"right","title":"Our Story","items":["Founded in 2024 by a team of experienced developers","We have helped over 1000 companies streamline their digital content workflows","Our mission is to make content management effortless for everyone","We believe in open source and community-driven development"],"image":"/assets/images/team-illustration.svg"},
  {"type":"timeline-steps","title":"Our Journey","subtitle":"From startup to industry leader","steps":[
    {"number":"2024","title":"Founded","description":"Started with a vision to revolutionize content management"},
    {"number":"2025","title":"1000 Customers","description":"Reached our first milestone of 1000 happy customers"},
    {"number":"2026","title":"Global Expansion","description":"Expanded to serve customers in 50+ countries"}
  ]},
  {"type":"feature-grid","title":"Our Values","items":[
    {"icon":"icon-certified","title":"Quality","description":"We never compromise on the quality of our products"},
    {"icon":"icon-experience","title":"Innovation","description":"Constantly pushing boundaries with new technologies"},
    {"icon":"icon-support","title":"Customer First","description":"Your success is our top priority"}
  ]},
  {"type":"cta-banner","title":"Join Our Community","description":"Become part of our growing community of content creators and developers.","primaryCta":{"text":"Get Started","link":"/contact"}}
]', 
CURRENT_TIMESTAMP FROM pages WHERE slug_key = 'about';

-- Page Contents: About (繁體中文) - Rich Content Blocks
INSERT OR IGNORE INTO page_contents (page_id, lang_code, title, slug_localized, seo_title, seo_desc, content_json, updated_at)
SELECT id, 'zh-TW', '關於我們', '關於', '關於 | CMS 演示', '了解更多關於我們公司和使命', 
'[
  {"type":"page-hero","title":"關於我們","subtitle":"我們是一群充滿熱情的開發人員，致力於創建最佳的內容管理解決方案","breadcrumb":[{"label":"首頁","link":"/"},{"label":"關於我們"}],"image":"/assets/images/hero-about.jpg"},
  {"type":"content-with-image","imagePosition":"right","title":"我們的故事","items":["2024 年由經驗豐富的開發團隊創立","已幫助超過 1000 家公司簡化數位內容工作流程","我們的使命是讓內容管理對每個人都變得輕而易舉","我們相信開源和社群驅動的開發"],"image":"/assets/images/team-illustration.svg"},
  {"type":"timeline-steps","title":"我們的歷程","subtitle":"從新創到業界領導者","steps":[
    {"number":"2024","title":"公司成立","description":"以革新內容管理的願景起步"},
    {"number":"2025","title":"千家客戶","description":"達成首個里程碑：1000 位滿意客戶"},
    {"number":"2026","title":"全球擴展","description":"服務擴展至 50 多個國家的客戶"}
  ]},
  {"type":"feature-grid","title":"我們的價值觀","items":[
    {"icon":"icon-certified","title":"品質至上","description":"我們絕不在產品品質上妥協"},
    {"icon":"icon-experience","title":"持續創新","description":"不斷以新技術突破界限"},
    {"icon":"icon-support","title":"客戶優先","description":"您的成功是我們的首要任務"}
  ]},
  {"type":"cta-banner","title":"加入我們的社群","description":"成為我們不斷成長的內容創作者和開發者社群的一份子。","primaryCta":{"text":"立即開始","link":"/contact"}}
]', 
CURRENT_TIMESTAMP FROM pages WHERE slug_key = 'about';

-- Page Contents: Services (English) - Rich Content Blocks
INSERT OR IGNORE INTO page_contents (page_id, lang_code, title, slug_localized, seo_title, seo_desc, content_json, updated_at)
SELECT id, 'en', 'Our Services', 'services', 'Services | CMS Demo', 'Explore our range of content management services', 
'[
  {"type":"page-hero","title":"Our Services","subtitle":"Comprehensive content management solutions designed to meet your business needs","breadcrumb":[{"label":"Home","link":"/"},{"label":"Services"}],"image":"/assets/images/hero-services.jpg"},
  {"type":"card-carousel","title":"What We Offer","subtitle":"Explore our range of professional services","cards":[
    {"image":"/assets/images/service-web.jpg","title":"Website Development","summary":"Custom websites built with modern technologies like Angular, React, and Vue.js","link":"/services/web-development"},
    {"image":"/assets/images/service-i18n.jpg","title":"Multilingual Support","summary":"Reach global audiences with our comprehensive i18n solutions","link":"/services/i18n"},
    {"image":"/assets/images/service-seo.jpg","title":"SEO Optimization","summary":"Improve your search rankings with our SSR and optimization services","link":"/services/seo"}
  ]},
  {"type":"feature-grid","title":"Why Our Services?","items":[
    {"icon":"icon-certified","title":"Expert Team","description":"Certified professionals with years of industry experience"},
    {"icon":"icon-experience","title":"Proven Track Record","description":"Successfully delivered 500+ projects worldwide"},
    {"icon":"icon-support","title":"Ongoing Support","description":"Dedicated support team available 24/7"}
  ]},
  {"type":"stats-counter","background":"gradient-brand","stats":[
    {"value":"500+","label":"Projects Delivered"},
    {"value":"50+","label":"Countries Served"},
    {"value":"99%","label":"Client Satisfaction"},
    {"value":"24/7","label":"Support Available"}
  ]},
  {"type":"cta-banner","title":"Ready to Start Your Project?","description":"Contact us today for a free consultation and quote.","primaryCta":{"text":"Get a Quote","link":"/contact"}}
]', 
CURRENT_TIMESTAMP FROM pages WHERE slug_key = 'services';

-- Page Contents: Services (繁體中文) - Rich Content Blocks
INSERT OR IGNORE INTO page_contents (page_id, lang_code, title, slug_localized, seo_title, seo_desc, content_json, updated_at)
SELECT id, 'zh-TW', '我們的服務', '服務', '服務 | CMS 演示', '探索我們的內容管理服務範圍', 
'[
  {"type":"page-hero","title":"我們的服務","subtitle":"為滿足您的業務需求而設計的全方位內容管理解決方案","breadcrumb":[{"label":"首頁","link":"/"},{"label":"服務"}],"image":"/assets/images/hero-services.jpg"},
  {"type":"card-carousel","title":"我們提供的服務","subtitle":"探索我們的專業服務範圍","cards":[
    {"image":"/assets/images/service-web.jpg","title":"網站開發","summary":"使用 Angular、React 和 Vue.js 等現代技術構建客製化網站","link":"/services/web-development"},
    {"image":"/assets/images/service-i18n.jpg","title":"多語言支援","summary":"透過我們全面的 i18n 解決方案觸及全球受眾","link":"/services/i18n"},
    {"image":"/assets/images/service-seo.jpg","title":"SEO 優化","summary":"透過我們的 SSR 和優化服務提升您的搜尋排名","link":"/services/seo"}
  ]},
  {"type":"feature-grid","title":"為何選擇我們的服務？","items":[
    {"icon":"icon-certified","title":"專業團隊","description":"擁有多年行業經驗的認證專業人員"},
    {"icon":"icon-experience","title":"實績證明","description":"成功在全球交付超過 500 個專案"},
    {"icon":"icon-support","title":"持續支援","description":"專屬支援團隊全天候待命"}
  ]},
  {"type":"stats-counter","background":"gradient-brand","stats":[
    {"value":"500+","label":"已交付專案"},
    {"value":"50+","label":"服務國家"},
    {"value":"99%","label":"客戶滿意度"},
    {"value":"24/7","label":"全天候支援"}
  ]},
  {"type":"cta-banner","title":"準備好開始您的專案了嗎？","description":"立即聯繫我們，獲得免費諮詢和報價。","primaryCta":{"text":"獲取報價","link":"/contact"}}
]', 
CURRENT_TIMESTAMP FROM pages WHERE slug_key = 'services';

-- Page Contents: Contact (English) - Rich Content Blocks
INSERT OR IGNORE INTO page_contents (page_id, lang_code, title, slug_localized, seo_title, seo_desc, content_json, updated_at)
SELECT id, 'en', 'Contact Us', 'contact', 'Contact | CMS Demo', 'Get in touch with our team', 
'[
  {"type":"page-hero","title":"Contact Us","subtitle":"We would love to hear from you! Get in touch with our team.","breadcrumb":[{"label":"Home","link":"/"},{"label":"Contact"}],"image":"/assets/images/hero-contact.jpg"},
  {"type":"feature-grid","title":"How to Reach Us","items":[
    {"icon":"icon-certified","title":"Email","description":"hello@cmsdemo.com - We reply within 24 hours"},
    {"icon":"icon-experience","title":"Phone","description":"+1 (555) 123-4567 - Mon-Fri, 9am-6pm"},
    {"icon":"icon-support","title":"Office","description":"123 Tech Street, San Francisco, CA 94102"}
  ]},
  {"type":"faq-accordion","title":"Frequently Asked Questions","items":[
    {"question":"What are your business hours?","answer":"Our team is available Monday through Friday, 9am to 6pm PST. For urgent matters, you can reach our 24/7 support hotline."},
    {"question":"How quickly do you respond to inquiries?","answer":"We aim to respond to all inquiries within 24 hours during business days. Priority support customers receive responses within 4 hours."},
    {"question":"Do you offer free consultations?","answer":"Yes! We offer a free 30-minute consultation to discuss your project requirements and how we can help."}
  ]},
  {"type":"cta-banner","title":"Let us Build Something Great Together","description":"Fill out our contact form and we will get back to you within 24 hours.","primaryCta":{"text":"Send Message","link":"/contact/form"}}
]', 
CURRENT_TIMESTAMP FROM pages WHERE slug_key = 'contact';

-- Page Contents: Contact (繁體中文) - Rich Content Blocks
INSERT OR IGNORE INTO page_contents (page_id, lang_code, title, slug_localized, seo_title, seo_desc, content_json, updated_at)
SELECT id, 'zh-TW', '聯絡我們', '聯絡', '聯絡 | CMS 演示', '與我們的團隊取得聯繫', 
'[
  {"type":"page-hero","title":"聯絡我們","subtitle":"我們很樂意聽取您的意見！與我們的團隊取得聯繫。","breadcrumb":[{"label":"首頁","link":"/"},{"label":"聯絡"}],"image":"/assets/images/hero-contact.jpg"},
  {"type":"feature-grid","title":"如何聯繫我們","items":[
    {"icon":"icon-certified","title":"電子郵件","description":"hello@cmsdemo.com - 我們在 24 小時內回覆"},
    {"icon":"icon-experience","title":"電話","description":"+886 (2) 1234-5678 - 週一至週五，上午 9 點至下午 6 點"},
    {"icon":"icon-support","title":"辦公室","description":"台北市信義區科技路 123 號"}
  ]},
  {"type":"faq-accordion","title":"常見問題","items":[
    {"question":"您們的營業時間是？","answer":"我們的團隊在週一至週五上午 9 點至下午 6 點提供服務。緊急事項可撥打我們的 24/7 支援熱線。"},
    {"question":"您們回覆詢問的速度有多快？","answer":"我們致力於在工作日內的 24 小時內回覆所有詢問。優先支援客戶可在 4 小時內獲得回覆。"},
    {"question":"您們提供免費諮詢嗎？","answer":"是的！我們提供 30 分鐘的免費諮詢，討論您的專案需求以及我們如何提供幫助。"}
  ]},
  {"type":"cta-banner","title":"讓我們一起打造偉大的作品","description":"填寫我們的聯絡表單，我們將在 24 小時內回覆您。","primaryCta":{"text":"發送訊息","link":"/contact/form"}}
]', 
CURRENT_TIMESTAMP FROM pages WHERE slug_key = 'contact';


-- ============================================
-- MODERN CORPORATE WEBSITE SAMPLE DATA
-- ============================================

-- Corporate Hierarchical Main Menu (3-level navigation)
INSERT OR IGNORE INTO menus (code, items_json) VALUES ('corporate-main', '[
  {"label":"首頁","labelKey":"NAV_HOME","link":"/","children":[]},
  {"label":"關於我們","labelKey":"NAV_ABOUT","link":"/about","children":[
    {"label":"公司簡介","link":"/about/company"},
    {"label":"經營理念","link":"/about/philosophy"},
    {"label":"領導團隊","link":"/about/leadership"},
    {"label":"里程碑","link":"/about/milestones"}
  ]},
  {"label":"解決方案","labelKey":"NAV_SOLUTIONS","link":"/solutions","children":[
    {"label":"企業數位轉型","link":"/solutions/digital-transformation","children":[
      {"label":"雲端遷移服務","link":"/solutions/digital-transformation/cloud-migration"},
      {"label":"流程自動化","link":"/solutions/digital-transformation/automation"},
      {"label":"數據分析平台","link":"/solutions/digital-transformation/analytics"}
    ]},
    {"label":"資訊安全防護","link":"/solutions/security","children":[
      {"label":"端點防護方案","link":"/solutions/security/endpoint"},
      {"label":"資安健檢服務","link":"/solutions/security/assessment"}
    ]},
    {"label":"智慧製造","link":"/solutions/smart-manufacturing"}
  ]},
  {"label":"成功案例","labelKey":"NAV_CASES","link":"/cases","children":[
    {"label":"依產業分類","link":"/cases/industry","children":[
      {"label":"金融業","link":"/cases/industry/finance"},
      {"label":"製造業","link":"/cases/industry/manufacturing"},
      {"label":"零售業","link":"/cases/industry/retail"}
    ]},
    {"label":"依解決方案","link":"/cases/by-solution"}
  ]},
  {"label":"最新消息","labelKey":"NAV_NEWS","link":"/news","children":[
    {"label":"公司動態","link":"/news/company"},
    {"label":"產業洞察","link":"/news/insights"},
    {"label":"媒體報導","link":"/news/media"}
  ]},
  {"label":"聯絡我們","labelKey":"NAV_CONTACT","link":"/contact","children":[
    {"label":"商務諮詢","link":"/contact/inquiry"},
    {"label":"據點資訊","link":"/contact/locations"},
    {"label":"加入我們","link":"/contact/careers"}
  ]}
]');

-- Corporate Pages
INSERT OR IGNORE INTO pages (slug_key, template) VALUES ('corporate-home', 'corporate-home');
INSERT OR IGNORE INTO pages (slug_key, template) VALUES ('solutions', 'solutions-landing');
INSERT OR IGNORE INTO pages (slug_key, template) VALUES ('solutions/digital-transformation', 'solution-detail');
INSERT OR IGNORE INTO pages (slug_key, template) VALUES ('cases', 'cases-list');
INSERT OR IGNORE INTO pages (slug_key, template) VALUES ('about/company', 'about');

-- Corporate Home Page Content (繁體中文) - 6 Content Blocks
INSERT OR IGNORE INTO page_contents (page_id, lang_code, title, slug_localized, seo_title, seo_desc, content_json, updated_at)
SELECT id, 'zh-TW', '首頁', '首頁', '領先科技解決方案 | 企業數位轉型專家', '我們以領先技術與豐富經驗，協助超過 500 家企業完成數位轉型之旅，提供雲端遷移、資安防護、智慧製造等全方位解決方案。',
'[
  {"type":"hero-carousel","slides":[
    {"title":"驅動企業創新，成就數位未來","subtitle":"我們以領先技術與豐富經驗，協助超過 500 家企業完成數位轉型之旅","cta":{"text":"立即諮詢","link":"/contact/inquiry"},"image":"/assets/images/hero-digital-transformation.jpg"},
    {"title":"資安無死角，營運不中斷","subtitle":"獲 ISO 27001 認證的全方位資安防護解決方案","cta":{"text":"了解更多","link":"/solutions/security"},"image":"/assets/images/hero-security.jpg"}
  ]},
  {"type":"feature-grid","title":"為何選擇我們？","items":[
    {"icon":"icon-certified","title":"國際認證品質","description":"取得 ISO 27001、ISO 9001 雙認證，服務品質受國際肯定"},
    {"icon":"icon-experience","title":"20+ 年產業經驗","description":"深耕金融、製造、零售產業，累積豐富的垂直領域專業知識"},
    {"icon":"icon-support","title":"7×24 技術支援","description":"全年無休的在地技術團隊，確保您的系統穩定運作"}
  ]},
  {"type":"card-carousel","title":"我們的解決方案","subtitle":"從策略規劃到落地執行，提供完整的數位服務藍圖","cards":[
    {"image":"/assets/images/solution-dt.jpg","title":"企業數位轉型","summary":"結合雲端技術與流程再造，打造靈活高效的現代企業架構","link":"/solutions/digital-transformation"},
    {"image":"/assets/images/solution-security.jpg","title":"資訊安全防護","summary":"從端點到雲端的全面防護，守護企業核心資產與商業機密","link":"/solutions/security"},
    {"image":"/assets/images/solution-manufacturing.jpg","title":"智慧製造","summary":"IoT 與 AI 驅動的生產優化，提升產能並降低營運成本","link":"/solutions/smart-manufacturing"}
  ]},
  {"type":"case-study-showcase","title":"客戶成功故事","cases":[
    {"logo":"/assets/logos/client-abc-bank.svg","name":"ABC 銀行","industry":"金融業","challenge":"老舊核心系統難以支撐數位金融服務的快速發展","result":"系統效能提升 340%，新服務上線時程縮短 60%","quote":"「這是我們近十年來最成功的 IT 專案，為銀行的數位化奠定了堅實基礎。」—— 資訊長 王大明","link":"/cases/abc-bank"}
  ],"viewMoreText":"探索更多成功案例","viewMoreLink":"/cases"},
  {"type":"stats-counter","background":"gradient-brand","stats":[
    {"value":"500+","label":"服務企業客戶"},
    {"value":"98%","label":"客戶續約率"},
    {"value":"150+","label":"專業技術顧問"},
    {"value":"20+","label":"年產業經驗"}
  ]},
  {"type":"cta-banner","title":"準備好開啟您的數位轉型之旅了嗎？","description":"我們的專業顧問團隊將為您量身規劃最適合的解決方案，歡迎預約免費諮詢","primaryCta":{"text":"預約諮詢","link":"/contact/inquiry"},"secondaryCta":{"text":"下載服務簡介","link":"/downloads/company-brochure.pdf"}}
]',
CURRENT_TIMESTAMP FROM pages WHERE slug_key = 'corporate-home';

-- Solutions Digital Transformation Page Content (繁體中文) - 7 Content Blocks
INSERT OR IGNORE INTO page_contents (page_id, lang_code, title, slug_localized, seo_title, seo_desc, content_json, updated_at)
SELECT id, 'zh-TW', '企業數位轉型解決方案', '企業數位轉型', '企業數位轉型解決方案 | 雲端遷移、流程自動化', '從雲端遷移、流程自動化到數據驅動決策，我們提供端到端的數位轉型服務，協助企業打造現代化 IT 架構。',
'[
  {"type":"page-hero","title":"企業數位轉型解決方案","subtitle":"從雲端遷移、流程自動化到數據驅動決策，我們提供端到端的轉型服務","breadcrumb":[{"label":"首頁","link":"/"},{"label":"解決方案","link":"/solutions"},{"label":"企業數位轉型"}],"image":"/assets/images/hero-solutions.jpg"},
  {"type":"content-with-image","imagePosition":"right","title":"您是否正面臨這些挑戰？","items":["🔴 老舊系統維護成本高昂，卻難以支援業務創新需求","🔴 部門間資訊孤島嚴重，數據難以整合分析","🔴 人工作業流程繁瑣，團隊生產力無法有效提升","🔴 缺乏數位人才，不知從何著手規劃轉型藍圖"],"image":"/assets/images/challenges-illustration.svg"},
  {"type":"tabbed-content","title":"我們的方案涵蓋","tabs":[
    {"label":"雲端遷移服務","title":"安全、高效的雲端旅程","content":"我們採用業界最佳實踐的 6R 遷移策略（Rehost、Replatform、Refactor、Repurchase、Retire、Retain），協助企業評估現有工作負載，制定最佳化的雲端架構，並確保遷移過程零中斷、資料零遺失。","features":["✅ 工作負載評估與 TCO 分析","✅ 多雲 / 混合雲架構規劃","✅ 應用程式現代化改造"]},
    {"label":"流程自動化","title":"用智慧驅動營運效率","content":"導入 RPA（機器人流程自動化）與低程式碼平台，將重複性高、耗時費力的人工作業轉化為自動化流程，釋放員工生產力投入更高價值的工作。","features":["✅ RPA 機器人開發與部署","✅ 低程式碼應用平台導入","✅ 智慧文件處理（IDP）"]}
  ]},
  {"type":"timeline-steps","title":"我們的服務流程","subtitle":"系統化的導入方法論，確保專案順利交付","steps":[
    {"number":"01","title":"需求訪談與現況評估","description":"深入了解您的業務目標、現有 IT 環境與痛點，產出完整的評估報告","duration":"2-3 週"},
    {"number":"02","title":"轉型藍圖規劃","description":"依據評估結果，制定分階段導入計畫與 KPI 指標","duration":"2-4 週"},
    {"number":"03","title":"實施與導入","description":"敏捷式開發與迭代交付，每階段進行驗收與調整"},
    {"number":"04","title":"上線與持續優化","description":"正式上線後提供維運支援，並基於數據持續優化改善"}
  ]},
  {"type":"case-cards","title":"成功案例實績","cases":[
    {"image":"/assets/images/case-xyz-corp.jpg","title":"XYZ 製造集團雲端轉型專案","summary":"將核心 ERP 遷移至混合雲架構，系統穩定性提升至 99.9%，年度維運成本降低 35%","tags":["雲端遷移","製造業"],"link":"/cases/xyz-corp"},
    {"image":"/assets/images/case-retail.jpg","title":"台灣零售龍頭 RPA 導入","summary":"導入 50+ 支自動化機器人，每年節省超過 12,000 人工小時","tags":["流程自動化","零售業"],"link":"/cases/retail-rpa"}
  ]},
  {"type":"faq-accordion","title":"常見問題","items":[
    {"question":"數位轉型專案通常需要多長時間？","answer":"轉型時程取決於專案範圍與複雜度。一般而言，初階雲端遷移專案約需 3-6 個月，而涵蓋多系統整合的大型轉型專案可能需要 12-18 個月。我們會在評估階段提供詳細的專案時程規劃。"},
    {"question":"如何確保轉型過程中業務不中斷？","answer":"我們採用分階段遷移策略，並建立完善的回退機制（Rollback Plan）。關鍵系統會在離峰時段進行切換，並安排專責團隊進行 24 小時監控，確保業務營運不受影響。"},
    {"question":"貴公司提供哪些售後支援服務？","answer":"我們提供多種維運支援方案，包含標準工時（8×5）與全天候（7×24）服務模式，涵蓋系統監控、問題排除、效能調校與定期健檢報告。"}
  ]},
  {"type":"contact-form-cta","title":"與我們的專家聊聊","description":"填寫以下表單，我們的解決方案顧問將於 1 個工作天內與您聯繫","fields":["姓名*","公司名稱*","職稱","電子郵件*","電話","諮詢主題","訊息內容"],"submitButton":"送出諮詢","privacy":"提交此表單即表示您同意我們的隱私權政策，我們將妥善保護您的個人資料。"}
]',
CURRENT_TIMESTAMP FROM pages WHERE slug_key = 'solutions/digital-transformation';

-- Solutions Landing Page Content (繁體中文)
INSERT OR IGNORE INTO page_contents (page_id, lang_code, title, slug_localized, seo_title, seo_desc, content_json, updated_at)
SELECT id, 'zh-TW', '解決方案', '解決方案', '解決方案 | 企業數位轉型、資安防護、智慧製造', '提供企業數位轉型、資訊安全防護、智慧製造等全方位解決方案，協助企業提升競爭力。',
'[
  {"type":"page-hero","title":"解決方案","subtitle":"從策略規劃到落地執行，我們提供全方位的企業解決方案","breadcrumb":[{"label":"首頁","link":"/"},{"label":"解決方案"}],"image":"/assets/images/hero-solutions.jpg"},
  {"type":"card-carousel","title":"探索我們的服務","subtitle":"根據您的業務需求，選擇最適合的解決方案","cards":[
    {"image":"/assets/images/solution-dt.jpg","title":"企業數位轉型","summary":"結合雲端技術與流程再造，打造靈活高效的現代企業架構","link":"/solutions/digital-transformation"},
    {"image":"/assets/images/solution-security.jpg","title":"資訊安全防護","summary":"從端點到雲端的全面防護，守護企業核心資產與商業機密","link":"/solutions/security"},
    {"image":"/assets/images/solution-manufacturing.jpg","title":"智慧製造","summary":"IoT 與 AI 驅動的生產優化，提升產能並降低營運成本","link":"/solutions/smart-manufacturing"}
  ]},
  {"type":"feature-grid","title":"我們的核心能力","items":[
    {"icon":"icon-certified","title":"專業顧問團隊","description":"超過 150 位具備產業經驗的技術顧問，提供專業諮詢服務"},
    {"icon":"icon-experience","title":"敏捷交付方法","description":"採用 Scrum/Kanban 敏捷開發，確保專案如期交付"},
    {"icon":"icon-support","title":"持續維運支援","description":"7×24 全年無休的技術支援，確保系統穩定運作"}
  ]},
  {"type":"cta-banner","title":"找不到適合的方案？","description":"讓我們的顧問為您量身打造專屬解決方案","primaryCta":{"text":"聯絡我們","link":"/contact/inquiry"}}
]',
CURRENT_TIMESTAMP FROM pages WHERE slug_key = 'solutions';

-- Cases List Page Content (繁體中文)
INSERT OR IGNORE INTO page_contents (page_id, lang_code, title, slug_localized, seo_title, seo_desc, content_json, updated_at)
SELECT id, 'zh-TW', '成功案例', '成功案例', '成功案例 | 客戶故事與數位轉型實績', '探索我們如何協助金融、製造、零售等產業客戶完成數位轉型，創造可量化的商業價值。',
'[
  {"type":"page-hero","title":"成功案例","subtitle":"探索我們如何協助企業客戶創造可量化的商業價值","breadcrumb":[{"label":"首頁","link":"/"},{"label":"成功案例"}],"image":"/assets/images/hero-cases.jpg"},
  {"type":"feature-grid","title":"依產業分類","items":[
    {"icon":"icon-certified","title":"金融業","description":"協助銀行、保險、證券業者完成核心系統現代化"},
    {"icon":"icon-experience","title":"製造業","description":"導入智慧製造與供應鏈數位化解決方案"},
    {"icon":"icon-support","title":"零售業","description":"打造全通路零售平台與顧客數據分析"}
  ]},
  {"type":"case-cards","title":"精選案例","cases":[
    {"image":"/assets/images/case-abc-bank.jpg","title":"ABC 銀行核心系統現代化","summary":"將 30 年老舊核心系統遷移至雲端，系統效能提升 340%，新服務上線時程縮短 60%","tags":["金融業","雲端遷移"],"link":"/cases/abc-bank"},
    {"image":"/assets/images/case-xyz-corp.jpg","title":"XYZ 製造集團智慧工廠","summary":"導入 IoT 感測器與 AI 預測維護，設備故障率降低 75%，產能提升 28%","tags":["製造業","智慧製造"],"link":"/cases/xyz-corp"},
    {"image":"/assets/images/case-retail.jpg","title":"大型零售通路 RPA 導入","summary":"導入 50+ 支自動化機器人，每年節省超過 12,000 人工小時，準確率達 99.9%","tags":["零售業","流程自動化"],"link":"/cases/retail-rpa"},
    {"image":"/assets/images/case-insurance.jpg","title":"保險公司數據分析平台","summary":"建立客戶 360 度視圖，理賠效率提升 45%，客戶滿意度增加 32%","tags":["金融業","數據分析"],"link":"/cases/insurance-analytics"}
  ]},
  {"type":"stats-counter","background":"gradient-brand","stats":[
    {"value":"500+","label":"成功案例"},
    {"value":"98%","label":"客戶滿意度"},
    {"value":"50+","label":"產業覆蓋"},
    {"value":"15","label":"國家服務"}
  ]},
  {"type":"cta-banner","title":"想了解更多案例詳情？","description":"預約一對一諮詢，我們將根據您的需求分享相關案例","primaryCta":{"text":"預約諮詢","link":"/contact/inquiry"}}
]',
CURRENT_TIMESTAMP FROM pages WHERE slug_key = 'cases';

-- About Company Page Content (繁體中文)
INSERT OR IGNORE INTO page_contents (page_id, lang_code, title, slug_localized, seo_title, seo_desc, content_json, updated_at)
SELECT id, 'zh-TW', '關於我們', '公司簡介', '關於我們 | 企業數位轉型領導品牌', '我們是專注於企業數位轉型的領導品牌，擁有 20+ 年產業經驗，服務超過 500 家企業客戶。',
'[
  {"type":"page-hero","title":"關於我們","subtitle":"以科技創新驅動企業成長，成為您值得信賴的數位轉型夥伴","breadcrumb":[{"label":"首頁","link":"/"},{"label":"關於我們"},{"label":"公司簡介"}],"image":"/assets/images/hero-about.jpg"},
  {"type":"content-with-image","imagePosition":"right","title":"我們的使命","items":["🎯 協助企業運用科技創新提升競爭力","🎯 提供端到端的數位轉型解決方案","🎯 培養數位人才，推動產業升級","🎯 成為客戶最信賴的長期合作夥伴"],"image":"/assets/images/mission-illustration.svg"},
  {"type":"timeline-steps","title":"發展里程碑","subtitle":"從創立至今，我們持續成長茁壯","steps":[
    {"number":"2005","title":"公司創立","description":"由三位資深 IT 顧問創立，專注於系統整合服務"},
    {"number":"2010","title":"跨足雲端","description":"成為 AWS、Azure 認證合作夥伴，開始雲端遷移服務"},
    {"number":"2018","title":"數位轉型","description":"轉型為數位轉型顧問公司，服務擴展至東南亞市場"},
    {"number":"2024","title":"AI 驅動","description":"成立 AI 實驗室，將生成式 AI 整合至解決方案中"}
  ]},
  {"type":"feature-grid","title":"核心價值觀","items":[
    {"icon":"icon-certified","title":"專業","description":"持續精進技術能力，提供最佳解決方案"},
    {"icon":"icon-experience","title":"誠信","description":"以誠信為本，建立長期夥伴關係"},
    {"icon":"icon-support","title":"創新","description":"擁抱變革，以創新思維解決問題"}
  ]},
  {"type":"stats-counter","background":"gradient-brand","stats":[
    {"value":"500+","label":"服務企業"},
    {"value":"150+","label":"專業顧問"},
    {"value":"20+","label":"年經驗"},
    {"value":"15","label":"全球據點"}
  ]},
  {"type":"cta-banner","title":"加入我們的團隊","description":"我們正在尋找優秀人才，一起打造更美好的數位未來","primaryCta":{"text":"查看職缺","link":"/contact/careers"}}
]',
CURRENT_TIMESTAMP FROM pages WHERE slug_key = 'about/company';

-- ============================================
-- ENGLISH CONTENT FOR CORPORATE PAGES
-- ============================================

-- Corporate Home Page Content (English)
INSERT OR IGNORE INTO page_contents (page_id, lang_code, title, slug_localized, seo_title, seo_desc, content_json, updated_at)
SELECT id, 'en', 'Home', 'home', 'Leading Technology Solutions | Digital Transformation Expert', 'With advanced technology and rich experience, we have helped over 500 enterprises complete their digital transformation journey.',
'[
  {"type":"hero-carousel","slides":[
    {"title":"Drive Innovation, Shape the Future","subtitle":"With cutting-edge technology and extensive experience, we have helped over 500 enterprises complete their digital transformation journey","cta":{"text":"Get Started","link":"/contact/inquiry"},"image":"/assets/images/hero-digital-transformation.jpg"},
    {"title":"Comprehensive Security, Non-stop Operations","subtitle":"ISO 27001 certified comprehensive security protection solutions","cta":{"text":"Learn More","link":"/solutions/security"},"image":"/assets/images/hero-security.jpg"}
  ]},
  {"type":"feature-grid","title":"Why Choose Us?","items":[
    {"icon":"icon-certified","title":"International Certifications","description":"ISO 27001 and ISO 9001 dual certified, internationally recognized service quality"},
    {"icon":"icon-experience","title":"20+ Years Experience","description":"Deep expertise in finance, manufacturing, and retail industries"},
    {"icon":"icon-support","title":"24/7 Technical Support","description":"Round-the-clock local technical team ensuring system stability"}
  ]},
  {"type":"card-carousel","title":"Our Solutions","subtitle":"From strategy to execution, we provide comprehensive digital services","cards":[
    {"image":"/assets/images/solution-dt.jpg","title":"Digital Transformation","summary":"Combining cloud technology with process reengineering to build agile enterprise architecture","link":"/solutions/digital-transformation"},
    {"image":"/assets/images/solution-security.jpg","title":"Cybersecurity","summary":"End-to-end protection from endpoints to cloud, safeguarding your core assets","link":"/solutions/security"},
    {"image":"/assets/images/solution-manufacturing.jpg","title":"Smart Manufacturing","summary":"IoT and AI-driven production optimization, boosting efficiency and reducing costs","link":"/solutions/smart-manufacturing"}
  ]},
  {"type":"case-study-showcase","title":"Customer Success Stories","cases":[
    {"logo":"/assets/logos/client-abc-bank.svg","name":"ABC Bank","industry":"Financial Services","challenge":"Legacy core systems unable to support rapid digital banking development","result":"340% system performance improvement, 60% faster time-to-market","quote":"This is our most successful IT project in a decade, laying a solid foundation for digital banking. — CIO","link":"/cases/abc-bank"}
  ],"viewMoreText":"Explore More Cases","viewMoreLink":"/cases"},
  {"type":"stats-counter","background":"gradient-brand","stats":[
    {"value":"500+","label":"Enterprise Clients"},
    {"value":"98%","label":"Client Retention"},
    {"value":"150+","label":"Expert Consultants"},
    {"value":"20+","label":"Years Experience"}
  ]},
  {"type":"cta-banner","title":"Ready to Start Your Digital Journey?","description":"Our expert team will design the perfect solution for your business. Book a free consultation today.","primaryCta":{"text":"Book Consultation","link":"/contact/inquiry"},"secondaryCta":{"text":"Download Brochure","link":"/downloads/company-brochure.pdf"}}
]',
CURRENT_TIMESTAMP FROM pages WHERE slug_key = 'corporate-home';

-- Solutions Landing Page Content (English)
INSERT OR IGNORE INTO page_contents (page_id, lang_code, title, slug_localized, seo_title, seo_desc, content_json, updated_at)
SELECT id, 'en', 'Solutions', 'solutions', 'Solutions | Digital Transformation, Cybersecurity, Smart Manufacturing', 'Enterprise solutions for digital transformation, cybersecurity, and smart manufacturing to boost your competitive edge.',
'[
  {"type":"page-hero","title":"Solutions","subtitle":"From strategy to execution, we deliver comprehensive enterprise solutions","breadcrumb":[{"label":"Home","link":"/"},{"label":"Solutions"}],"image":"/assets/images/hero-solutions.jpg"},
  {"type":"card-carousel","title":"Explore Our Services","subtitle":"Choose the solution that best fits your business needs","cards":[
    {"image":"/assets/images/solution-dt.jpg","title":"Digital Transformation","summary":"Combining cloud technology with process reengineering to build agile enterprise architecture","link":"/solutions/digital-transformation"},
    {"image":"/assets/images/solution-security.jpg","title":"Cybersecurity","summary":"End-to-end protection from endpoints to cloud, safeguarding your core assets","link":"/solutions/security"},
    {"image":"/assets/images/solution-manufacturing.jpg","title":"Smart Manufacturing","summary":"IoT and AI-driven production optimization, boosting efficiency and reducing costs","link":"/solutions/smart-manufacturing"}
  ]},
  {"type":"feature-grid","title":"Our Core Capabilities","items":[
    {"icon":"icon-certified","title":"Expert Consultants","description":"Over 150 industry-experienced technical consultants providing professional advisory services"},
    {"icon":"icon-experience","title":"Agile Delivery","description":"Using Scrum/Kanban agile development to ensure on-time project delivery"},
    {"icon":"icon-support","title":"Continuous Support","description":"24/7 year-round technical support ensuring system stability"}
  ]},
  {"type":"cta-banner","title":"Cannot Find the Right Solution?","description":"Let our consultants design a custom solution tailored to your needs","primaryCta":{"text":"Contact Us","link":"/contact/inquiry"}}
]',
CURRENT_TIMESTAMP FROM pages WHERE slug_key = 'solutions';

-- Cases List Page Content (English)
INSERT OR IGNORE INTO page_contents (page_id, lang_code, title, slug_localized, seo_title, seo_desc, content_json, updated_at)
SELECT id, 'en', 'Case Studies', 'cases', 'Case Studies | Customer Success Stories', 'Explore how we have helped clients in finance, manufacturing, and retail achieve digital transformation and measurable business value.',
'[
  {"type":"page-hero","title":"Case Studies","subtitle":"Discover how we help enterprise clients create measurable business value","breadcrumb":[{"label":"Home","link":"/"},{"label":"Case Studies"}],"image":"/assets/images/hero-cases.jpg"},
  {"type":"feature-grid","title":"Browse by Industry","items":[
    {"icon":"icon-certified","title":"Financial Services","description":"Helping banks, insurance, and securities firms modernize core systems"},
    {"icon":"icon-experience","title":"Manufacturing","description":"Implementing smart manufacturing and supply chain digitization solutions"},
    {"icon":"icon-support","title":"Retail","description":"Building omnichannel retail platforms and customer analytics"}
  ]},
  {"type":"case-cards","title":"Featured Cases","cases":[
    {"image":"/assets/images/case-abc-bank.jpg","title":"ABC Bank Core System Modernization","summary":"Migrated 30-year-old core system to cloud, 340% performance improvement, 60% faster time-to-market","tags":["Financial Services","Cloud Migration"],"link":"/cases/abc-bank"},
    {"image":"/assets/images/case-xyz-corp.jpg","title":"XYZ Manufacturing Smart Factory","summary":"Deployed IoT sensors and AI predictive maintenance, 75% reduction in equipment failures, 28% productivity increase","tags":["Manufacturing","Smart Factory"],"link":"/cases/xyz-corp"},
    {"image":"/assets/images/case-retail.jpg","title":"Major Retail Chain RPA Implementation","summary":"Deployed 50+ automation bots, saving over 12,000 man-hours annually with 99.9% accuracy","tags":["Retail","Process Automation"],"link":"/cases/retail-rpa"}
  ]},
  {"type":"stats-counter","background":"gradient-brand","stats":[
    {"value":"500+","label":"Success Cases"},
    {"value":"98%","label":"Client Satisfaction"},
    {"value":"50+","label":"Industries Covered"},
    {"value":"15","label":"Countries Served"}
  ]},
  {"type":"cta-banner","title":"Want to Learn More?","description":"Book a one-on-one consultation and we will share relevant cases based on your needs","primaryCta":{"text":"Book Consultation","link":"/contact/inquiry"}}
]',
CURRENT_TIMESTAMP FROM pages WHERE slug_key = 'cases';

-- About Company Page Content (English)
INSERT OR IGNORE INTO page_contents (page_id, lang_code, title, slug_localized, seo_title, seo_desc, content_json, updated_at)
SELECT id, 'en', 'About Us', 'about', 'About Us | Digital Transformation Leader', 'We are a leading digital transformation company with 20+ years of experience, serving over 500 enterprise clients.',
'[
  {"type":"page-hero","title":"About Us","subtitle":"Driving enterprise growth through technology innovation, your trusted digital transformation partner","breadcrumb":[{"label":"Home","link":"/"},{"label":"About Us"},{"label":"Company Profile"}],"image":"/assets/images/hero-about.jpg"},
  {"type":"content-with-image","imagePosition":"right","title":"Our Mission","items":["🎯 Help enterprises leverage technology innovation to enhance competitiveness","🎯 Provide end-to-end digital transformation solutions","🎯 Develop digital talent and drive industry upgrades","🎯 Become the most trusted long-term partner for our clients"],"image":"/assets/images/mission-illustration.svg"},
  {"type":"timeline-steps","title":"Milestones","subtitle":"Our journey of continuous growth","steps":[
    {"number":"2005","title":"Founded","description":"Established by three senior IT consultants, focusing on system integration services"},
    {"number":"2010","title":"Cloud Expansion","description":"Became AWS and Azure certified partner, began cloud migration services"},
    {"number":"2018","title":"Digital Transformation","description":"Transformed into a digital transformation consultancy, expanded to Southeast Asia"},
    {"number":"2024","title":"AI-Powered","description":"Established AI Lab, integrating generative AI into our solutions"}
  ]},
  {"type":"feature-grid","title":"Core Values","items":[
    {"icon":"icon-certified","title":"Professionalism","description":"Continuously improving technical capabilities to deliver optimal solutions"},
    {"icon":"icon-experience","title":"Integrity","description":"Building long-term partnerships based on trust and honesty"},
    {"icon":"icon-support","title":"Innovation","description":"Embracing change and solving problems with innovative thinking"}
  ]},
  {"type":"stats-counter","background":"gradient-brand","stats":[
    {"value":"500+","label":"Clients Served"},
    {"value":"150+","label":"Expert Consultants"},
    {"value":"20+","label":"Years Experience"},
    {"value":"15","label":"Global Offices"}
  ]},
  {"type":"cta-banner","title":"Join Our Team","description":"We are looking for talented individuals to build a better digital future together","primaryCta":{"text":"View Careers","link":"/contact/careers"}}
]',
CURRENT_TIMESTAMP FROM pages WHERE slug_key = 'about/company';

-- Solutions Digital Transformation Page Content (English)
INSERT OR IGNORE INTO page_contents (page_id, lang_code, title, slug_localized, seo_title, seo_desc, content_json, updated_at)
SELECT id, 'en', 'Digital Transformation Solutions', 'digital-transformation', 'Digital Transformation Solutions | Cloud Migration, Process Automation', 'From cloud migration to process automation and data-driven decisions, we provide end-to-end digital transformation services.',
'[
  {"type":"page-hero","title":"Digital Transformation Solutions","subtitle":"From cloud migration to process automation and data-driven decisions, we provide end-to-end transformation services","breadcrumb":[{"label":"Home","link":"/"},{"label":"Solutions","link":"/solutions"},{"label":"Digital Transformation"}],"image":"/assets/images/hero-solutions.jpg"},
  {"type":"content-with-image","imagePosition":"right","title":"Are You Facing These Challenges?","items":["🔴 High maintenance costs for legacy systems that cannot support business innovation","🔴 Severe information silos between departments, making data integration difficult","🔴 Tedious manual processes limiting team productivity","🔴 Lack of digital talent and unclear transformation roadmap"],"image":"/assets/images/challenges-illustration.svg"},
  {"type":"timeline-steps","title":"Our Service Process","subtitle":"Systematic methodology ensuring successful project delivery","steps":[
    {"number":"01","title":"Discovery & Assessment","description":"Deep dive into your business goals, existing IT environment, and pain points","duration":"2-3 weeks"},
    {"number":"02","title":"Roadmap Planning","description":"Develop phased implementation plan with clear KPIs based on assessment results","duration":"2-4 weeks"},
    {"number":"03","title":"Implementation","description":"Agile development with iterative delivery, validation and adjustment at each phase"},
    {"number":"04","title":"Launch & Optimization","description":"Go-live support and continuous optimization based on data insights"}
  ]},
  {"type":"faq-accordion","title":"FAQ","items":[
    {"question":"How long does a digital transformation project typically take?","answer":"Timeline depends on project scope and complexity. Basic cloud migration projects typically take 3-6 months, while large-scale multi-system integration projects may require 12-18 months. We provide detailed timeline planning during the assessment phase."},
    {"question":"How do you ensure business continuity during transformation?","answer":"We use phased migration strategies with comprehensive rollback mechanisms. Critical systems are switched during off-peak hours with 24-hour monitoring by dedicated teams to ensure zero business disruption."},
    {"question":"What post-implementation support do you provide?","answer":"We offer multiple support tiers including standard business hours (8x5) and 24/7 options, covering system monitoring, issue resolution, performance tuning, and regular health check reports."}
  ]},
  {"type":"cta-banner","title":"Talk to Our Experts","description":"Fill out the form below and our solution consultants will contact you within 1 business day","primaryCta":{"text":"Get Started","link":"/contact/inquiry"}}
]',
CURRENT_TIMESTAMP FROM pages WHERE slug_key = 'solutions/digital-transformation';

