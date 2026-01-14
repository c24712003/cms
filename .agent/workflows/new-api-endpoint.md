---
description: 添加新的 API 端點
---

# 創建新的 API 端點

## 步驟

### 1. 創建路由文件

在 `server/src/routes/` 創建新文件:

```bash
touch server/src/routes/my-feature.ts
```

### 2. 路由基本結構

```typescript
import { Router, Request, Response } from 'express';
import { getDb } from '../db';

const router = Router();

// GET - 列表
router.get('/', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const items = await db.all('SELECT * FROM my_table');
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, error: '取得資料失敗' });
  }
});

// GET - 單筆
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const item = await db.get('SELECT * FROM my_table WHERE id = ?', req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, error: '資料不存在' });
    }
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, error: '取得資料失敗' });
  }
});

// POST - 創建
router.post('/', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const { field1, field2 } = req.body;
    const result = await db.run(
      'INSERT INTO my_table (field1, field2) VALUES (?, ?)',
      [field1, field2]
    );
    res.json({ success: true, data: { id: result.lastID } });
  } catch (error) {
    res.status(500).json({ success: false, error: '創建失敗' });
  }
});

// PUT - 更新
router.put('/:id', async (req: Request, res: Response) => {
  // 實作...
});

// DELETE - 刪除
router.delete('/:id', async (req: Request, res: Response) => {
  // 實作...
});

export default router;
```

### 3. 註冊路由

編輯 `server/src/index.ts`:

```typescript
import myFeatureRoutes from './routes/my-feature';

// 添加路由
app.use('/api/my-feature', myFeatureRoutes);

// 如需認證
app.use('/api/my-feature', authMiddleware, myFeatureRoutes);
```

### 4. 添加 Audit Log (可選)

```typescript
import { logAudit } from '../db/audit-log';

// 在寫入操作後
await logAudit(db, userId, 'my_feature', 'create', itemId, { ...details });
```

### 5. 驗證

```bash
# 測試 API
curl http://localhost:3000/api/my-feature
curl -X POST http://localhost:3000/api/my-feature -H "Content-Type: application/json" -d '{"field1":"value"}'
```
