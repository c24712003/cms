# API 參考

基礎 URL: `http://localhost:3000/api`

---

## 認證 API

### POST /auth/login
登入並取得 JWT token

**請求**:
```json
{ "username": "admin", "password": "admin123" }
```

**回應**:
```json
{ "success": true, "data": { "token": "jwt...", "user": {...} } }
```

---

## 頁面 API

### GET /pages
取得所有頁面

### GET /pages/:id
取得單一頁面

### POST /pages
創建頁面

### PUT /pages/:id
更新頁面

### DELETE /pages/:id
刪除頁面

---

## 媒體 API

### GET /media
取得媒體列表

### POST /media/upload
上傳文件 (multipart/form-data)

### DELETE /media/:id
刪除媒體

---

## 翻譯 API

### GET /translations/:lang
取得特定語言的翻譯

### PUT /translations
更新翻譯

---

## 其他 API

| 端點 | 說明 |
|------|------|
| `/languages` | 語言管理 |
| `/themes` | 主題管理 |
| `/menus` | 選單管理 |
| `/templates` | 模板管理 |
| `/users` | 用戶管理 |
| `/search` | 全文搜尋 |
| `/audit-logs` | 審計日誌 |
| `/health` | 健康檢查 |
| `/sitemap.xml` | Sitemap |
| `/robots.txt` | Robots |
