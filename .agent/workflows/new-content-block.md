---
description: 創建新的 Content Block 組件
---

# 創建新的 Content Block

## 步驟

### 1. 創建組件文件

在 `client/src/app/features/content-blocks/` 創建新組件:

```bash
# 命名規範: <block-name>.component.ts
touch client/src/app/features/content-blocks/my-block.component.ts
```

### 2. 組件基本結構

```typescript
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface MyBlockInput {
  headline: string;
  description: string;
  // 定義所有輸入屬性
}

@Component({
  selector: 'cms-my-block',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="my-block">
      <h2>{{ headline }}</h2>
      <p>{{ description }}</p>
    </section>
  `,
  styles: [`
    .my-block { /* 樣式 */ }
  `]
})
export class MyBlockComponent {
  @Input() headline = '';
  @Input() description = '';
  
  // Schema 定義 (用於編輯器)
  static schema = {
    type: 'my-block',
    label: 'My Block',
    properties: {
      headline: { type: 'string', label: 'Headline', default: 'Default Headline' },
      description: { type: 'text', label: 'Description', default: '' }
    }
  };
}
```

### 3. 註冊到 BlockRegistry

編輯 `client/src/app/features/content-blocks/block-registry.ts`:

```typescript
import { MyBlockComponent } from './my-block.component';

// 添加到 BLOCK_COMPONENTS
export const BLOCK_COMPONENTS = {
  // ... 現有組件
  'my-block': MyBlockComponent,
};
```

### 4. 添加 i18n 翻譯

編輯 `client/public/i18n/en-US.json` 和 `zh-TW.json`:

```json
{
  "BLOCKS_MY_BLOCK_LABEL": "My Block",
  "BLOCKS_MY_BLOCK_HEADLINE": "Headline",
  "BLOCKS_MY_BLOCK_DESCRIPTION": "Description"
}
```

### 5. 驗證

1. 啟動開發伺服器
2. 在頁面編輯器中添加新區塊
3. 驗證屬性編輯和預覽功能
