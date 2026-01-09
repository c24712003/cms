import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuService, MenuItem } from '../../core/services/menu.service';

@Component({
    selector: 'app-menu-builder',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="menu-builder">
      <h2>Menu Builder (Main)</h2>
      
      <div class="editor">
        <label>Menu Items (JSON Format):</label>
        <textarea [(ngModel)]="jsonContent" rows="15" [class.invalid]="invalidJson"></textarea>
        <div class="error" *ngIf="invalidJson">Invalid JSON syntax</div>
      </div>

      <div class="actions">
        <button (click)="save()">Save Menu</button>
        <button (click)="reset()" class="secondary">Reset</button>
      </div>

      <div class="preview">
        <h4>Preview structure:</h4>
        <pre>{{ jsonContent | json }}</pre>
      </div>
    </div>
  `,
    styles: [`
    .menu-builder { padding: 20px; max-width: 800px; }
    textarea { width: 100%; font-family: monospace; padding: 10px; border: 1px solid #ddd; }
    textarea.invalid { border-color: red; }
    .error { color: red; }
    .actions { margin-top: 10px; }
    button { padding: 10px 20px; background: #3498db; color: white; border: none; cursor: pointer; margin-right: 10px; }
    button.secondary { background: #95a5a6; }
    .preview { margin-top: 20px; background: #f8f9fa; padding: 10px; border-radius: 5px; }
  `]
})
export class MenuBuilderComponent implements OnInit {
    jsonContent = '';
    invalidJson = false;

    constructor(private menuService: MenuService) { }

    ngOnInit() {
        this.menuService.getMenu('main').subscribe({
            next: (menu) => {
                // If already object, stringify with indent
                this.jsonContent = JSON.stringify(menu.items_json, null, 2);
            },
            error: () => {
                // Default
                this.jsonContent = '[\n  { "label": "Home", "link": "/home" }\n]';
            }
        });
    }

    save() {
        try {
            const items = JSON.parse(this.jsonContent);
            this.invalidJson = false;
            this.menuService.saveMenu('main', items).subscribe(() => {
                alert('Menu saved!');
            });
        } catch (e) {
            this.invalidJson = true;
            alert('Invalid JSON! Please fix errors before saving.');
        }
    }

    reset() {
        this.ngOnInit();
    }
}
