---
description: 添加新的翻譯和國際化
---

# 國際化流程

## 步驟

### 1. 添加翻譯 Key

編輯 JSON 文件:
- `client/public/i18n/en-US.json`
- `client/public/i18n/zh-TW.json`

```json
{
  "SECTION_COMPONENT_LABEL": "Translation text"
}
```

**命名規範**: `SECTION_COMPONENT_LABEL`
- 例如: `ADMIN_MENU_PAGES`, `PAGE_EDITOR_SAVE_BTN`

### 2. 模板中使用

```html
<!-- 使用 TranslatePipe -->
<h1>{{ 'PAGE_TITLE' | translate }}</h1>

<!-- 帶參數 -->
<p>{{ 'GREETING' | translate:{ name: userName } }}</p>
```

### 3. TypeScript 中使用

```typescript
import { I18nService } from '@core/services/i18n.service';

export class MyComponent {
  private i18n = inject(I18nService);
  
  showMessage() {
    const msg = this.i18n.t('SUCCESS_MESSAGE');
    alert(msg);
  }
}
```

### 4. 確認所有語言版本

確保所有語言文件都有對應的 key:

```bash
# 快速檢查 key 數量
cat client/public/i18n/en-US.json | grep -c ":"
cat client/public/i18n/zh-TW.json | grep -c ":"
```

### 5. 驗證

1. 切換語言檢查翻譯是否正確顯示
2. 檢查後台翻譯管理介面
