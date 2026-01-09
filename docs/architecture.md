# System Architecture: Multilingual CMS
**Tech Stack**: Angular v21 (SSR), Node.js, SQLite

## 1. Database Schema Design (SQLite)
We will use a relational design with JSON capabilities for translation values to ensure flexibility and performance.

### 1.1 ER Diagram Concept
- **Languages**: configurations for supported locales.
- **Translations**: UI strings (Global dictionary).
- **Pages**: Structure of the website.
- **PageContents**: Content specific to a language for a page.

### 1.2 Tables Definition

#### `languages`
Stores available system languages.
```sql
CREATE TABLE languages (
    code TEXT PRIMARY KEY,      -- e.g., 'en', 'zh-TW', 'jp'
    name TEXT NOT NULL,         -- e.g., 'English', '繁體中文'
    is_default BOOLEAN DEFAULT 0,
    direction TEXT DEFAULT 'ltr', -- 'ltr' or 'rtl'
    enabled BOOLEAN DEFAULT 1
);
```

#### `translations` (UI Strings)
Stores key-value pairs for interface text (buttons, labels).
*Strategy: One-to-Many using a separate table for cleaner SQL queries, or JSON for easier aggregation. We use JSONB (Text in SQLite) as suggested for flexibility.*

```sql
CREATE TABLE translation_keys (
    key TEXT PRIMARY KEY,       -- e.g., 'NAV_HOME', 'BTN_SUBMIT'
    namespace TEXT DEFAULT 'common', -- Grouping (admin, frontend, auth)
    description TEXT            -- Context for translators
);

CREATE TABLE translation_values (
    trans_key TEXT,
    lang_code TEXT,
    value TEXT,
    FOREIGN KEY(trans_key) REFERENCES translation_keys(key),
    FOREIGN KEY(lang_code) REFERENCES languages(code),
    PRIMARY KEY(trans_key, lang_code)
);
```
*Alternative (JSON structure requested)*:
```sql
CREATE TABLE translations_store (
    key TEXT PRIMARY KEY,
    values_json TEXT -- JSON: {"en": "Home", "zh-TW": "首頁"}
);
```
*Decision*: We will use the **Relational approach (`translation_values`)** for better concurrent editing and integrity, but the API will return a JSON object to the frontend.

#### `pages` & `page_contents`
Manage dynamic page content.

```sql
CREATE TABLE pages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug_key TEXT UNIQUE,       -- e.g., 'home', 'contact' (canonical slug identifier)
    template TEXT NOT NULL      -- e.g., 'home-template', 'generic-page'
);

CREATE TABLE page_contents (
    page_id INTEGER,
    lang_code TEXT,
    title TEXT,
    slug_localized TEXT,        -- e.g., 'home' (en), 'shou-ye' (zh-TW) - Optional: for localized URLs
    seo_title TEXT,
    seo_desc TEXT,
    content_json TEXT,          -- Dynamic blocks structure
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(page_id) REFERENCES pages(id),
    FOREIGN KEY(lang_code) REFERENCES languages(code),
    PRIMARY KEY(page_id, lang_code)
);
```

---

## 2. Angular v21 SSR i18n Strategy

### 2.1 Routing & Language Detection
Everything starts from the URL to ensure SEO Friendliness (No Hash, No Cookie-only state for initial load).

- **URL Pattern**: `domain.com/:lang/:slug`
    - e.g., `/en/home`, `/zh-tw/contact`
- **Root Redirect**: If user hits `/`, Server Middleware (Node.js) detects `Accept-Language` header or `cms-lang` cookie and 302 Redirects to the appropriate `/:lang/` prefix.

### 2.2 Server-Side Logic (Node.js/Express Middleware)
1. **Interceptor**: Matches request path `^/([a-z]{2}(-[a-z]{2})?)/.*`.
2. **Extraction**: extracts `lang` (e.g., `zh-tw`).
3. **Validation**: Checks against `languages` DB (cached). If invalid -> 404 or default lang.
4. **Injection**: Passes the `lang` to the Angular App via `CommonEngine`'s `providers`.
   ```typescript
   commonEngine.render({
       bootstrap: AppServerModule,
       providers: [
           { provide: LOCALE_ID, useValue: lang },
           { provide: 'SERVER_REQUEST_URL', useValue: req.url }
       ],
       url: req.url,
       // ...
   });
   ```

### 2.3 Client Hydration & LCP Optimization
To avoid "Flash of Unstyled Content" or "Flash of Wrong Language":
1. **TransferState**: The server fetches the global `translations` for that language + the specific `page_contents` and embeds them into `TransferState`.
2. **Client Init**: The Angular Service reads from `TransferState` immediately. No HTTP request is made for translations during hydration. This dramatically improves LCP.

### 2.4 Dynamic Language Switching Service (Signal Based)
A simpler service that allows hot-swapping languages (fetching new data) without full reload if desired, though standard practice for SEO sites is full navigation (or soft-nav updating the URL).

```typescript
@Injectable({ providedIn: 'root' })
export class I18nService {
    currentLang = signal<string>('en');
    translations = signal<Record<string, string>>({});

    // Changes URL and loads new data
    setLanguage(lang: string) {
        // Logic to navigate to new URL prefix
    }
}
```

---

## 3. SEO Specifications

### 3.1 Meta Tags & Attributes
The `AppPage` component will update `Meta` service based on `page_contents`.
- `<html lang="zh-TW">`: Updated by Server based on `LOCALE_ID`.
- `<title>`: `page_contents.seo_title`.
- `<meta name="description">`: `page_contents.seo_desc`.

### 3.2 Hreflang
Critical for Google to understand regional versions.
For a page with ID=1 (Home), if we have `en`, `zh-TW`, `jp`:

```html
<link rel="alternate" hreflang="en" href="https://site.com/en/home" />
<link rel="alternate" hreflang="zh-Hant" href="https://site.com/zh-tw/home" />
<link rel="alternate" hreflang="ja" href="https://site.com/jp/home" />
<link rel="alternate" hreflang="x-default" href="https://site.com/en/home" />
```
*Implementation*: A `SeoService` collects all active language versions of the current page and injects these links in the `<head>`.

### 3.3 Sitemap.xml
Generated dynamically by the backend API at `/sitemap.xml`.
Iterates all `pages` and all `enabled languages` to generate entries.

---

## 4. Admin Dashboard (Brief)
- **Tech**: Same Angular codebase (Lazy loaded module) or separate app.
- **Features**:
    - **Language Editor**: CRUD for `languages` table.
    - **Translation Manager**: Grid view to edit `translation_values` (Key | EN | ZHTW | JP).
    - **Page Editor**: WYSIWYG or Block editor storing result in `page_contents.content_json`.

