# Implementation Plan: Multilingual CMS Scaffold

## User Review Required
> [!IMPORTANT]
> This plan focuses on setting up the architecture and the **core i18n mechanism** as requested. It does NOT include building the full Admin UI or all database CRUD operations, which are extensive tasks.

## Proposed Changes

### 1. Project Initialization
- Initialize Git repository.
- Create directory structure:
  - `/server`: Node.js backend.
  - `/client`: Angular frontend.

### 2. Backend Scaffold (Node.js + SQLite)
- **Files**:
  - `server/package.json`: Dependencies (express, sqlite3, sequelize/typeorm).
  - `server/src/db/schema.sql`: Implement the schema defined in `architecture.md`.
  - `server/src/index.ts`: Basic Express server with API stub for translations.

### 3. Frontend Scaffold (Angular v21 SSR)
- **Commands**:
  - `ng new client --ssr` (using Angular CLI).
- **Modifications**:
  - Enable `provideClientHydration` with `withEventReplay`.
  - Configure `app.config.ts` for SSR i18n injection.

### 4. Code Example Implementation (Core Requirement)
- **File**: `client/src/app/core/services/i18n.service.ts`
- **Implementation**:
  - `currentLang = signal<string>('en')`.
  - Logic to handle URL changes.
  - Integration with `TransferState` for initial data.

## Verification Plan

### Automated Tests
- **Backend**: Run `npm start` in `server` and check `http://localhost:3000/api/health`.
- **Frontend**: Run `npm run watch` (or `dev`) and check `http://localhost:4200`.

### Manual Verification
1. **SSG/SSR Check**:
   - `curl http://localhost:4000/en/home` -> Check if `<html lang="en">` exists.
   - `curl http://localhost:4000/zh-tw/home` -> Check if `<html lang="zh-TW">` exists.
2. **Service Check**:
   - Verify that changing language in the UI (if a button is added) updates the URL or fetches new data.

# Phase 2: Implementation Plan (Admin & APIs)

## 1. Backend API Implementation (`server/src/index.ts` & `routes/`)
Refactor `server/src/index.ts` to use structured routes.

### endpoints
- **Languages**
  - `POST /api/languages`: Add new language.
  - `PUT /api/languages/:code`: Update (enable/disable, default).
  - `DELETE /api/languages/:code`: Remove language.
- **Translations**
  - `GET /api/translations/keys`: List all keys.
  - `POST /api/translations/keys`: Create key.
  - `PUT /api/translations`: Bulk update values `{ "key": "val", "lang": "en" }`.
- **Page Content**
  - `GET /api/pages`: List pages.
  - `GET /api/pages/:slug`: Get page details.
  - `POST /api/pages/:id/content`: Update content for specific language.

## 2. Admin Frontend (`client/src/app/admin`)
- **Structure**: Lazy loaded route `/admin`.
- **Components**:
  - `AdminLayout`: Sidebar, Header.
  - `Dashboard`: Stats.
  - `LanguageManager`: Table to edit languages.
  - `TranslationEditor`: DataGrid for editing translations.
  - `PageEditor`: Form to edit Page SEO and Content JSON.

## 3. Security (Basic)
- Simple hardcoded API Key middleware for now (User didn't specify Auth provider, will use a simple "Admin-Secret" header for MVP).

# Phase 3: Client Features Implementation

## 1. Dynamic Page Rendering (`AppPage`)
- **Route**: `/:lang/:slug`
- **Logic**:
    - Guard/Resolver checks URL language and slug.
    - Fetches `PageContents` from Backend.
    - Updates `Title`, `Meta` tags.
    - Renders `content_json` using a `BlockRendererComponent`.

## 2. Contact Form with i18n
- **Component**: `ContactBlockComponent`.
- **Validation**: Use Angular `Validators` with error messages coming from `I18nService.translate('ERR_REQUIRED')`.

## 3. SEO
- **Sitemap**: `server/src/routes/sitemap.ts` generates XML from DB.
- **Robots.txt**: Serve static file.

# Phase 4: Authentication & Tools

## 1. Authentication System
- **Backend**:
  - `users` table: `id`, `username`, `password_hash`, `role`.
  - `POST /api/auth/login`: Returns JWT.
  - Middleware `authenticateToken`: Verifies JWT from `Authorization` header.
- **Frontend**:
  - `LoginComponent`: Form.
  - `AuthService`: Manage Token & User state (Signal).
  - `AuthGuard`: Protect `/admin/*`.
  - `Interceptor`: Attach token to API requests.

## 2. Media Manager
- **Backend**:
  - `multer` for file uploads to `server/uploads/`.
  - `POST /api/media`: Upload file.
  - `GET /api/media`: List files.
- **Frontend**:
  - `MediaPickerComponent`: Select image for Page Content.

# Phase 5: UX Polish & Deployment

## 1. Visual Page Editor
- **Component**: `PageEditorComponent`
- **Change**: Remove JSON textarea. Replace with `BlockList`.
- **Structure**:
  ```typescript
  interface Block {
    type: 'text' | 'image' | 'html';
    content: string; // Text or HTML or Image URL
  }
  ```
- **UI**:
  - Add Block Dropdown.
  - Text Block: Textarea.
  - Image Block: Button to open `MediaPickerModal`.

## 2. Visual Menu Builder
- **Component**: `MenuBuilderComponent`
- **Change**: Remove JSON textarea. Use `*ngFor` table.
- **UI**:
  - Inputs for `Label` and `Link`.
  - Add/Delete buttons.
  - Up/Down buttons for ordering.

## 3. Deployment
- **Dockerfile**:
  - Stage 1: Build Client (SSR).
  - Stage 2: Build Server (TS).
  - Stage 3: Runtime Config (Node.js).




