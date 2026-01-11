
-- Insert Keys
INSERT OR IGNORE INTO translation_keys (key, namespace) VALUES 
('EDITOR_PAGE_TITLE', 'editor'),
('EDITOR_BETA_BADGE', 'editor'),
('EDITOR_SAVE_CHANGES', 'editor'),
('EDITOR_ADD_HERO', 'editor'),
('EDITOR_ADD_FEATURES', 'editor'),
('EDITOR_DRAG_HINT', 'editor'),
('EDITOR_PROPERTIES_PANEL', 'editor'),
('EDITOR_SELECT_BLOCK_HINT', 'editor'),
('EDITOR_NO_SELECTION', 'editor');

-- EN
INSERT INTO translation_values (trans_key, lang_code, value) VALUES 
('EDITOR_PAGE_TITLE', 'en', 'Page Editor'),
('EDITOR_BETA_BADGE', 'en', 'Beta'),
('EDITOR_SAVE_CHANGES', 'en', 'Save Changes'),
('EDITOR_ADD_HERO', 'en', '+ Hero'),
('EDITOR_ADD_FEATURES', 'en', '+ Features'),
('EDITOR_DRAG_HINT', 'en', 'Drag blocks here or add from toolbar'),
('EDITOR_PROPERTIES_PANEL', 'en', 'Properties'),
('EDITOR_SELECT_BLOCK_HINT', 'en', 'Select a block to edit properties'),
('EDITOR_NO_SELECTION', 'en', 'No block selected')
ON CONFLICT(trans_key, lang_code) DO UPDATE SET value = excluded.value;

-- ZH-TW
INSERT INTO translation_values (trans_key, lang_code, value) VALUES 
('EDITOR_PAGE_TITLE', 'zh-TW', '頁面編輯器'),
('EDITOR_BETA_BADGE', 'zh-TW', '測試版'),
('EDITOR_SAVE_CHANGES', 'zh-TW', '儲存變更'),
('EDITOR_ADD_HERO', 'zh-TW', '+ 主視覺'),
('EDITOR_ADD_FEATURES', 'zh-TW', '+ 特色區塊'),
('EDITOR_DRAG_HINT', 'zh-TW', '拖曳區塊到此處或從工具列新增'),
('EDITOR_PROPERTIES_PANEL', 'zh-TW', '屬性'),
('EDITOR_SELECT_BLOCK_HINT', 'zh-TW', '選擇區塊以編輯屬性'),
('EDITOR_NO_SELECTION', 'zh-TW', '未選擇區塊')
ON CONFLICT(trans_key, lang_code) DO UPDATE SET value = excluded.value;

-- JA
INSERT INTO translation_values (trans_key, lang_code, value) VALUES 
('EDITOR_PAGE_TITLE', 'ja', 'ページエディタ'),
('EDITOR_BETA_BADGE', 'ja', 'ベータ'),
('EDITOR_SAVE_CHANGES', 'ja', '変更を保存'),
('EDITOR_ADD_HERO', 'ja', '+ ヒーロー'),
('EDITOR_ADD_FEATURES', 'ja', '+ 機能'),
('EDITOR_DRAG_HINT', 'ja', 'ブロックをここにドラッグするか、ツールバーから追加してください'),
('EDITOR_PROPERTIES_PANEL', 'ja', 'プロパティ'),
('EDITOR_SELECT_BLOCK_HINT', 'ja', 'プロパティを編集するにはブロックを選択してください'),
('EDITOR_NO_SELECTION', 'ja', 'ブロックが選択されていません')
ON CONFLICT(trans_key, lang_code) DO UPDATE SET value = excluded.value;

-- KO
INSERT INTO translation_values (trans_key, lang_code, value) VALUES 
('EDITOR_PAGE_TITLE', 'ko', '페이지 에디터'),
('EDITOR_BETA_BADGE', 'ko', '베타'),
('EDITOR_SAVE_CHANGES', 'ko', '변경 사항 저장'),
('EDITOR_ADD_HERO', 'ko', '+ 히어로'),
('EDITOR_ADD_FEATURES', 'ko', '+ 기능'),
('EDITOR_DRAG_HINT', 'ko', '블록을 여기로 드래그하거나 툴바에서 추가하세요'),
('EDITOR_PROPERTIES_PANEL', 'ko', '속성'),
('EDITOR_SELECT_BLOCK_HINT', 'ko', '속성을 편집하려면 블록을 선택하세요'),
('EDITOR_NO_SELECTION', 'ko', '선택된 블록 없음')
ON CONFLICT(trans_key, lang_code) DO UPDATE SET value = excluded.value;
