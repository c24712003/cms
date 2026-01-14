---
description: 程式碼審查
---

# 程式碼審查流程

## 審查重點

### 1. Angular 組件
- [ ] 使用 Standalone Components
- [ ] 使用 Signals 而非 BehaviorSubject (除非必要)
- [ ] 使用新的控制流語法 (@if, @for)
- [ ] 使用Signal-based (input、output...)
- [ ] 正確的依賴注入方式 (inject())
- [ ] 有適當的錯誤處理

### 2. API 路由
- [ ] 正確的 HTTP 方法和狀態碼
- [ ] 一致的錯誤回應格式
- [ ] 必要的認證中間件
- [ ] SQL 注入防護 (使用參數化查詢)

### 3. 國際化
- [ ] 所有用戶可見文字使用 i18n key
- [ ] 翻譯 key 遵循命名規範
- [ ] 所有語言文件都有對應翻譯

### 4. 樣式
- [ ] 使用 Tailwind CSS 類別
- [ ] 支援深色模式 (`dark:`)
- [ ] 響應式設計 (`sm:`, `md:`, `lg:`)

### 5. 安全性
- [ ] 敏感資訊不硬編碼
- [ ] API 有適當的權限檢查
- [ ] 用戶輸入有驗證

## 命令

```bash
# 運行 lint
cd client && npm run lint
cd server && npm run lint

# 運行測試
cd client && npm run test
```