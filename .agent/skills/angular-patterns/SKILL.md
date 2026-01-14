---
name: Angular 最佳實踐
description: Angular 21 開發模式和最佳實踐
---

# Angular 最佳實踐技能

## Signal 模式

### 基本用法
```typescript
// 狀態 Signal
readonly count = signal(0);

// 計算 Signal
readonly doubled = computed(() => this.count() * 2);

// 更新
this.count.set(5);
this.count.update(v => v + 1);
```

### 資料載入模式
```typescript
readonly data = signal<Data | null>(null);
readonly loading = signal(false);
readonly error = signal<string | null>(null);

async loadData() {
  this.loading.set(true);
  this.error.set(null);
  try {
    const result = await this.api.getData();
    this.data.set(result);
  } catch (e) {
    this.error.set('載入失敗');
  } finally {
    this.loading.set(false);
  }
}
```

---

## Standalone Components

```typescript
@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslatePipe,
  ],
  template: `...`
})
export class MyComponent {
  private service = inject(MyService);
}
```

---

## 新控制流

```html
<!-- 條件渲染 -->
@if (condition) {
  <div>True</div>
} @else {
  <div>False</div>
}

<!-- 迴圈 -->
@for (item of items; track item.id) {
  <div>{{ item.name }}</div>
} @empty {
  <div>無資料</div>
}

<!-- Switch -->
@switch (status) {
  @case ('active') { <span>活躍</span> }
  @case ('inactive') { <span>停用</span> }
  @default { <span>未知</span> }
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

## 依賴注入

```typescript
// ✅ 推薦: inject()
private service = inject(MyService);
private router = inject(Router);

// ⚠️ 舊方式 (仍可用)
constructor(private service: MyService) {}
```
