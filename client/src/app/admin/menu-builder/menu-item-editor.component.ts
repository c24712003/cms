
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuItem } from '../../core/services/menu.service';
import { TranslatePipe } from '../../core/pipes/translate.pipe';

@Component({
  selector: 'app-menu-item-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  template: `
    <div class="fixed inset-y-0 right-0 w-96 bg-white dark:bg-slate-800 shadow-2xl transform transition-transform duration-300 ease-in-out z-50 flex flex-col"
         [class.translate-x-0]="isOpen"
         [class.translate-x-full]="!isOpen">
      
      <!-- Header -->
      <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
        <h3 class="font-bold text-lg text-slate-800 dark:text-white">{{ 'MENU_ITEM_EDIT_TITLE' | translate }}</h3>
        <button (click)="close()" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Body -->
      <div class="flex-1 overflow-y-auto p-6 space-y-6" *ngIf="item">
        
        <!-- Label -->
        <div class="form-group">
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{{ 'LABEL_NAV_LABEL' | translate }}</label>
          <input [(ngModel)]="item.label" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all bg-white dark:bg-slate-700 text-slate-800 dark:text-white" [placeholder]="'PLACEHOLDER_NAV_LABEL' | translate">
        </div>

        <!-- Translation Key (Optional) -->
        <div class="form-group">
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
             Translation Key (Optional)
             <span class="text-xs text-slate-400 font-normal ml-1">Overrides label if translation found</span>
          </label>
          <div class="flex gap-2">
              <span class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-500 text-sm">
                <i class="fas fa-language"></i>
              </span>
              <input [(ngModel)]="item.labelKey" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-r-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all bg-white dark:bg-slate-700 text-slate-800 dark:text-white font-mono text-sm" placeholder="e.g. NAV_HOME">
          </div>
        </div>

        <!-- Standard Link Fields (Hidden for Widgets) -->
        <ng-container *ngIf="item.link_type && !item.link_type.includes('widget')">
            <!-- Link Type -->
            <div class="form-group">
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{{ 'LABEL_LINK_TYPE' | translate }}</label>
            <div class="flex gap-4">
                <label class="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                <input type="radio" [(ngModel)]="item.link_type" value="internal" class="text-blue-600 focus:ring-blue-500">
                <span>{{ 'LABEL_INTERNAL_PAGE' | translate }}</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                <input type="radio" [(ngModel)]="item.link_type" value="external" class="text-blue-600 focus:ring-blue-500">
                <span>{{ 'LABEL_EXTERNAL_URL' | translate }}</span>
                </label>
            </div>
            </div>

            <!-- Link / URL -->
            <div class="form-group">
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                {{ (item.link_type === 'external' ? 'LABEL_EXTERNAL_URL' : 'LABEL_INTERNAL_PATH') | translate }}
            </label>
            <input [(ngModel)]="item.link" 
                    [placeholder]="item.link_type === 'external' ? 'https://example.com' : '/about'"
                    class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all font-mono text-sm text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-700">
            <p class="mt-1 text-xs text-slate-500 dark:text-slate-400" *ngIf="item.link_type === 'external'">{{ 'TIP_EXTERNAL_URL' | translate }}</p>
            </div>

            <!-- Target -->
            <div class="form-group">
            <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" 
                    [checked]="item.target === '_blank'" 
                    (change)="item.target = $any($event.target).checked ? '_blank' : '_self'"
                    class="rounded text-blue-600 focus:ring-blue-500">
                <span class="text-sm font-medium text-slate-700 dark:text-slate-300">{{ 'LABEL_OPEN_NEW_TAB' | translate }}</span>
            </label>
            </div>
            
            <!-- Icon (Optional) -->
            <div class="form-group">
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{{ 'LABEL_ICON_CODE' | translate }}</label>
            <input [(ngModel)]="item.icon" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all bg-white dark:bg-slate-700 text-slate-800 dark:text-white" [placeholder]="'PLACEHOLDER_ICON' | translate">
            </div>
        </ng-container>

        <!-- Widget Info -->
        <div *ngIf="item.link_type && item.link_type.includes('widget')" class="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded p-4 text-sm text-blue-700 dark:text-blue-300">
            <p class="font-bold mb-1">Widget Configured</p>
            <p>This item represents a functional block in your footer. You can only customize its display label here. Content is managed in system settings.</p>
        </div>

        <!-- Visibility -->
        <div class="form-group text-right">
           <label class="inline-flex items-center gap-2 cursor-pointer bg-slate-100 dark:bg-slate-700 px-3 py-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
            <span class="text-sm font-medium text-slate-700 dark:text-slate-300">{{ 'LABEL_VISIBLE' | translate }}</span>
            <div class="relative inline-block w-10 h-6 align-middle select-none transition duration-200 ease-in">
                <input type="checkbox" [(ngModel)]="item.is_visible" class="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer text-blue-500"/>
                <label class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
            </div>
          </label>
        </div>

      </div>

      <!-- Footer -->
      <div class="px-6 py-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex justify-end gap-2">
        <button (click)="close()" class="px-4 py-2 bg-slate-800 dark:bg-blue-600 text-white rounded-md hover:bg-slate-700 dark:hover:bg-blue-700 transition-colors font-medium">{{ 'BTN_DONE' | translate }}</button>
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
