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
      
      <div class="menu-list">
        <table>
            <thead>
                <tr>
                    <th>Label</th>
                    <th>Link (e.g. /home)</th>
                    <th style="width: 150px">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr *ngFor="let item of items; let i = index">
                    <td><input [(ngModel)]="item.label" placeholder="Label" /></td>
                    <td><input [(ngModel)]="item.link" placeholder="Link" /></td>
                    <td class="actions-cell">
                        <button class="btn-sm" (click)="move(i, -1)" [disabled]="i === 0">↑</button>
                        <button class="btn-sm" (click)="move(i, 1)" [disabled]="i === items.length - 1">↓</button>
                        <button class="btn-sm danger" (click)="remove(i)">✖</button>
                    </td>
                </tr>
            </tbody>
        </table>
        
        <div class="add-bar">
            <button (click)="add()">+ Add Item</button>
        </div>
      </div>

      <div class="main-actions">
        <button class="btn-primary" (click)="save()">Save Menu</button>
        <button class="btn-secondary" (click)="reload()">Reload</button>
      </div>

    </div>
  `,
  styles: [`
    .menu-builder { padding: 20px; max-width: 800px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    th, td { padding: 10px; border: 1px solid #ddd; text-align: left; }
    th { background: #f9f9f9; }
    input { width: 100%; padding: 5px; box-sizing: border-box; }
    
    .actions-cell { display: flex; gap: 5px; justify-content: center; }
    .btn-sm { padding: 2px 8px; cursor: pointer; background: #eee; border: 1px solid #ccc; border-radius: 3px; }
    .btn-sm.danger { color: #e74c3c; border-color: #e74c3c; background: white; }
    
    .add-bar { margin-bottom: 20px; }
    .add-bar button { width: 100%; padding: 10px; background: #2ecc71; color: white; border: none; cursor: pointer; border-radius: 4px; }
    
    .main-actions button { padding: 10px 20px; margin-right: 10px; border: none; border-radius: 4px; cursor: pointer; font-size: 1rem; }
    .btn-primary { background: #3498db; color: white; }
    .btn-secondary { background: #95a5a6; color: white; }
  `]
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
    if (confirm('Are you sure?')) {
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
      alert('Menu saved! Refresh public site to see changes.');
    });
  }
}
