# Content Block 前端渲染 - 實作文件

> 日期：2026-01-09

## 概述

為 CMS 系統實作前端 Content Block 渲染元件，支援企業官網的多種區塊類型動態渲染。

---

## 新增元件 (10 個)

目錄：`client/src/app/features/content-blocks/`

| 元件 | 用途 |
|------|------|
| `hero-carousel.component.ts` | 主視覺輪播（含 CTA） |
| `feature-grid.component.ts` | 核心價值 3 欄網格 |
| `card-carousel.component.ts` | 解決方案卡片 |
| `stats-counter.component.ts` | 數據成果展示 |
| `cta-banner.component.ts` | 行動呼籲橫幅 |
| `case-study-showcase.component.ts` | 成功案例展示 |
| `page-hero.component.ts` | 頁面主視覺（含麵包屑） |
| `faq-accordion.component.ts` | FAQ 手風琴 |
| `timeline-steps.component.ts` | 時間軸步驟 |
| `block-renderer.component.ts` | 區塊分發器 |

---

## 修改檔案

| 檔案 | 變更 |
|------|------|
| `dynamic-page.component.ts` | 整合 BlockRenderer，自動偵測進階區塊類型 |
| `pages.ts` (後端) | 修正 API 回傳時解析 `content_json` 為 JSON 陣列 |

---

## 支援的區塊類型

```
hero-carousel, feature-grid, card-carousel, stats-counter,
cta-banner, case-study-showcase, page-hero, faq-accordion,
timeline-steps, tabbed-content, content-with-image, case-cards,
contact-form-cta, text, html, image
```

---

## 測試頁面

- 企業首頁: `/zh-TW/corporate-home`
- 解決方案: `/zh-TW/solutions/digital-transformation`
