# 技術棧參考

## 前端

### Angular 21
- **版本**: 21.0.0
- **關鍵特性**: Signals, Standalone Components, 新控制流語法
- **SSR**: 使用 `@angular/ssr`

### Tailwind CSS
- **版本**: 3.4.1
- **配置**: `client/tailwind.config.js`

### RxJS
- **版本**: 7.8.0
- **使用場景**: HTTP 請求、事件流

---

## 後端

### Node.js + Express
- **Express 版本**: 4.19.0
- **TypeScript**: 5.4.0
- **運行**: `ts-node`

### SQLite
- **版本**: 5.1.7 (sqlite3)
- **資料庫文件**: `server/cms.db`

---

## 常用依賴

| 前端 | 版本 | 用途 |
|------|------|------|
| @angular/cdk | 21.0.6 | UI 組件工具包 |
| web-vitals | 5.1.0 | 效能監控 |

| 後端 | 版本 | 用途 |
|------|------|------|
| bcrypt | 6.0.0 | 密碼加密 |
| jsonwebtoken | 9.0.3 | JWT 認證 |
| multer | 2.0.2 | 文件上傳 |
| sharp | 0.34.5 | 圖片處理 |

---

## 開發命令

```bash
# 前端
cd client
npm run dev      # 開發伺服器 (port 4200)
npm run build    # 生產構建
npm run test     # 運行測試

# 後端
cd server
npm run dev      # 開發伺服器 (port 3000)
npm run build    # 編譯 TypeScript
```
