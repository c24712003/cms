
-- ============================================
-- JAPANESE CONTENT (日本語)
-- ============================================

-- Page Contents: Home (Japanese)
INSERT OR IGNORE INTO page_contents (page_id, lang_code, title, slug_localized, seo_title, seo_desc, content_json, updated_at)
SELECT id, 'ja', 'CMSデモへようこそ', 'home', 'ホーム | CMSデモ', 'AngularとNode.jsで構築された強力な多言語コンテンツ管理システム', 
'[
  {"type":"hero-carousel","slides":[
    {"title":"CMSデモへようこそ","subtitle":"最新技術で構築された強力な多言語コンテンツ管理システム","cta":{"text":"はじめる","link":"/contact"},"image":"/assets/images/hero-cms.jpg"},
    {"title":"シームレスなコンテンツ管理","subtitle":"多言語コンテンツの作成、編集、公開が簡単に","cta":{"text":"詳細を見る","link":"/about"},"image":"/assets/images/hero-content.jpg"}
  ]},
  {"type":"feature-grid","title":"当社のCMSが選ばれる理由","items":[
    {"icon":"icon-certified","title":"多言語サポート","description":"無制限の言語に対応したネイティブi18nサポートで簡単に切り替え可能"},
    {"icon":"icon-experience","title":"最新技術","description":"Angular 21、Node.js、SQLiteを採用し、最適なパフォーマンスを実現"},
    {"icon":"icon-support","title":"使いやすさ","description":"誰でも数分で習得できる直感的な管理インターフェース"}
  ]},
  {"type":"stats-counter","background":"gradient-brand","stats":[
    {"value":"10+","label":"対応言語"},
    {"value":"99.9%","label":"稼働率"},
    {"value":"1000+","label":"満足したユーザー"},
    {"value":"24/7","label":"サポート"}
  ]},
  {"type":"cta-banner","title":"コンテンツ管理を変革しませんか？","description":"強力なCMSプラットフォームで、今すぐ多言語コンテンツの管理を始めましょう。","primaryCta":{"text":"お問い合わせ","link":"/contact"}}
]',
CURRENT_TIMESTAMP FROM pages WHERE slug_key = 'home';

-- Page Contents: About (Japanese)
INSERT OR IGNORE INTO page_contents (page_id, lang_code, title, slug_localized, seo_title, seo_desc, content_json, updated_at)
SELECT id, 'ja', '私たちについて', 'about', '私たちについて | CMSデモ', '会社概要とミッションについて', 
'[
  {"type":"page-hero","title":"私たちについて","subtitle":"私たちは、最高のコンテンツ管理ソリューションの構築に情熱を注ぐ開発者チームです","breadcrumb":[{"label":"ホーム","link":"/"},{"label":"私たちについて"}],"image":"/assets/images/hero-about.jpg"},
  {"type":"content-with-image","imagePosition":"right","title":"私たちのストーリー","items":["2024年に経験豊富な開発チームによって設立されました","1000社以上の企業のデジタルコンテンツ・ワークフローの効率化を支援してきました","私たちのミッションは、誰にとってもコンテンツ管理を簡単にすることです","オープンソースとコミュニティ主導の開発を信じています"],"image":"/assets/images/team-illustration.svg"},
  {"type":"timeline-steps","title":"私たちの歩み","subtitle":"スタートアップから業界リーダーへ","steps":[
    {"number":"2024","title":"設立","description":"コンテンツ管理に革命を起こすというビジョンを持ってスタート"},
    {"number":"2025","title":"顧客数1000社","description":"最初のマイルストーンである1000社の顧客を獲得"},
    {"number":"2026","title":"グローバル展開","description":"50カ国以上の顧客へのサービス提供を開始"}
  ]},
  {"type":"feature-grid","title":"私たちの価値観","items":[
    {"icon":"icon-certified","title":"品質","description":"製品の品質には決して妥協しません"},
    {"icon":"icon-experience","title":"イノベーション","description":"常に新技術で限界に挑戦し続けます"},
    {"icon":"icon-support","title":"お客様第一","description":"お客様の成功が私たちの最優先事項です"}
  ]},
  {"type":"cta-banner","title":"コミュニティに参加しよう","description":"成長を続けるコンテンツクリエイターと開発者のコミュニティの一員になりませんか。","primaryCta":{"text":"はじめる","link":"/contact"}}
]',
CURRENT_TIMESTAMP FROM pages WHERE slug_key = 'about';

-- Page Contents: Services (Japanese)
INSERT OR IGNORE INTO page_contents (page_id, lang_code, title, slug_localized, seo_title, seo_desc, content_json, updated_at)
SELECT id, 'ja', 'サービス', 'services', 'サービス | CMSデモ', '当社のコンテンツ管理サービスをご紹介します', 
'[
  {"type":"page-hero","title":"サービス","subtitle":"ビジネスニーズに合わせて設計された包括的なコンテンツ管理ソリューション","breadcrumb":[{"label":"ホーム","link":"/"},{"label":"サービス"}],"image":"/assets/images/hero-services.jpg"},
  {"type":"card-carousel","title":"提供サービス","subtitle":"プロフェッショナルなサービスをご覧ください","cards":[
    {"image":"/assets/images/service-web.jpg","title":"ウェブサイト開発","summary":"Angular, React, Vue.jsなどの最新技術を使用したカスタムサイト構築","link":"/services/web-development"},
    {"image":"/assets/images/service-i18n.jpg","title":"多言語サポート","summary":"包括的なi18nソリューションで世界中のオーディエンスにリーチ","link":"/services/i18n"},
    {"image":"/assets/images/service-seo.jpg","title":"SEO対策","summary":"SSRと最適化サービスで検索順位を向上","link":"/services/seo"}
  ]},
  {"type":"feature-grid","title":"なぜ当社が選ばれるのか？","items":[
    {"icon":"icon-certified","title":"専門チーム","description":"長年の業界経験を持つ認定プロフェッショナル"},
    {"icon":"icon-experience","title":"豊富な実績","description":"世界中で500以上のプロジェクトを成功させてきました"},
    {"icon":"icon-support","title":"継続的なサポート","description":"24時間365日対応の専任サポートチーム"}
  ]},
  {"type":"stats-counter","background":"gradient-brand","stats":[
    {"value":"500+","label":"プロジェクト実績"},
    {"value":"50+","label":"提供国"},
    {"value":"99%","label":"顧客満足度"},
    {"value":"24/7","label":"サポート対応"}
  ]},
  {"type":"cta-banner","title":"プロジェクトを始めませんか？","description":"無料相談とお見積もりについては、今すぐお問い合わせください。","primaryCta":{"text":"見積もりを依頼","link":"/contact"}}
]',
CURRENT_TIMESTAMP FROM pages WHERE slug_key = 'services';

-- Page Contents: Contact (Japanese)
INSERT OR IGNORE INTO page_contents (page_id, lang_code, title, slug_localized, seo_title, seo_desc, content_json, updated_at)
SELECT id, 'ja', 'お問い合わせ', 'contact', 'お問い合わせ | CMSデモ', 'チームへのご連絡はこちら', 
'[
  {"type":"page-hero","title":"お問い合わせ","subtitle":"ご意見をお待ちしております。お気軽にご連絡ください。","breadcrumb":[{"label":"ホーム","link":"/"},{"label":"お問い合わせ"}],"image":"/assets/images/hero-contact.jpg"},
  {"type":"feature-grid","title":"連絡先","items":[
    {"icon":"icon-certified","title":"メール","description":"hello@cmsdemo.com - 24時間以内に返信します"},
    {"icon":"icon-experience","title":"電話","description":"+1 (555) 123-4567 - 月-金, 9:00-18:00"},
    {"icon":"icon-support","title":"オフィス","description":"123 Tech Street, San Francisco, CA 94102"}
  ]},
  {"type":"faq-accordion","title":"よくある質問","items":[
    {"question":"営業時間は？","answer":"チームは月曜日から金曜日の午前9時から午後6時(PST)まで対応しています。緊急の場合は、24時間年中無休のサポートホットラインにご連絡ください。"},
    {"question":"問い合わせへの返信はどのくらいかかりますか？","answer":"営業日であれば24時間以内の返信を心がけています。優先サポートのお客様には4時間以内に返信いたします。"},
    {"question":"無料相談はありますか？","answer":"はい！プロジェクトの要件やサポート内容について、30分間の無料相談を行っています。"}
  ]},
  {"type":"cta-banner","title":"一緒に素晴らしいものを作りましょう","description":"お問い合わせフォームにご記入いただければ、24時間以内にご連絡いたします。","primaryCta":{"text":"メッセージを送信","link":"/contact/form"}}
]',
CURRENT_TIMESTAMP FROM pages WHERE slug_key = 'contact';

-- Page Contents: Corporate Home (Japanese)
INSERT OR IGNORE INTO page_contents (page_id, lang_code, title, slug_localized, seo_title, seo_desc, content_json, updated_at)
SELECT id, 'ja', 'ホーム', 'home', '最先端技術ソリューション | デジタルトランスフォーメーションの専門家', '高度な技術と豊富な経験により、500社以上の企業のデジタルトランスフォーメーションを支援してきました。',
'[
  {"type":"hero-carousel","slides":[
    {"title":"イノベーションを推進し、未来を形作る","subtitle":"最先端の技術と豊富な経験により、500社以上の企業のデジタルトランスフォーメーションを支援","cta":{"text":"お問い合わせ","link":"/contact/inquiry"},"image":"/assets/images/hero-digital-transformation.jpg"},
    {"title":"万全のセキュリティ、止まらない運用","subtitle":"ISO 27001認証取得の包括的なセキュリティ保護ソリューション","cta":{"text":"詳細はこちら","link":"/solutions/security"},"image":"/assets/images/hero-security.jpg"}
  ]},
  {"type":"feature-grid","title":"なぜ選ばれるのか？","items":[
    {"icon":"icon-certified","title":"国際認証品質","description":"ISO 27001およびISO 9001のダブル認証を取得、国際的に認められたサービス品質"},
    {"icon":"icon-experience","title":"20年以上の経験","description":"金融、製造、小売業界における深い専門知識"},
    {"icon":"icon-support","title":"24時間365日の技術サポート","description":"システムの安定稼働を保証する、現地技術チームによる年中無休のサポート"}
  ]},
  {"type":"card-carousel","title":"ソリューション","subtitle":"戦略から実行まで、包括的なデジタルサービスを提供","cards":[
    {"image":"/assets/images/solution-dt.jpg","title":"デジタルトランスフォーメーション","summary":"クラウド技術とプロセス改革を組み合わせ、アジャイルな企業アーキテクチャを構築","link":"/solutions/digital-transformation"},
    {"image":"/assets/images/solution-security.jpg","title":"サイバーセキュリティ","summary":"エンドポイントからクラウドまで、コア資産を守るエンドツーエンドの保護","link":"/solutions/security"},
    {"image":"/assets/images/solution-manufacturing.jpg","title":"スマートマニュファクチャリング","summary":"IoTとAIを活用した生産最適化で、効率向上とコスト削減を実現","link":"/solutions/smart-manufacturing"}
  ]},
  {"type":"case-study-showcase","title":"お客様の成功事例","cases":[
    {"logo":"/assets/logos/client-abc-bank.svg","name":"ABC銀行","industry":"金融サービス","challenge":"レガシーな勘定系システムが急速なデジタルバンキングの発展に対応できない","result":"システムパフォーマンスが340%向上、市場投入までの時間が60%短縮","quote":"これは過去10年で最も成功したITプロジェクトであり、デジタルバンキングの強固な基盤を築くことができました。— CIO","link":"/cases/abc-bank"}
  ],"viewMoreText":"事例をもっと見る","viewMoreLink":"/cases"},
  {"type":"stats-counter","background":"gradient-brand","stats":[
    {"value":"500+","label":"企業クライアント"},
    {"value":"98%","label":"顧客維持率"},
    {"value":"150+","label":"専門コンサルタント"},
    {"value":"20+","label":"年の経験"}
  ]},
  {"type":"cta-banner","title":"デジタルの旅を始める準備はできましたか？","description":"専門チームが貴社のビジネスに最適なソリューションを設計します。まずは無料相談をご予約ください。","primaryCta":{"text":"相談を予約","link":"/contact/inquiry"},"secondaryCta":{"text":"資料ダウンロード","link":"/downloads/company-brochure.pdf"}}
]',
CURRENT_TIMESTAMP FROM pages WHERE slug_key = 'corporate-home';

-- Page Contents: Solutions Landing (Japanese)
INSERT OR IGNORE INTO page_contents (page_id, lang_code, title, slug_localized, seo_title, seo_desc, content_json, updated_at)
SELECT id, 'ja', 'ソリューション', 'solutions', 'ソリューション | デジタルトランスフォーメーション, サイバーセキュリティ, スマート製造', 'デジタルトランスフォーメーション、サイバーセキュリティ、スマート製造のエンタープライズソリューションで競争力を強化します。',
'[
  {"type":"page-hero","title":"ソリューション","subtitle":"戦略から実行まで、包括的なエンタープライズソリューションを提供します","breadcrumb":[{"label":"ホーム","link":"/"},{"label":"ソリューション"}],"image":"/assets/images/hero-solutions.jpg"},
  {"type":"card-carousel","title":"サービスを探す","subtitle":"ビジネスニーズに最適なソリューションをお選びください","cards":[
    {"image":"/assets/images/solution-dt.jpg","title":"デジタルトランスフォーメーション","summary":"クラウド技術とプロセス改革を組み合わせ、アジャイルな企業アーキテクチャを構築","link":"/solutions/digital-transformation"},
    {"image":"/assets/images/solution-security.jpg","title":"サイバーセキュリティ","summary":"エンドポイントからクラウドまで、コア資産を守るエンドツーエンドの保護","link":"/solutions/security"},
    {"image":"/assets/images/solution-manufacturing.jpg","title":"スマートマニュファクチャリング","summary":"IoTとAIを活用した生産最適化で、効率向上とコスト削減を実現","link":"/solutions/smart-manufacturing"}
  ]},
  {"type":"feature-grid","title":"私たちのコア能力","items":[
    {"icon":"icon-certified","title":"専門コンサルタント","description":"専門的なアドバイスを提供する150名以上の業界経験豊富な技術コンサルタント"},
    {"icon":"icon-experience","title":"アジャイルデリバリー","description":"Scrum/Kanbanアジャイル開発を採用し、プロジェクトを期限内に納品","link":null},
    {"icon":"icon-support","title":"継続的なサポート","description":"24時間365日の技術サポートでシステムの安定稼働を保証"}
  ]},
  {"type":"cta-banner","title":"最適なソリューションが見つかりませんか？","description":"コンサルタントが貴社のニーズに合わせたカスタムソリューションを設計します","primaryCta":{"text":"お問い合わせ","link":"/contact/inquiry"}}
]',
CURRENT_TIMESTAMP FROM pages WHERE slug_key = 'solutions';

-- Page Contents: Solutions Detail (Japanese)
INSERT OR IGNORE INTO page_contents (page_id, lang_code, title, slug_localized, seo_title, seo_desc, content_json, updated_at)
SELECT id, 'ja', 'デジタルトランスフォーメーション・ソリューション', 'digital-transformation', 'DXソリューション | クラウド移行, プロセス自動化', 'クラウド移行からプロセス自動化、データ主導の意思決定まで、エンドツーエンドの変革サービスを提供します。',
'[
  {"type":"page-hero","title":"デジタルトランスフォーメーション・ソリューション","subtitle":"クラウド移行からプロセス自動化、データ主導の意思決定まで、エンドツーエンドの変革サービスを提供","breadcrumb":[{"label":"ホーム","link":"/"},{"label":"ソリューション","link":"/solutions"},{"label":"デジタルトランスフォーメーション"}],"image":"/assets/images/hero-solutions.jpg"},
  {"type":"content-with-image","imagePosition":"right","title":"このような課題に直面していませんか？","items":["🔴 ビジネスイノベーションに対応できないレガシーシステムの高い維持コスト","🔴 部門間の深刻な情報のサイロ化によるデータ統合の困難さ","🔴 チームの生産性を制限する煩雑な手作業プロセス","🔴 デジタル人材の不足と不透明な変革ロードマップ"],"image":"/assets/images/challenges-illustration.svg"},
  {"type":"timeline-steps","title":"サービスプロセス","subtitle":"プロジェクトの成功を確実に","steps":[
    {"number":"01","title":"発見と評価","description":"ビジネス目標、既存のIT環境、課題を深く掘り下げる","duration":"2-3週間"},
    {"number":"02","title":"ロードマップ策定","description":"評価結果に基づき、明確なKPIを持つ段階的な導入計画を作成","duration":"2-4週間"},
    {"number":"03","title":"実装","description":"各フェーズでの検証と調整を行う、反復的なアジャイル開発"},
    {"number":"04","title":"ローンチと最適化","description":"本番稼働後のサポートと、データ洞察に基づく継続的な最適化"}
  ]},
  {"type":"faq-accordion","title":"よくある質問","items":[
    {"question":"デジタルトランスフォーメーション・プロジェクトには通常どのくらいの時間がかかりますか？","answer":"期間はプロジェクトの範囲と複雑さによります。基本的なクラウド移行プロジェクトは通常3～6ヶ月ですが、大規模な複数システム統合プロジェクトは12～18ヶ月かかる場合があります。評価フェーズで詳細なタイムライン計画を提供します。"},
    {"question":"変革中の事業継続性はどのように確保されますか？","answer":"包括的なロールバックメカニズムを備えた段階的な移行戦略を使用します。重要なシステムはオフピーク時に切り替えられ、専任チームによる24時間監視で業務中断ゼロを保証します。"},
    {"question":"導入後にどのようなサポートが提供されますか？","answer":"標準営業時間（8x5）および24時間365日のオプションを含む複数のサポート階層を提供し、システム監視、問題解決、パフォーマンスチューニング、定期的なヘルスチェックレポートをカバーします。"}
  ]},
  {"type":"cta-banner","title":"専門家に相談する","description":"以下のフォームにご記入ください。1営業日以内にソリューションコンサルタントからご連絡いたします。","primaryCta":{"text":"はじめる","link":"/contact/inquiry"}}
]',
CURRENT_TIMESTAMP FROM pages WHERE slug_key = 'solutions/digital-transformation';

-- Page Contents: Cases (Japanese)
INSERT OR IGNORE INTO page_contents (page_id, lang_code, title, slug_localized, seo_title, seo_desc, content_json, updated_at)
SELECT id, 'ja', '導入事例', 'cases', '導入事例 | お客様の成功事例', '金融、製造、小売業界のお客様がデジタルトランスフォーメーションを実現し、測定可能なビジネス価値をどのように創出したかをご覧ください。',
'[
  {"type":"page-hero","title":"導入事例","subtitle":"企業クライアントがどのように測定可能なビジネス価値を創造しているかをご覧ください","breadcrumb":[{"label":"ホーム","link":"/"},{"label":"導入事例"}],"image":"/assets/images/hero-cases.jpg"},
  {"type":"feature-grid","title":"業界別に見る","items":[
    {"icon":"icon-certified","title":"金融サービス","description":"銀行、保険、証券会社の基幹システム近代化を支援"},
    {"icon":"icon-experience","title":"製造業","description":"スマートマニュファクチャリングとサプライチェーンのデジタル化ソリューションを導入"},
    {"icon":"icon-support","title":"小売業","description":"オムニチャネル小売プラットフォームと顧客分析基盤の構築"}
  ]},
  {"type":"case-cards","title":"注目の事例","cases":[
    {"image":"/assets/images/case-abc-bank.jpg","title":"ABC銀行 基幹システム近代化","summary":"30年前の基幹システムをクラウドに移行、パフォーマンス340%向上、市場投入速度60%短縮","tags":["金融サービス","クラウド移行"],"link":"/cases/abc-bank"},
    {"image":"/assets/images/case-xyz-corp.jpg","title":"XYZ製造 スマートファクトリー","summary":"IoTセンサーとAI予知保全を導入、設備故障率75%削減、生産性28%向上","tags":["製造業","スマートファクトリー"],"link":"/cases/xyz-corp"},
    {"image":"/assets/images/case-retail.jpg","title":"大手小売チェーン RPA導入","summary":"50以上の自動化ボットを導入、年間12,000時間以上の工数削減、99.9%の精度を実現","tags":["小売業","プロセス自動化"],"link":"/cases/retail-rpa"}
  ]},
  {"type":"stats-counter","background":"gradient-brand","stats":[
    {"value":"500+","label":"成功事例"},
    {"value":"98%","label":"顧客満足度"},
    {"value":"50+","label":"対応業界"},
    {"value":"15","label":"サービス提供国"}
  ]},
  {"type":"cta-banner","title":"詳しく知りたいですか？","description":"個別相談をご予約ください。お客様のニーズに関連する事例をご紹介します。","primaryCta":{"text":"相談を予約","link":"/contact/inquiry"}}
]',
CURRENT_TIMESTAMP FROM pages WHERE slug_key = 'cases';

-- Page Contents: About Company (Japanese)
INSERT OR IGNORE INTO page_contents (page_id, lang_code, title, slug_localized, seo_title, seo_desc, content_json, updated_at)
SELECT id, 'ja', '会社概要', 'about', '会社概要 | デジタルトランスフォーメーションのリーダー', '私たちは20年以上の経験を持つ大手デジタルトランスフォーメーション企業で、500社以上の企業クライアントにサービスを提供しています。',
'[
  {"type":"page-hero","title":"私たちについて","subtitle":"技術革新を通じて企業の成長を牽引する、信頼できるデジタルトランスフォーメーションパートナー","breadcrumb":[{"label":"ホーム","link":"/"},{"label":"私たちについて"},{"label":"会社概要"}],"image":"/assets/images/hero-about.jpg"},
  {"type":"content-with-image","imagePosition":"right","title":"私たちのミッション","items":["🎯 技術革新を活用して企業の競争力を高める支援をする","🎯 エンドツーエンドのデジタルトランスフォーメーションソリューションを提供する","🎯 デジタル人材を育成し、業界のアップグレードを推進する","🎯 クライアントにとって最も信頼できる長期的パートナーになる"],"image":"/assets/images/mission-illustration.svg"},
  {"type":"timeline-steps","title":"マイルストーン","subtitle":"継続的な成長の軌跡","steps":[
    {"number":"2005","title":"設立","description":"3名のシニアITコンサルタントにより設立、システム統合サービスに注力"},
    {"number":"2010","title":"クラウド展開","description":"AWSおよびAzure認定パートナーとなり、クラウド移行サービスを開始"},
    {"number":"2018","title":"デジタルトランスフォーメーション","description":"デジタルトランスフォーメーション・コンサルティングへと業態転換、東南アジアへ拡大"},
    {"number":"2024","title":"AIパワー","description":"AIラボを設立し、生成AIをソリューションに統合"}
  ]},
  {"type":"feature-grid","title":"コアバリュー","items":[
    {"icon":"icon-certified","title":"プロフェッショナリズム","description":"最適なソリューションを提供するために技術力を絶えず向上"},
    {"icon":"icon-experience","title":"誠実さ","description":"信頼と正直さに基づく長期的なパートナーシップの構築"},
    {"icon":"icon-support","title":"イノベーション","description":"変化を受け入れ、革新的な思考で問題を解決"}
  ]},
  {"type":"stats-counter","background":"gradient-brand","stats":[
    {"value":"500+","label":"提供クライアント"},
    {"value":"150+","label":"専門コンサルタント"},
    {"value":"20+","label":"年の経験"},
    {"value":"15","label":"グローバル拠点"}
  ]},
  {"type":"cta-banner","title":"チームに参加しませんか","description":"より良いデジタルの未来を共に築く才能ある人材を募集しています","primaryCta":{"text":"採用情報を見る","link":"/contact/careers"}}
]',
CURRENT_TIMESTAMP FROM pages WHERE slug_key = 'about/company';


-- ============================================
-- KOREAN CONTENT (한국어)
-- ============================================

-- Page Contents: Home (Korean)
INSERT OR IGNORE INTO page_contents (page_id, lang_code, title, slug_localized, seo_title, seo_desc, content_json, updated_at)
SELECT id, 'ko', 'CMS 데모에 오신 것을 환영합니다', 'home', '홈 | CMS 데모', 'Angular와 Node.js로 구축된 강력한 다국어 콘텐츠 관리 시스템', 
'[
  {"type":"hero-carousel","slides":[
    {"title":"CMS 데모에 오신 것을 환영합니다","subtitle":"최신 기술로 구축된 강력한 다국어 콘텐츠 관리 시스템","cta":{"text":"시작하기","link":"/contact"},"image":"/assets/images/hero-cms.jpg"},
    {"title":"원활한 콘텐츠 관리","subtitle":"다국어 콘텐츠를 쉽게 생성, 편집 및 게시하세요","cta":{"text":"더 알아보기","link":"/about"},"image":"/assets/images/hero-content.jpg"}
  ]},
  {"type":"feature-grid","title":"왜 우리 CMS인가요?","items":[
    {"icon":"icon-certified","title":"다국어 지원","description":"쉬운 전환이 가능한 무제한 언어 기본 i18n 지원"},
    {"icon":"icon-experience","title":"최신 기술","description":"최적의 성능을 위해 Angular 21, Node.js 및 SQLite로 구축됨"},
    {"icon":"icon-support","title":"사용하기 쉬움","description":"누구나 몇 분 만에 배울 수 있는 직관적인 관리 인터페이스"}
  ]},
  {"type":"stats-counter","background":"gradient-brand","stats":[
    {"value":"10+","label":"지원 언어"},
    {"value":"99.9%","label":"가동 시간"},
    {"value":"1000+","label":"행복한 사용자"},
    {"value":"24/7","label":"지원"}
  ]},
  {"type":"cta-banner","title":"콘텐츠 관리를 혁신할 준비가 되셨나요?","description":"오늘 강력한 CMS 플랫폼으로 다국어 콘텐츠 관리를 시작하세요.","primaryCta":{"text":"문의하기","link":"/contact"}}
]',
CURRENT_TIMESTAMP FROM pages WHERE slug_key = 'home';

-- Page Contents: About (Korean)
INSERT OR IGNORE INTO page_contents (page_id, lang_code, title, slug_localized, seo_title, seo_desc, content_json, updated_at)
SELECT id, 'ko', '회사 소개', 'about', '회사 소개 | CMS 데모', '회사 및 미션에 대해 더 알아보기', 
'[
  {"type":"page-hero","title":"회사 소개","subtitle":"우리는 최고의 콘텐츠 관리 솔루션을 만드는 데 전념하는 열정적인 개발자 팀입니다","breadcrumb":[{"label":"홈","link":"/"},{"label":"회사 소개"}],"image":"/assets/images/hero-about.jpg"},
  {"type":"content-with-image","imagePosition":"right","title":"우리의 이야기","items":["경험 풍부한 개발자 팀에 의해 2024년 설립","1000개 이상의 기업이 디지털 콘텐츠 워크플로를 간소화하도록 지원","우리의 미션은 모두가 콘텐츠 관리를 쉽게 할 수 있도록 하는 것입니다","우리는 오픈 소스와 커뮤니티 주도 개발을 믿습니다"],"image":"/assets/images/team-illustration.svg"},
  {"type":"timeline-steps","title":"우리의 여정","subtitle":"스타트업에서 업계 리더로","steps":[
    {"number":"2024","title":"설립","description":"콘텐츠 관리를 혁신하겠다는 비전으로 시작"},
    {"number":"2025","title":"고객 1000명","description":"첫 번째 이정표인 행복한 고객 1000명 달성"},
    {"number":"2026","title":"글로벌 확장","description":"50개국 이상의 고객에게 서비스 확장"}
  ]},
  {"type":"feature-grid","title":"우리의 가치","items":[
    {"icon":"icon-certified","title":"품질","description":"우리는 제품의 품질에 타협하지 않습니다"},
    {"icon":"icon-experience","title":"혁신","description":"새로운 기술로 끊임없이 한계를 넓혀갑니다"},
    {"icon":"icon-support","title":"고객 우선","description":"당신의 성공이 우리의 최우선 순위입니다"}
  ]},
  {"type":"cta-banner","title":"커뮤니티에 참여하세요","description":"성장하는 콘텐츠 크리에이터 및 개발자 커뮤니티의 일원이 되십시오.","primaryCta":{"text":"시작하기","link":"/contact"}}
]',
CURRENT_TIMESTAMP FROM pages WHERE slug_key = 'about';

-- Page Contents: Services (Korean)
INSERT OR IGNORE INTO page_contents (page_id, lang_code, title, slug_localized, seo_title, seo_desc, content_json, updated_at)
SELECT id, 'ko', '서비스', 'services', '서비스 | CMS 데모', '다양한 콘텐츠 관리 서비스를 살펴보세요', 
'[
  {"type":"page-hero","title":"서비스","subtitle":"비즈니스 요구 사항을 충족하도록 설계된 포괄적인 콘텐츠 관리 솔루션","breadcrumb":[{"label":"홈","link":"/"},{"label":"서비스"}],"image":"/assets/images/hero-services.jpg"},
  {"type":"card-carousel","title":"제공 서비스","subtitle":"다양한 전문 서비스를 살펴보세요","cards":[
    {"image":"/assets/images/service-web.jpg","title":"웹사이트 개발","summary":"Angular, React, Vue.js와 같은 최신 기술로 구축된 맞춤형 웹사이트","link":"/services/web-development"},
    {"image":"/assets/images/service-i18n.jpg","title":"다국어 지원","summary":"포괄적인 i18n 솔루션으로 글로벌 고객에게 도달","link":"/services/i18n"},
    {"image":"/assets/images/service-seo.jpg","title":"SEO 최적화","summary":"SSR 및 최적화 서비스로 검색 순위 향상","link":"/services/seo"}
  ]},
  {"type":"feature-grid","title":"왜 우리 서비스인가요?","items":[
    {"icon":"icon-certified","title":"전문 팀","description":"수년간의 업계 경험을 가진 인증된 전문가"},
    {"icon":"icon-experience","title":"입증된 실적","description":"전 세계적으로 500개 이상의 프로젝트 성공적 전달"},
    {"icon":"icon-support","title":"지속적인 지원","description":"24/7 이용 가능한 전담 지원 팀"}
  ]},
  {"type":"stats-counter","background":"gradient-brand","stats":[
    {"value":"500+","label":"전달된 프로젝트"},
    {"value":"50+","label":"서비스 국가"},
    {"value":"99%","label":"고객 만족도"},
    {"value":"24/7","label":"지원 가능"}
  ]},
  {"type":"cta-banner","title":"프로젝트를 시작할 준비가 되셨나요?","description":"무료 상담 및 견적을 위해 오늘 저희에게 연락하십시오.","primaryCta":{"text":"견적 받기","link":"/contact"}}
]',
CURRENT_TIMESTAMP FROM pages WHERE slug_key = 'services';

-- Page Contents: Contact (Korean)
INSERT OR IGNORE INTO page_contents (page_id, lang_code, title, slug_localized, seo_title, seo_desc, content_json, updated_at)
SELECT id, 'ko', '문의하기', 'contact', '문의하기 | CMS 데모', '우리 팀에 연락하기', 
'[
  {"type":"page-hero","title":"문의하기","subtitle":"여러분의 의견을 듣고 싶습니다! 우리 팀에 연락해 주세요.","breadcrumb":[{"label":"홈","link":"/"},{"label":"문의하기"}],"image":"/assets/images/hero-contact.jpg"},
  {"type":"feature-grid","title":"연락 방법","items":[
    {"icon":"icon-certified","title":"이메일","description":"hello@cmsdemo.com - 24시간 이내에 회신합니다"},
    {"icon":"icon-experience","title":"전화","description":"+1 (555) 123-4567 - 월-금, 9am-6pm"},
    {"icon":"icon-support","title":"사무실","description":"123 Tech Street, San Francisco, CA 94102"}
  ]},
  {"type":"faq-accordion","title":"자주 묻는 질문","items":[
    {"question":"영업 시간은 어떻게 되나요?","answer":"우리 팀은 월요일부터 금요일, 오전 9시부터 오후 6시(PST)까지 이용 가능합니다. 긴급한 사항은 24/7 지원 핫라인으로 연락할 수 있습니다."},
    {"question":"문의에 얼마나 빨리 응답하나요?","answer":"영업일 기준 24시간 이내에 모든 문의에 응답하는 것을 목표로 합니다. 우선 지원 고객은 4시간 이내에 응답을 받습니다."},
    {"question":"무료 상담을 제공하나요?","answer":"네! 프로젝트 요구 사항과 우리가 도울 수 있는 방법에 대해 논의하기 위해 30분 무료 상담을 제공합니다."}
  ]},
  {"type":"cta-banner","title":"함께 멋진 것을 만들어 봅시다","description":"문의 양식을 작성해 주시면 24시간 이내에 연락 드리겠습니다.","primaryCta":{"text":"메시지 보내기","link":"/contact/form"}}
]',
CURRENT_TIMESTAMP FROM pages WHERE slug_key = 'contact';

-- Page Contents: Corporate Home (Korean)
INSERT OR IGNORE INTO page_contents (page_id, lang_code, title, slug_localized, seo_title, seo_desc, content_json, updated_at)
SELECT id, 'ko', '홈', 'home', '선도적인 기술 솔루션 | 디지털 혁신 전문가', '첨단 기술과 풍부한 경험으로 500개 이상의 기업이 디지털 혁신 여정을 완료하도록 도왔습니다.',
'[
  {"type":"hero-carousel","slides":[
    {"title":"혁신 주도, 미래 형성","subtitle":"첨단 기술과 풍부한 경험으로 500개 이상의 기업이 디지털 혁신 여정을 완료하도록 지원","cta":{"text":"문의하기","link":"/contact/inquiry"},"image":"/assets/images/hero-digital-transformation.jpg"},
    {"title":"포괄적인 보안, 중단 없는 운영","subtitle":"ISO 27001 인증 포괄적인 보안 보호 솔루션","cta":{"text":"더 알아보기","link":"/solutions/security"},"image":"/assets/images/hero-security.jpg"}
  ]},
  {"type":"feature-grid","title":"왜 우리를 선택해야 하나요?","items":[
    {"icon":"icon-certified","title":"국제 인증 품질","description":"ISO 27001 및 ISO 9001 이중 인증, 국제적으로 인정받은 서비스 품질"},
    {"icon":"icon-experience","title":"20년 이상의 경험","description":"금융, 제조 및 소매 산업에 대한 깊은 전문 지식"},
    {"icon":"icon-support","title":"24/7 기술 지원","description":"시스템 안정성을 보장하는 24시간 현지 기술 팀"}
  ]},
  {"type":"card-carousel","title":"우리의 솔루션","subtitle":"전략에서 실행까지, 포괄적인 디지털 서비스 제공","cards":[
    {"image":"/assets/images/solution-dt.jpg","title":"디지털 혁신","summary":"클라우드 기술과 프로세스 재설계를 결합하여 민첩한 기업 아키텍처 구축","link":"/solutions/digital-transformation"},
    {"image":"/assets/images/solution-security.jpg","title":"사이버 보안","summary":"엔드포인트에서 클라우드까지, 핵심 자산을 보호하는 엔드투엔드 보호","link":"/solutions/security"},
    {"image":"/assets/images/solution-manufacturing.jpg","title":"스마트 제조","summary":"IoT 및 AI 주도 생산 최적화, 효율성 증대 및 비용 절감","link":"/solutions/smart-manufacturing"}
  ]},
  {"type":"case-study-showcase","title":"고객 성공 사례","cases":[
    {"logo":"/assets/logos/client-abc-bank.svg","name":"ABC 은행","industry":"금융 서비스","challenge":"급속한 디지털 뱅킹 개발을 지원할 수 없는 구형 코어 시스템","result":"시스템 성능 340% 향상, 시장 출시 시간 60% 단축","quote":"이것은 지난 10년 동안 가장 성공적인 IT 프로젝트로, 디지털 뱅킹을 위한 견고한 기반을 마련했습니다. — CIO","link":"/cases/abc-bank"}
  ],"viewMoreText":"더 많은 사례 보기","viewMoreLink":"/cases"},
  {"type":"stats-counter","background":"gradient-brand","stats":[
    {"value":"500+","label":"기업 고객"},
    {"value":"98%","label":"고객 유지율"},
    {"value":"150+","label":"전문 컨설턴트"},
    {"value":"20+","label":"년 경험"}
  ]},
  {"type":"cta-banner","title":"디지털 여정을 시작할 준비가 되셨나요?","description":"우리 전문 팀이 귀하의 비즈니스에 맞는 완벽한 솔루션을 설계합니다. 오늘 무료 상담을 예약하세요.","primaryCta":{"text":"상담 예약","link":"/contact/inquiry"},"secondaryCta":{"text":"브로셔 다운로드","link":"/downloads/company-brochure.pdf"}}
]',
CURRENT_TIMESTAMP FROM pages WHERE slug_key = 'corporate-home';

-- Page Contents: Solutions Landing (Korean)
INSERT OR IGNORE INTO page_contents (page_id, lang_code, title, slug_localized, seo_title, seo_desc, content_json, updated_at)
SELECT id, 'ko', '솔루션', 'solutions', '솔루션 | 디지털 혁신, 사이버 보안, 스마트 제조', '경쟁력을 높이기 위한 디지털 혁신, 사이버 보안 및 스마트 제조를 위한 기업 솔루션.',
'[
  {"type":"page-hero","title":"솔루션","subtitle":"전략에서 실행까지, 포괄적인 기업 솔루션을 제공합니다","breadcrumb":[{"label":"홈","link":"/"},{"label":"솔루션"}],"image":"/assets/images/hero-solutions.jpg"},
  {"type":"card-carousel","title":"서비스 살펴보기","subtitle":"비즈니스 요구 사항에 가장 적합한 솔루션을 선택하세요","cards":[
    {"image":"/assets/images/solution-dt.jpg","title":"디지털 혁신","summary":"클라우드 기술과 프로세스 재설계를 결합하여 민첩한 기업 아키텍처 구축","link":"/solutions/digital-transformation"},
    {"image":"/assets/images/solution-security.jpg","title":"사이버 보안","summary":"엔드포인트에서 클라우드까지, 핵심 자산을 보호하는 엔드투엔드 보호","link":"/solutions/security"},
    {"image":"/assets/images/solution-manufacturing.jpg","title":"스마트 제조","summary":"IoT 및 AI 주도 생산 최적화, 효율성 증대 및 비용 절감","link":"/solutions/smart-manufacturing"}
  ]},
  {"type":"feature-grid","title":"핵심 역량","items":[
    {"icon":"icon-certified","title":"전문 컨설턴트","description":"전문 자문 서비스를 제공하는 150명 이상의 업계 경험이 풍부한 기술 컨설턴트"},
    {"icon":"icon-experience","title":"애자일 배송","description":"Scrum/Kanban 애자일 개발을 사용하여 정시 프로젝트 납품 보장"},
    {"icon":"icon-support","title":"지속적인 지원","description":"시스템 안정성을 보장하는 24/7 연중무휴 기술 지원"}
  ]},
  {"type":"cta-banner","title":"적합한 솔루션을 찾을 수 없나요?","description":"컨설턴트가 귀하의 요구에 맞는 맞춤형 솔루션을 설계해 드립니다","primaryCta":{"text":"문의하기","link":"/contact/inquiry"}}
]',
CURRENT_TIMESTAMP FROM pages WHERE slug_key = 'solutions';

-- Page Contents: Solutions Detail (Korean)
INSERT OR IGNORE INTO page_contents (page_id, lang_code, title, slug_localized, seo_title, seo_desc, content_json, updated_at)
SELECT id, 'ko', '디지털 혁신 솔루션', 'digital-transformation', '디지털 혁신 솔루션 | 클라우드 마이그레이션, 프로세스 자동화', '클라우드 마이그레이션에서 프로세스 자동화 및 데이터 기반 의사 결정에 이르기까지 엔드투엔드 혁신 서비스를 제공합니다.',
'[
  {"type":"page-hero","title":"디지털 혁신 솔루션","subtitle":"클라우드 마이그레이션에서 프로세스 자동화 및 데이터 기반 의사 결정에 이르기까지 엔드투엔드 혁신 서비스 제공","breadcrumb":[{"label":"홈","link":"/"},{"label":"솔루션","link":"/solutions"},{"label":"디지털 혁신"}],"image":"/assets/images/hero-solutions.jpg"},
  {"type":"content-with-image","imagePosition":"right","title":"이러한 문제에 직면하고 계십니까?","items":["🔴 비즈니스 혁신 수요를 지원할 수 없는 레거시 시스템의 높은 유지 보수 비용","🔴 부서 간 심각한 정보 사일로로 인한 데이터 통합의 어려움","🔴 팀 생산성을 제한하는 지루한 수동 프로세스","🔴 디지털 인재 부족 및 불명확한 혁신 로드맵"],"image":"/assets/images/challenges-illustration.svg"},
  {"type":"timeline-steps","title":"서비스 프로세스","subtitle":"성공적인 프로젝트 납품을 보장하는 체계적인 방법론","steps":[
    {"number":"01","title":"발견 및 평가","description":"비즈니스 목표, 기존 IT 환경 및 고충 사항에 대한 심층 분석","duration":"2-3주"},
    {"number":"02","title":"로드맵 계획","description":"평가 결과를 기반으로 명확한 KPI가 포함된 단계별 구현 계획 수립","duration":"2-4주"},
    {"number":"03","title":"구현","description":"각 단계에서 검증 및 조정이 포함된 반복적인 전달을 통한 애자일 개발"},
    {"number":"04","title":"출시 및 최적화","description":"라이브 지원 및 데이터 통찰력을 기반으로 한 지속적인 최적화"}
  ]},
  {"type":"faq-accordion","title":"자주 묻는 질문","items":[
    {"question":"디지털 혁신 프로젝트는 보통 얼마나 걸리나요?","answer":"일정은 프로젝트 범위와 복잡성에 따라 다릅니다. 기본 클라우드 마이그레이션 프로젝트는 일반적으로 3-6개월이 소요되는 반면, 대규모 다중 시스템 통합 프로젝트는 12-18개월이 소요될 수 있습니다. 평가 단계에서 자세한 일정 계획을 제공합니다."},
    {"question":"혁신 중 비즈니스 연속성을 어떻게 보장합니까?","answer":"포괄적인 롤백 메커니즘이 포함된 단계별 마이그레이션 전략을 사용합니다. 중요한 시스템은 업무 외 시간에 전환되며 전담 팀이 24시간 모니터링하여 비즈니스 중단이 없도록 보장합니다."},
    {"question":"구현 후 어떤 지원을 제공합니까?","answer":"표준 업무 시간(8x5) 및 24/7 옵션을 포함하여 시스템 모니터링, 문제 해결, 성능 조정 및 정기 상태 확인 보고서를 다루는 여러 지원 계층을 제공합니다."}
  ]},
  {"type":"cta-banner","title":"전문가와 상담하세요","description":"아래 양식을 작성해 주시면 솔루션 컨설턴트가 영업일 기준 1일 이내에 연락 드리겠습니다","primaryCta":{"text":"시작하기","link":"/contact/inquiry"}}
]',
CURRENT_TIMESTAMP FROM pages WHERE slug_key = 'solutions/digital-transformation';

-- Page Contents: Cases (Korean)
INSERT OR IGNORE INTO page_contents (page_id, lang_code, title, slug_localized, seo_title, seo_desc, content_json, updated_at)
SELECT id, 'ko', '사례 연구', 'cases', '사례 연구 | 고객 성공 사례', '금융, 제조 및 소매 분야의 고객이 디지털 혁신과 측정 가능한 비즈니스 가치를 달성하도록 도운 방법을 살펴보세요.',
'[
  {"type":"page-hero","title":"사례 연구","subtitle":"기업 고객이 측정 가능한 비즈니스 가치를 창출하도록 돕는 방법 발견","breadcrumb":[{"label":"홈","link":"/"},{"label":"사례 연구"}],"image":"/assets/images/hero-cases.jpg"},
  {"type":"feature-grid","title":"산업별 찾아보기","items":[
    {"icon":"icon-certified","title":"금융 서비스","description":"은행, 보험 및 증권 회사가 코어 시스템을 현대화하도록 지원"},
    {"icon":"icon-experience","title":"제조업","description":"스마트 제조 및 공급망 디지털화 솔루션 구현"},
    {"icon":"icon-support","title":"소매업","description":"옴니채널 소매 플랫폼 및 고객 분석 구축"}
  ]},
  {"type":"case-cards","title":"주요 사례","cases":[
    {"image":"/assets/images/case-abc-bank.jpg","title":"ABC 은행 코어 시스템 현대화","summary":"30년 된 코어 시스템을 클라우드로 마이그레이션, 성능 340% 향상, 시장 출시 시간 60% 단축","tags":["금융 서비스","클라우드 마이그레이션"],"link":"/cases/abc-bank"},
    {"image":"/assets/images/case-xyz-corp.jpg","title":"XYZ 제조 스마트 팩토리","summary":"IoT 센서 및 AI 예지 보전 도입, 장비 고장 75% 감소, 생산성 28% 증가","tags":["제조업","스마트 팩토리"],"link":"/cases/xyz-corp"},
    {"image":"/assets/images/case-retail.jpg","title":"주요 소매 체인 RPA 구현","summary":"50개 이상의 자동화 봇 배포, 연간 12,000시간 이상의 인력 절감, 99.9% 정확도","tags":["소매업","프로세스 자동화"],"link":"/cases/retail-rpa"}
  ]},
  {"type":"stats-counter","background":"gradient-brand","stats":[
    {"value":"500+","label":"성공 사례"},
    {"value":"98%","label":"고객 만족도"},
    {"value":"50+","label":"서비스 산업"},
    {"value":"15","label":"서비스 국가"}
  ]},
  {"type":"cta-banner","title":"더 알고 싶으신가요?","description":"일대일 상담을 예약하시면 귀하의 요구 사항과 관련된 사례를 공유해 드립니다","primaryCta":{"text":"상담 예약","link":"/contact/inquiry"}}
]',
CURRENT_TIMESTAMP FROM pages WHERE slug_key = 'cases';

-- Page Contents: About Company (Korean)
INSERT OR IGNORE INTO page_contents (page_id, lang_code, title, slug_localized, seo_title, seo_desc, content_json, updated_at)
SELECT id, 'ko', '회사 소개', 'about', '회사 소개 | 디지털 혁신 리더', '우리는 20년 이상의 경험을 가진 선도적인 디지털 혁신 기업으로, 500개 이상의 기업 고객에게 서비스를 제공합니다.',
'[
  {"type":"page-hero","title":"회사 소개","subtitle":"기술 혁신을 통해 기업 성장을 주도하는 신뢰할 수 있는 디지털 혁신 파트너","breadcrumb":[{"label":"홈","link":"/"},{"label":"회사 소개"},{"label":"회사 프로필"}],"image":"/assets/images/hero-about.jpg"},
  {"type":"content-with-image","imagePosition":"right","title":"우리의 미션","items":["🎯 기업이 기술 혁신을 활용하여 경쟁력을 강화하도록 지원","🎯 엔드투엔드 디지털 혁신 솔루션 제공","🎯 디지털 인재를 개발하고 산업 업그레이드 추진","🎯 고객에게 가장 신뢰받는 장기 파트너가 되는 것"],"image":"/assets/images/mission-illustration.svg"},
  {"type":"timeline-steps","title":"이정표","subtitle":"지속적인 성장의 여정","steps":[
    {"number":"2005","title":"설립","description":"3명의 수석 IT 컨설턴트가 설립, 시스템 통합 서비스에 집중"},
    {"number":"2010","title":"클라우드 확장","description":"AWS 및 Azure 인증 파트너가 되어 클라우드 마이그레이션 서비스 시작"},
    {"number":"2018","title":"디지털 혁신","description":"디지털 혁신 컨설팅으로 전환, 동남아시아로 확장"},
    {"number":"2024","title":"AI 기반","description":"AI 랩 설립, 생성형 AI를 솔루션에 통합"}
  ]},
  {"type":"feature-grid","title":"핵심 가치","items":[
    {"icon":"icon-certified","title":"전문성","description":"최적의 솔루션을 제공하기 위해 지속적으로 기술 역량 향상"},
    {"icon":"icon-experience","title":"진실성","description":"신뢰와 정직을 바탕으로 한 장기적인 파트너십 구축"},
    {"icon":"icon-support","title":"혁신","description":"변화를 수용하고 혁신적인 사고로 문제 해결"}
  ]},
  {"type":"stats-counter","background":"gradient-brand","stats":[
    {"value":"500+","label":"서비스 고객"},
    {"value":"150+","label":"전문 컨설턴트"},
    {"value":"20+","label":"년 경험"},
    {"value":"15","label":"글로벌 지사"}
  ]},
  {"type":"cta-banner","title":"팀에 합류하세요","description":"우리는 더 나은 디지털 미래를 함께 만들어갈 재능 있는 인재를 찾고 있습니다","primaryCta":{"text":"채용 정보 보기","link":"/contact/careers"}}
]',
CURRENT_TIMESTAMP FROM pages WHERE slug_key = 'about/company';
