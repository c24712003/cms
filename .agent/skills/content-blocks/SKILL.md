---
name: Content Block 開發
description: 創建和維護 CMS Content Block 組件
---

# Content Block 開發技能

## 組件結構

每個 Content Block 包含:
1. **組件類別** - 渲染和邏輯
2. **Schema** - 屬性定義和預設值
3. **翻譯** - i18n 標籤

---

## 標準模板

```typescript
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'cms-block-name',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="block-name" [class]="styles?.background?.color">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold">{{ headline }}</h2>
        <!-- 內容 -->
      </div>
    </section>
  `
})
export class BlockNameComponent {
  @Input() headline = '';
  @Input() items: any[] = [];
  @Input() styles: any = {};

  static schema = {
    type: 'block-name',
    label: 'BLOCKS_BLOCK_NAME_LABEL',
    properties: {
      headline: {
        type: 'string',
        label: 'BLOCKS_HEADLINE',
        default: 'Headline'
      },
      items: {
        type: 'array',
        label: 'BLOCKS_ITEMS',
        itemSchema: {
          title: { type: 'string', default: '' },
          description: { type: 'text', default: '' }
        }
      }
    },
    styles: {
      background: {
        color: { type: 'select', options: ['bg-white', 'bg-gray-100', 'bg-primary'] }
      }
    }
  };
}
```

---

## 現有 Content Blocks

位置: `client/src/app/features/content-blocks/`

| 組件 | 說明 |
|------|------|
| hero-section | 首頁橫幅 |
| feature-grid | 功能網格 |
| stats-counter | 統計數字 |
| testimonials | 客戶評價 |
| case-study-showcase | 案例展示 |
| contact-form | 聯絡表單 |

---

## 屬性類型

| type | 說明 | 編輯器 |
|------|------|--------|
| string | 短文字 | text input |
| text | 長文字 | textarea |
| number | 數字 | number input |
| boolean | 布林 | toggle |
| select | 選擇 | dropdown |
| array | 陣列 | array editor |
| image | 圖片 | media picker |
