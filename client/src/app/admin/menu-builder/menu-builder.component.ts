import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuService, MenuItem } from '../../core/services/menu.service';

@Component({
  selector: 'app-menu-builder',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-bold text-slate-800">Menu Builder</h2>
        <div class="space-x-2">
            <button class="btn btn-secondary" (click)="reload()">Reload</button>
            <button class="btn btn-primary" (click)="save()">Save Menu</button>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <table class="w-full text-left border-collapse">
            <thead>
                <tr class="bg-slate-50 text-slate-600 uppercase text-xs tracking-wider border-b border-gray-200">
                    <th class="p-4 font-semibold w-1/3">Label</th>
                    <th class="p-4 font-semibold w-1/3">Link</th>
                    <th class="p-4 font-semibold text-right">Actions</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
                <tr *ngFor="let item of items; let i = index" class="hover:bg-gray-50 transition-colors">
                    <td class="p-4">
                        <input [(ngModel)]="item.label" placeholder="Label" class="input-field" />
                    </td>
                    <td class="p-4">
                        <input [(ngModel)]="item.link" placeholder="Link" class="input-field font-mono text-sm text-blue-600" />
                    </td>
                    <td class="p-4 text-right flex justify-end gap-2">
                         <button (click)="move(i, -1)" [disabled]="i === 0" class="p-2 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-slate-600 transition">↑</button>
                         <button (click)="move(i, 1)" [disabled]="i === items.length - 1" class="p-2 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-slate-600 transition">↓</button>
                         <button (click)="remove(i)" class="p-2 rounded bg-red-50 text-red-500 hover:bg-red-100 transition">✕</button>
                    </td>
                </tr>
            </tbody>
        </table>
        
        <div class="p-4 bg-slate-50 border-t border-gray-200">
            <button (click)="add()" class="w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 transition font-medium">
                + Add Menu Item
            </button>
        </div>
      </div>
    </div>
  `
})
export class MenuBuilderComponent implements OnInit {
  items: MenuItem[] = [];

  constructor(private menuService: MenuService) { }

  ngOnInit() {
    this.reload();
  }

  reload() {
    this.menuService.getMenu('main').subscribe({
      next: (menu) => {
        if (Array.isArray(menu.items_json)) {
          this.items = menu.items_json;
        } else {
          this.items = [];
        }
      },
      error: () => {
        this.items = [
          { label: 'Home', link: '/home' },
          { label: 'Contact', link: '/contact' }
        ];
      }
    });
  }

  add() {
    this.items.push({ label: 'New Item', link: '/' });
  }

  remove(index: number) {
    if (confirm('Delete this item?')) {
      this.items.splice(index, 1);
    }
  }

  move(index: number, direction: number) {
    const newIndex = index + direction;
    if (newIndex >= 0 && newIndex < this.items.length) {
      [this.items[index], this.items[newIndex]] = [this.items[newIndex], this.items[index]];
    }
  }

  save() {
    this.menuService.saveMenu('main', this.items).subscribe(() => {
      alert('Menu saved!');
    });
  }
}
