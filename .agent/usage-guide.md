# AI 助手使用指南

如何讓 AI 助手參考 `.agent/` 中的配置文件。

---

## 方法 1: Slash Commands (推薦)

直接使用斜線命令:

| 命令 | 說明 |
|------|------|
| `/new-content-block` | 創建新的 Content Block |
| `/new-api-endpoint` | 添加新的 API 端點 |
| `/i18n-flow` | 國際化流程 |
| `/db-migration` | 資料庫遷移 |
| `/code-review` | 程式碼審查 |

**範例**:
```
/new-content-block 幫我創建一個 testimonial-carousel 的內容區塊
```

---

## 方法 2: 明確指定文件

```
請按照 .agent/rules.md 的規範幫我創建一個新組件

參考 .agent/workflows/new-api-endpoint.md 幫我添加一個 comments API

根據 .agent/skills/angular-patterns 的最佳實踐重構這個組件
```

---

## 方法 3: 一般請求 (自動參考)

直接描述需求,AI 會自動參考相關文件:

```
幫我創建一個新的 pricing-table content block
→ 自動參考 workflows/new-content-block.md, skills/content-blocks/SKILL.md

這個組件需要重構
→ 自動參考 rules.md, skills/angular-patterns/SKILL.md
```

---

## 最佳 Prompt 範例

| 需求 | Prompt |
|------|--------|
| 新增 Component | `幫我創建一個 FAQ accordion content block` |
| 新增 API | `/new-api-endpoint 創建 comments API` |
| 國際化 | `/i18n-flow 添加頁面編輯器的中文翻譯` |
| 程式碼審查 | `/code-review 檢查這個 PR` |
| 遷移資料庫 | `/db-migration 添加 comments 表` |

---

## 💡 Pro Tip

確保參考特定文件:

```
請先閱讀 .agent/skills/angular-patterns/SKILL.md,
然後幫我把這個組件改成使用 Signal-based Input/Output
```
