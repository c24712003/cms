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
