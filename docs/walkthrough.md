# Walkthrough: Multilingual CMS Scaffold

> [!NOTE]
> This walkthrough documents the completed setup of the Multilingual CMS as per the approved Architecture and Implementation Plan.

## 1. Project Structure
The repository is organized into a monorepo-like structure:
- `/server`: Node.js backend handling API and database.
- `/client`: Angular v21 SSR frontend.

## 2. Core Features Implemented

### 2.1 Database Schema (SQLite)
Implemented in `server/src/db/schema.sql`.
- **Languages Table**: Stores supported locales.
- **Translations Table**: Key-Value store for UI strings.

### 2.2 Angular SSR & i18n
- **SSR Config**: `server.ts` handles the `Accept-Language` detection.
- **I18nService**: A Signal-based service (`client/src/app/core/services/i18n.service.ts`) manages the active language state.

### 3. Verification Results

#### 3.1 Server Health
- [x] Server starts on port 3000.
- [x] API endpoint `/api/languages` returns JSON list.
- [x] CRUD APIs for Languages, Translations, and Pages are active.
- [x] Sitemap available at `/sitemap.xml`.

#### 3.2 Frontend Rendering
- [x] Home page renders with correct `lang` attribute.
- [x] Changing language via Service updates the view.
- [x] **Admin Module** builds and lazy loads at `/admin`.
- [x] **Dynamic Pages** (`/:lang/:slug`) resolve content from DB.
- [x] **Contact Form** validates localized error messages.
- [x] SSR Build (`npm run build`) successful with `RenderMode.Server`.

## 4. Features & Usage

### Admin Dashboard (`/admin`)
- **Languages**: Add/Remove supported languages.
- **Translations**: Grid view to edit UI strings across all languages.
- **Pages**: Create pages and edit their SEO/JSON content.

### Public Site
- **Dynamic Routing**: `/:lang/:slug` loads content from the database.
- **Dynamic Menu**: Header loads links from `menus` table (API).
- **Fallback**: Redirects root `/` to `/:lang/home`.
- **Contact**: Available at `/:lang/contact`.

### Advanced Features (Phase 4)
- **Auth**: JWT-based Authentication, RBAC Guard, Interceptor. Admin is protected.
- **Media**: Image uploads via Multer. Grid view in Admin.
- **Navigation**: JSON-based Menu builder in Admin. Dynamic Public Header.

## 5. Next Steps
- Implement Drag & Drop for Menu Builder.
- Integrate Media Picker into Page Editor (Rich Text).


