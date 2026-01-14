# CMS 編碼規範

## 🎯 核心原則

1. **一致性** - 保持代碼風格統一
2. **可讀性** - 代碼應該自我解釋
3. **可維護性** - 模組化、低耦合

---

## TypeScript 規範

### 命名
- **類別/介面**: PascalCase (`PageService`, `ContentBlock`)
- **函數/變數**: camelCase (`getPageById`, `currentUser`)
- **常數**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **文件**: kebab-case (`page-editor.component.ts`)

### 類型
```typescript
// ✅ 明確類型宣告
function getUser(id: number): Promise<User> { }

// ❌ 避免 any
function getData(id: any): any { }
```

---

## Angular 規範

### 組件結構
```typescript
@Component({
  selector: 'app-feature-name',
  standalone: true,           // 使用 Standalone Components
  imports: [CommonModule],
  template: `...`,            // 小型模板使用 inline
  templateUrl: './...',       // 大型模板使用外部文件
})
export class FeatureNameComponent {
  // 1. 注入依賴
  private service = inject(MyService);
  
  // 2. Signals
  data = signal<Data | null>(null);
  
  // 3. Computed
  computed = computed(() => this.data()?.value);
  
  // 4. 生命週期
  ngOnInit() { }
  
  // 5. 公開方法
  submit() { }
  
  // 6. 私有方法
  private validate() { }
}
```

### Signal 使用
```typescript
// ✅ 優先使用 Signals
readonly count = signal(0);
readonly doubled = computed(() => this.count() * 2);

// ✅ Effect 用於副作用
effect(() => console.log('Count:', this.count()));
```

### 模板語法
```html
<!-- ✅ 使用新的控制流語法 -->
@if (condition) {
  <div>...</div>
} @else {
  <div>...</div>
}

@for (item of items; track item.id) {
  <div>{{ item.name }}</div>
}
```

---

## Signal-based Input/Output

```typescript
// ✅ 推薦: input()
private text = input<string>();
// ✅ 推薦: out put()
private number = output<number>();

// ⚠️ 舊方式 (仍可用)
 @Input() text: string = '';
 @Output() number = new EventEmitter<number>();
```
---

## API 規範

### 路由命名
```
GET    /api/pages         # 列表
GET    /api/pages/:id     # 詳情
POST   /api/pages         # 創建
PUT    /api/pages/:id     # 更新
DELETE /api/pages/:id     # 刪除
```

### 回應格式
```typescript
// 成功
{ success: true, data: {...} }

// 錯誤
{ success: false, error: "錯誤訊息" }
```

---

## 國際化規範

### 翻譯 Key 命名
```
SECTION_COMPONENT_LABEL
```
例如: `ADMIN_HEADER_TITLE`, `PAGE_EDITOR_SAVE_BTN`

### 使用方式
```html
<!-- 模板中 -->
{{ 'KEY' | translate }}

<!-- TypeScript 中 -->
this.i18n.t('KEY');
```

---

## Git 規範

### Commit 格式
```
<type>(<scope>): <subject>

feat(pages): add page duplication feature
fix(editor): resolve block drag issue
docs(readme): update installation guide
```

### 類型
- `feat`: 新功能
- `fix`: Bug 修復
- `docs`: 文檔更新
- `style`: 格式調整
- `refactor`: 重構
- `test`: 測試相關
- `chore`: 工具/配置
