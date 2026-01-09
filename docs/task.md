# Task List: Multilingual CMS (Angular v21 + Node.js)

- [x] Design System Architecture `architecture.md` <!-- id: 0 -->
    - [x] Define Database Schema (SQLite: Languages, Translations, PageContents) <!-- id: 1 -->
    - [x] Design SSR i18n Strategy (LCP optimized) <!-- id: 2 -->
    - [x] Define SEO Specifications (Sitemap, Meta Tags) <!-- id: 3 -->
- [x] Create Implementation Plan `implementation_plan.md` <!-- id: 4 -->
- [/] Initialize Project Repository <!-- id: 5 -->
    - [/] Git Init & Remote Setup <!-- id: 6 -->
    - [x] Scaffold Node.js Backend (Simple structure) <!-- id: 7 -->
    - [x] Scaffold Angular v21 Frontend <!-- id: 8 -->
- [/] Implement Proof of Concept Code <!-- id: 9 -->
    - [x] Create Signal-based Dynamic Language Switching Service <!-- id: 10 -->
- [x] Finalize Documentation & Push <!-- id: 11 -->
    - [x] Update `walkthrough.md` <!-- id: 12 -->
    - [x] Push to GitHub <!-- id: 13 -->

# Phase 2: Admin Dashboard & Content API (Next)
- [x] Implement Backend CRUD APIs <!-- id: 14 -->
    - [x] Language Management API (Create/Update/Delete) <!-- id: 15 -->
    - [x] Translation Key-Value API <!-- id: 16 -->
    - [x] Page Content API (JSONB handling) <!-- id: 17 -->
- [x] Implement Admin Frontend (Lazy Loaded Module) <!-- id: 18 -->
    - [x] Auth & RBAC Guard <!-- id: 19 -->
    - [x] Language Editor UI <!-- id: 20 -->
    - [x] Translation Editor UI (Grid View) <!-- id: 21 -->
    - [x] Page Content Editor (Block/Text) <!-- id: 22 -->

# Phase 3: Client Features & Enhancements
- [x] Implement Dynamic Page Rendering (Frontend) <!-- id: 23 -->
    - [x] Resolve Page Content from API based on Route <!-- id: 24 -->
- [x] Contact Form with i18n Validation <!-- id: 25 -->
- [x] SEO Enhancements (Sitemap Generator, Robots.txt) <!-- id: 26 -->

# Phase 4: Security & Advanced Tools (The "Missing" Parts)
- [x] Authentication System <!-- id: 27 -->
    - [x] Backend: Users Table & JWT Auth API (Login/Me) <!-- id: 28 -->
    - [x] Frontend: Login Page & AuthGuard <!-- id: 29 -->
    - [x] RBAC Middleware (Protect Admin Routes) <!-- id: 30 -->
- [x] Media/File Manager <!-- id: 31 -->
    - [x] Backend: File Upload API (Multer) <!-- id: 32 -->
    - [x] Frontend: Media Library UI (Grid selection) <!-- id: 33 -->
- [x] Navigation Manager <!-- id: 34 -->
    - [x] DB: Menus Table (JSON structure) <!-- id: 35 -->
    - [x] Admin: Menu Builder UI <!-- id: 36 -->
    - [x] Public: Dynamic Header Component <!-- id: 37 -->

# Phase 5: UX Polish & Deployment (Finalizing)
- [x] Visual Page Editor (Blocks) <!-- id: 38 -->
    - [x] Replace JSON Area with Block List UI <!-- id: 39 -->
    - [x] Integrate Media Picker for Images <!-- id: 40 -->
- [x] Visual Menu Builder <!-- id: 41 -->
    - [x] Replace JSON Area with Item List UI <!-- id: 42 -->
- [ ] Deployment Configuration <!-- id: 43 -->
    - [ ] Create Dockerfile <!-- id: 44 -->
