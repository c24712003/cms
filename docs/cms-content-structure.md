# 現代企業官網 - CMS 內容結構設計規劃

> **目標**：提升品牌形象並引導潛在客戶進行商務諮詢 (Lead Generation)  
> **風格**：專業、簡約、資訊透明

---

## 一、網站導覽選單架構 (Navigation Menu)

### 主選單 (Primary Navigation)

```json
{
  "code": "corporate-main",
  "items": [
    {
      "label": "首頁",
      "labelKey": "NAV_HOME",
      "link": "/",
      "children": []
    },
    {
      "label": "關於我們",
      "labelKey": "NAV_ABOUT",
      "link": "/about",
      "children": [
        { "label": "公司簡介", "link": "/about/company" },
        { "label": "經營理念", "link": "/about/philosophy" },
        { "label": "領導團隊", "link": "/about/leadership" },
        { "label": "里程碑", "link": "/about/milestones" }
      ]
    },
    {
      "label": "解決方案",
      "labelKey": "NAV_SOLUTIONS",
      "link": "/solutions",
      "children": [
        {
          "label": "企業數位轉型",
          "link": "/solutions/digital-transformation",
          "children": [
            { "label": "雲端遷移服務", "link": "/solutions/digital-transformation/cloud-migration" },
            { "label": "流程自動化", "link": "/solutions/digital-transformation/automation" },
            { "label": "數據分析平台", "link": "/solutions/digital-transformation/analytics" }
          ]
        },
        {
          "label": "資訊安全防護",
          "link": "/solutions/security",
          "children": [
            { "label": "端點防護方案", "link": "/solutions/security/endpoint" },
            { "label": "資安健檢服務", "link": "/solutions/security/assessment" }
          ]
        },
        { "label": "智慧製造", "link": "/solutions/smart-manufacturing" }
      ]
    },
    {
      "label": "成功案例",
      "labelKey": "NAV_CASES",
      "link": "/cases",
      "children": [
        {
          "label": "依產業分類",
          "link": "/cases/industry",
          "children": [
            { "label": "金融業", "link": "/cases/industry/finance" },
            { "label": "製造業", "link": "/cases/industry/manufacturing" },
            { "label": "零售業", "link": "/cases/industry/retail" }
          ]
        },
        { "label": "依解決方案", "link": "/cases/by-solution" }
      ]
    },
    {
      "label": "最新消息",
      "labelKey": "NAV_NEWS",
      "link": "/news",
      "children": [
        { "label": "公司動態", "link": "/news/company" },
        { "label": "產業洞察", "link": "/news/insights" },
        { "label": "媒體報導", "link": "/news/media" }
      ]
    },
    {
      "label": "聯絡我們",
      "labelKey": "NAV_CONTACT",
      "link": "/contact",
      "children": [
        { "label": "商務諮詢", "link": "/contact/inquiry" },
        { "label": "據點資訊", "link": "/contact/locations" },
        { "label": "加入我們", "link": "/contact/careers" }
      ]
    }
  ]
}
```

---

## 二、首頁 (Home) Content Blocks 配置

### Block 1: Hero Banner（主視覺輪播）

| 欄位 | 範例內容 |
|------|---------|
| **type** | `hero-carousel` |
| **slides[0].title** | 驅動企業創新，成就數位未來 |
| **slides[0].subtitle** | 我們以領先技術與豐富經驗，協助超過 500 家企業完成數位轉型之旅 |
| **slides[0].cta.text** | 立即諮詢 |
| **slides[0].cta.link** | /contact/inquiry |
| **slides[0].image** | /assets/images/hero-digital-transformation.jpg |
| **slides[1].title** | 資安無死角，營運不中斷 |
| **slides[1].subtitle** | 獲 ISO 27001 認證的全方位資安防護解決方案 |

---

### Block 2: Value Proposition（核心價值主張）

| 欄位 | 範例內容 |
|------|---------|
| **type** | `feature-grid` |
| **title** | 為何選擇我們？ |
| **items[0].icon** | icon-certified |
| **items[0].title** | 國際認證品質 |
| **items[0].description** | 取得 ISO 27001、ISO 9001 雙認證，服務品質受國際肯定 |
| **items[1].icon** | icon-experience |
| **items[1].title** | 20+ 年產業經驗 |
| **items[1].description** | 深耕金融、製造、零售產業，累積豐富的垂直領域專業知識 |
| **items[2].icon** | icon-support |
| **items[2].title** | 7×24 技術支援 |
| **items[2].description** | 全年無休的在地技術團隊，確保您的系統穩定運作 |

---

### Block 3: Solutions Overview（解決方案快覽）

| 欄位 | 範例內容 |
|------|---------|
| **type** | `card-carousel` |
| **title** | 我們的解決方案 |
| **subtitle** | 從策略規劃到落地執行，提供完整的數位服務藍圖 |
| **cards[0].image** | /assets/images/solution-dt.jpg |
| **cards[0].title** | 企業數位轉型 |
| **cards[0].summary** | 結合雲端技術與流程再造，打造靈活高效的現代企業架構 |
| **cards[0].link** | /solutions/digital-transformation |
| **cards[1].title** | 資訊安全防護 |
| **cards[1].summary** | 從端點到雲端的全面防護，守護企業核心資產與商業機密 |
| **cards[2].title** | 智慧製造 |
| **cards[2].summary** | IoT 與 AI 驅動的生產優化，提升產能並降低營運成本 |

---

### Block 4: Case Studies Highlight（精選成功案例）

| 欄位 | 範例內容 |
|------|---------|
| **type** | `case-study-showcase` |
| **title** | 客戶成功故事 |
| **cases[0].logo** | /assets/logos/client-abc-bank.svg |
| **cases[0].name** | ABC 銀行 |
| **cases[0].industry** | 金融業 |
| **cases[0].challenge** | 老舊核心系統難以支撐數位金融服務的快速發展 |
| **cases[0].result** | 系統效能提升 340%，新服務上線時程縮短 60% |
| **cases[0].quote** | 「這是我們近十年來最成功的 IT 專案，為銀行的數位化奠定了堅實基礎。」—— 資訊長 王大明 |
| **viewMoreText** | 探索更多成功案例 |
| **viewMoreLink** | /cases |

---

### Block 5: Statistics Counter（數據成果展示）

| 欄位 | 範例內容 |
|------|---------|
| **type** | `stats-counter` |
| **background** | gradient-brand |
| **stats[0].value** | 500+ |
| **stats[0].label** | 服務企業客戶 |
| **stats[1].value** | 98% |
| **stats[1].label** | 客戶續約率 |
| **stats[2].value** | 150+ |
| **stats[2].label** | 專業技術顧問 |
| **stats[3].value** | 20+ |
| **stats[3].label** | 年產業經驗 |

---

### Block 6: CTA Banner（行動呼籲橫幅）

| 欄位 | 範例內容 |
|------|---------|
| **type** | `cta-banner` |
| **title** | 準備好開啟您的數位轉型之旅了嗎？ |
| **description** | 我們的專業顧問團隊將為您量身規劃最適合的解決方案，歡迎預約免費諮詢 |
| **primaryCta.text** | 預約諮詢 |
| **primaryCta.link** | /contact/inquiry |
| **secondaryCta.text** | 下載服務簡介 |
| **secondaryCta.link** | /downloads/company-brochure.pdf |

---

## 三、解決方案頁面 (Solutions) Content Blocks 配置

### Block 1: Page Hero（頁面主視覺）

| 欄位 | 範例內容 |
|------|---------|
| **type** | `page-hero` |
| **title** | 企業數位轉型解決方案 |
| **subtitle** | 從雲端遷移、流程自動化到數據驅動決策，我們提供端到端的轉型服務 |
| **breadcrumb** | 首頁 > 解決方案 > 企業數位轉型 |
| **image** | /assets/images/hero-solutions.jpg |

---

### Block 2: Problem Statement（痛點描述）

| 欄位 | 範例內容 |
|------|---------|
| **type** | `content-with-image` |
| **imagePosition** | right |
| **title** | 您是否正面臨這些挑戰？ |
| **items[0]** | 🔴 老舊系統維護成本高昂，卻難以支援業務創新需求 |
| **items[1]** | 🔴 部門間資訊孤島嚴重，數據難以整合分析 |
| **items[2]** | 🔴 人工作業流程繁瑣，團隊生產力無法有效提升 |
| **items[3]** | 🔴 缺乏數位人才，不知從何著手規劃轉型藍圖 |
| **image** | /assets/images/challenges-illustration.svg |

---

### Block 3: Solution Features（方案功能特色）

| 欄位 | 範例內容 |
|------|---------|
| **type** | `tabbed-content` |
| **title** | 我們的方案涵蓋 |
| **tabs[0].label** | 雲端遷移服務 |
| **tabs[0].title** | 安全、高效的雲端旅程 |
| **tabs[0].content** | 我們採用業界最佳實踐的 6R 遷移策略，協助企業評估現有工作負載，制定最佳化的雲端架構... |
| **tabs[0].features** | ✅ 工作負載評估與 TCO 分析<br>✅ 多雲 / 混合雲架構規劃<br>✅ 應用程式現代化改造 |
| **tabs[1].label** | 流程自動化 |
| **tabs[1].title** | 用智慧驅動營運效率 |
| **tabs[1].content** | 導入 RPA 與低程式碼平台，將重複性高的人工作業轉化為自動化流程... |

---

### Block 4: Process Steps（導入流程）

| 欄位 | 範例內容 |
|------|---------|
| **type** | `timeline-steps` |
| **title** | 我們的服務流程 |
| **subtitle** | 系統化的導入方法論，確保專案順利交付 |
| **steps[0].number** | 01 |
| **steps[0].title** | 需求訪談與現況評估 |
| **steps[0].description** | 深入了解您的業務目標、現有 IT 環境與痛點，產出完整的評估報告 |
| **steps[0].duration** | 2-3 週 |
| **steps[1].number** | 02 |
| **steps[1].title** | 轉型藍圖規劃 |
| **steps[2].number** | 03 |
| **steps[2].title** | 實施與導入 |
| **steps[3].number** | 04 |
| **steps[3].title** | 上線與持續優化 |

---

### Block 5: Related Case Studies（相關案例）

| 欄位 | 範例內容 |
|------|---------|
| **type** | `case-cards` |
| **title** | 成功案例實績 |
| **cases[0].image** | /assets/images/case-xyz-corp.jpg |
| **cases[0].title** | XYZ 製造集團雲端轉型專案 |
| **cases[0].summary** | 將核心 ERP 遷移至混合雲架構，系統穩定性提升至 99.9%，年度維運成本降低 35% |
| **cases[0].tags** | 雲端遷移, 製造業 |
| **cases[1].title** | 台灣零售龍頭 RPA 導入 |
| **cases[1].summary** | 導入 50+ 支自動化機器人，每年節省超過 12,000 人工小時 |

---

### Block 6: FAQ Accordion（常見問題）

| 欄位 | 範例內容 |
|------|---------|
| **type** | `faq-accordion` |
| **title** | 常見問題 |
| **items[0].question** | 數位轉型專案通常需要多長時間？ |
| **items[0].answer** | 轉型時程取決於專案範圍與複雜度。一般而言，初階雲端遷移專案約需 3-6 個月，而涵蓋多系統整合的大型轉型專案可能需要 12-18 個月... |
| **items[1].question** | 如何確保轉型過程中業務不中斷？ |
| **items[1].answer** | 我們採用分階段遷移策略，並建立完善的回退機制（Rollback Plan）... |
| **items[2].question** | 貴公司提供哪些售後支援服務？ |
| **items[2].answer** | 我們提供多種維運支援方案，包含標準工時（8×5）與全天候（7×24）服務模式... |

---

### Block 7: Contact CTA（聯絡表單 CTA）

| 欄位 | 範例內容 |
|------|---------|
| **type** | `contact-form-cta` |
| **title** | 與我們的專家聊聊 |
| **description** | 填寫以下表單，我們的解決方案顧問將於 1 個工作天內與您聯繫 |
| **fields** | 姓名*, 公司名稱*, 職稱, 電子郵件*, 電話, 諮詢主題（下拉選單）, 訊息內容 |
| **submitButton** | 送出諮詢 |
| **privacy** | 提交此表單即表示您同意我們的[隱私權政策](/privacy)，我們將妥善保護您的個人資料。 |

---

## 四、補充頁面建議

| 頁面 | 建議 Content Blocks |
|------|-------------------|
| **關於我們** | page-hero, company-intro, vision-mission, timeline-milestones, team-grid, partner-logos |
| **成功案例列表** | page-hero, filter-bar, case-card-grid, pagination |
| **成功案例詳情** | case-hero, client-background, challenge-section, solution-section, results-metrics, testimonial-quote, related-cases |
| **聯絡我們** | page-hero, contact-form, office-locations-map, faq-accordion |
| **最新消息列表** | page-hero, category-filter, article-card-grid, pagination |
| **文章詳情** | article-header, article-body, author-info, related-articles, social-share |
