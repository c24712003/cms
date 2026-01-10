import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MenuService, MenuItem } from '../../core/services/menu.service';

@Component({
  selector: 'app-menu-builder',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <!-- Page Header -->
      <div class="admin-page-header">
        <h1 class="admin-page-title">{{ getTitle() }}</h1>
        <div class="flex gap-2">
          <button class="btn btn-secondary" (click)="reload()">Reload</button>
          <button class="btn btn-primary" (click)="save()">Save Menu</button>
        </div>
      </div>
      
      <!-- Menu Items Card -->
      <div class="card">
        <table class="data-table">
          <thead>
            <tr>
              <th class="w-1/3">Label</th>
              <th class="w-1/3">Link</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of items; let i = index">
              <td>
                <input [(ngModel)]="item.label" placeholder="Label" class="input-field" />
              </td>
              <td>
                <input [(ngModel)]="item.link" placeholder="Link" class="input-field font-mono text-blue-600" />
              </td>
              <td class="text-right">
                <div class="flex justify-end gap-2">
                  <button (click)="move(i, -1)" [disabled]="i === 0" class="btn btn-ghost btn-sm disabled:opacity-30">↑</button>
                  <button (click)="move(i, 1)" [disabled]="i === items.length - 1" class="btn btn-ghost btn-sm disabled:opacity-30">↓</button>
                  <button (click)="remove(i)" class="btn btn-ghost btn-sm text-red-500">×</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div class="p-4 border-t border-slate-100">
          <button (click)="add()" class="w-full py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-blue-400 hover:text-blue-500 transition-colors font-medium">
            + Add Menu Item
          </button>
        </div>
      </div>
    </div>
  `
})
export class MenuBuilderComponent implements OnInit {
  items: MenuItem[] = [];
  menuCode: string = 'main';

  constructor(
    private menuService: MenuService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.menuCode = params['code'] || 'main'; // Default to main if not provided (though route should enforce it)
      this.reload();
    });
  }

  getTitle(): string {
    return this.menuCode === 'main' ? 'Header Menu' :
      this.menuCode === 'footer' ? 'Footer Menu' :
        'Menu Builder';
  }

  reload() {
    this.menuService.getMenu(this.menuCode).subscribe({
      next: (menu) => { this.items = Array.isArray(menu.items_json) ? menu.items_json : []; },
      error: () => {
        // Default items for new menus
        if (this.menuCode === 'main') {
          this.items = [{ label: 'Home', link: '/home' }, { label: 'Contact', link: '/contact' }];
        } else {
          this.items = [];
        }
      }
    });
  }

  add() { this.items.push({ label: 'New Item', link: '/' }); }
  remove(index: number) { if (confirm('Delete?')) this.items.splice(index, 1); }
  move(index: number, direction: number) {
    const newIndex = index + direction;
    if (newIndex >= 0 && newIndex < this.items.length) {
      [this.items[index], this.items[newIndex]] = [this.items[newIndex], this.items[index]];
    }
  }
  save() { this.menuService.saveMenu(this.menuCode, this.items).subscribe(() => alert('Menu saved!')); }
}
