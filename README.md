# 🚀 Multilingual CMS

一個現代化的多語言內容管理系統，採用 Angular 21 (SSR) + Node.js + SQLite 技術架構。

![Tech Stack](https://img.shields.io/badge/Angular-21-DD0031?style=flat-square&logo=angular)
![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=flat-square&logo=node.js)
![SQLite](https://img.shields.io/badge/SQLite-3-003B57?style=flat-square&logo=sqlite)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript)

---

## ✨ 功能特色

### 📝 內容管理
- **頁面編輯器** - 區塊式拖放編輯器，支援多種內容區塊類型
- **主題管理** - 創建和管理網站主題，支援主題與頁面關聯
- **媒體庫** - 上傳、管理和搜尋媒體檔案，支援 WebP 轉換
- **選單建構器** - 視覺化管理網站導航選單和社交連結

### 🌐 多語言支援
- **完整 i18n 系統** - 支援繁體中文、英文、日文、韓文等多語言
- **翻譯管理介面** - 集中管理所有 UI 翻譯字串
- **SEO 友善 URL** - `/:lang/:slug` 格式的本地化路由

### 🔍 SEO 優化
- **動態 Meta 標籤** - 自動生成 title、description、og tags
- **Hreflang 支援** - 正確的多語言頁面標註
- **Sitemap 自動生成** - 動態產生搜尋引擎友善的 sitemap.xml
- **Web Vitals 監控** - 追蹤核心網頁指標

### 🔐 使用者管理
- **JWT 驗證** - 安全的 API 認證機制
- **角色權限** - 使用者權限管理
- **審核日誌** - 追蹤系統操作記錄

---

## 🏗️ 專案架構

```
cms/
├── client/                 # Angular 21 前端應用 (SSR)
│   ├── src/
│   │   ├── app/
│   │   │   ├── admin/      # 管理後台模組
│   │   │   │   ├── dashboard/
│   │   │   │   ├── page-editor/
│   │   │   │   ├── theme-manager/
│   │   │   │   ├── media-manager/
│   │   │   │   ├── menu-builder/
│   │   │   │   ├── translation-editor/
│   │   │   │   └── user-management/
│   │   │   ├── core/       # 核心服務與工具
│   │   │   ├── features/   # 前台功能模組
│   │   │   └── shared/     # 共用元件
│   │   └── styles/
│   └── package.json
│
├── server/                 # Node.js Express 後端
│   ├── src/
│   │   ├── routes/         # API 路由
│   │   ├── db/             # 資料庫操作
│   │   ├── middleware/     # 中介軟體
│   │   ├── seeds/          # 資料庫種子檔
│   │   └── utils/          # 工具函式
│   ├── uploads/            # 上傳檔案目錄
│   └── package.json
│
├── docs/                   # 專案文件
└── Dockerfile              # Docker 部署設定
```

---

## 🚀 快速開始

### 環境需求

- **Node.js** >= 20.x
- **npm** >= 10.x

### 安裝步驟

1. **Clone 專案**
   ```bash
   git clone <repository-url>
   cd cms
   ```

2. **安裝後端依賴**
   ```bash
   cd server
   npm install
   ```

3. **安裝前端依賴**
   ```bash
   cd ../client
   npm install
   ```

4. **啟動開發伺服器**

   **啟動後端 (終端機 1)**
   ```bash
   cd server
   npm run dev
   ```
   後端運行於: `http://localhost:3000`

   **啟動前端 (終端機 2)**
   ```bash
   cd client
   npm run dev
   ```
   前端運行於: `http://localhost:4200`

5. **訪問應用**
   - 前台首頁: `http://localhost:4200/zh-tw`
   - 管理後台: `http://localhost:4200/admin`

---

## 📦 API 端點

| 方法 | 端點 | 說明 |
|------|------|------|
| `GET` | `/api/pages` | 取得頁面列表 |
| `GET` | `/api/pages/:id` | 取得單一頁面 |
| `POST` | `/api/pages` | 建立新頁面 |
| `PUT` | `/api/pages/:id` | 更新頁面 |
| `DELETE` | `/api/pages/:id` | 刪除頁面 |
| `GET` | `/api/languages` | 取得語言列表 |
| `GET` | `/api/translations` | 取得翻譯字串 |
| `GET` | `/api/menus` | 取得選單資料 |
| `POST` | `/api/media/upload` | 上傳媒體檔案 |
| `GET` | `/api/themes` | 取得主題列表 |
| `POST` | `/api/auth/login` | 使用者登入 |

---

## 🐳 Docker 部署

```bash
# 建置 Docker Image
docker build -t cms-app .

# 運行容器
docker run -d -p 3000:3000 -v cms-data:/app/server cms-app
```

---

## 🛠️ 技術棧

### 前端
- **Angular 21** - 最新版本的 Angular 框架
- **Angular SSR** - 伺服器端渲染，優化 SEO 和首屏載入
- **Angular Signals** - 響應式狀態管理
- **Tailwind CSS 3** - 實用優先的 CSS 框架
- **Angular CDK** - 拖放和佈局元件

### 後端
- **Node.js + Express** - 高效能的 API 伺服器
- **SQLite** - 輕量級關聯式資料庫
- **JWT** - JSON Web Token 認證
- **Sharp** - 圖片處理和 WebP 轉換
- **Multer** - 檔案上傳處理

---

## 📁 資料庫結構

主要資料表：

| 資料表 | 說明 |
|--------|------|
| `languages` | 系統支援的語言設定 |
| `pages` | 頁面基本資訊 |
| `page_contents` | 頁面多語言內容 |
| `translation_keys` | 翻譯鍵值定義 |
| `translation_values` | 各語言翻譯值 |
| `menus` | 選單項目 |
| `media_files` | 媒體檔案記錄 |
| `themes` | 主題設定 |
| `users` | 使用者帳號 |
| `audit_logs` | 操作審核日誌 |

---

## 📚 開發指南

### 編碼規範

參考 [.agent/rules.md](.agent/rules.md) 了解專案編碼規範：

- **TypeScript** - 使用嚴格類型定義
- **Angular** - 採用 Standalone Components 和 Signals
- **命名規範** - PascalCase (類別)、camelCase (函數/變數)、kebab-case (檔案)

### 新增 API 端點

參考工作流程: [.agent/workflows/new-api-endpoint.md](.agent/workflows/new-api-endpoint.md)

### 新增內容區塊

參考工作流程: [.agent/workflows/new-content-block.md](.agent/workflows/new-content-block.md)

### 新增翻譯

參考工作流程: [.agent/workflows/i18n-flow.md](.agent/workflows/i18n-flow.md)

---

## 📄 授權

MIT License

---

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！
