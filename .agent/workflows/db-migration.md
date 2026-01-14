---
description: 資料庫 Schema 變更和遷移
---

# 資料庫遷移流程

## 步驟

### 1. 創建遷移腳本

在 `server/src/migrations/` 創建新文件:

```bash
# 命名: YYYYMMDD_description.ts
touch server/src/migrations/20260114_add_my_table.ts
```

```typescript
import { Database } from 'sqlite';

export async function up(db: Database): Promise<void> {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS my_table (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE INDEX IF NOT EXISTS idx_my_table_name ON my_table(name);
  `);
}

export async function down(db: Database): Promise<void> {
  await db.exec('DROP TABLE IF EXISTS my_table');
}
```

### 2. 執行遷移

```bash
cd server
npm run migrate  # 或手動執行
```

### 3. 更新 Schema 文檔

編輯 `.agent/context/db-schema.md`:

```markdown
### my_table
| 欄位 | 類型 | 說明 |
|------|------|------|
| id | INTEGER | 主鍵 |
| name | TEXT | 名稱 |
| created_at | DATETIME | 創建時間 |
```

### 4. 驗證

```bash
# 檢查表是否創建
sqlite3 server/cms.db ".schema my_table"

# 測試基本操作
sqlite3 server/cms.db "INSERT INTO my_table (name) VALUES ('test')"
sqlite3 server/cms.db "SELECT * FROM my_table"
```

## 注意事項

> [!WARNING]
> **生產環境遷移**: 務必先備份資料庫再執行遷移

```bash
cp server/cms.db server/cms.db.backup
```
