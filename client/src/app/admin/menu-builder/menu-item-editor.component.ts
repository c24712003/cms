
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuItem } from '../../core/services/menu.service';

@Component({
    selector: 'app-menu-item-editor',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 flex flex-col"
         [class.translate-x-0]="isOpen"
         [class.translate-x-full]="!isOpen">
      
      <!-- Header -->
      <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <h3 class="font-bold text-lg text-slate-800">Edit Item</h3>
        <button (click)="close()" class="text-slate-400 hover:text-slate-600 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Body -->
      <div class="flex-1 overflow-y-auto p-6 space-y-6" *ngIf="item">
        
        <!-- Label -->
        <div class="form-group">
          <label class="block text-sm font-medium text-slate-700 mb-1">Navigation Label</label>
          <input [(ngModel)]="item.label" class="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all" placeholder="e.g. Home">
        </div>

        <!-- Link Type -->
        <div class="form-group">
          <label class="block text-sm font-medium text-slate-700 mb-1">Link Type</label>
          <div class="flex gap-4">
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="radio" [(ngModel)]="item.link_type" value="internal" class="text-blue-600 focus:ring-blue-500">
              <span>Internal Page</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="radio" [(ngModel)]="item.link_type" value="external" class="text-blue-600 focus:ring-blue-500">
              <span>External URL</span>
            </label>
          </div>
        </div>

        <!-- Link / URL -->
        <div class="form-group">
          <label class="block text-sm font-medium text-slate-700 mb-1">
            {{ item.link_type === 'external' ? 'External URL' : 'Internal Path' }}
          </label>
          <input [(ngModel)]="item.link" 
                 [placeholder]="item.link_type === 'external' ? 'https://example.com' : '/about'"
                 class="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all font-mono text-sm text-blue-600">
          <p class="mt-1 text-xs text-slate-500" *ngIf="item.link_type === 'external'">Must include http:// or https://</p>
        </div>

        <!-- Target -->
        <div class="form-group">
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" 
                   [checked]="item.target === '_blank'" 
                   (change)="item.target = $any($event.target).checked ? '_blank' : '_self'"
                   class="rounded text-blue-600 focus:ring-blue-500">
            <span class="text-sm font-medium text-slate-700">Open in New Tab</span>
          </label>
        </div>
        
        <!-- Icon (Optional) -->
        <div class="form-group">
          <label class="block text-sm font-medium text-slate-700 mb-1">Icon Code (Optional)</label>
          <input [(ngModel)]="item.icon" class="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all" placeholder="e.g. fas fa-home">
        </div>

        <!-- Visibility -->
        <div class="form-group text-right">
           <label class="inline-flex items-center gap-2 cursor-pointer bg-slate-100 px-3 py-1.5 rounded-full hover:bg-slate-200 transition-colors">
            <span class="text-sm font-medium text-slate-700">Visible</span>
            <div class="relative inline-block w-10 h-6 align-middle select-none transition duration-200 ease-in">
                <input type="checkbox" [(ngModel)]="item.is_visible" class="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer text-blue-500"/>
                <label class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
            </div>
          </label>
        </div>

      </div>

      <!-- Footer -->
      <div class="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
        <button (click)="close()" class="px-4 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-700 transition-colors font-medium">Done</button>
      </div>
    </div>
    
    <!-- Backdrop -->
    <div *ngIf="isOpen" (click)="close()" class="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"></div>
  `
})
export class MenuItemEditorComponent {
    @Input() item: MenuItem | null = null;
    @Input() isOpen = false;
    @Output() closeEvent = new EventEmitter<void>();

    close() {
        this.closeEvent.emit();
    }
}
