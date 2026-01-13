import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';

@Component({
    selector: 'app-page-settings-pane',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslatePipe],
    template: `
    <div class="h-full overflow-y-auto bg-slate-50 dark:bg-slate-900">
      <div class="max-w-4xl mx-auto p-6 lg:p-8">
        
        <!-- Header -->
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-slate-800 dark:text-white mb-2">
            {{ 'PAGE_SETTINGS_HEADER' | translate }}
          </h2>
          <p class="text-slate-500 dark:text-slate-400">
            Configure page metadata and display options
          </p>
        </div>
        
        <!-- Main Settings Card -->
        <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          
          <!-- Basic Info Section -->
          <div class="p-6 border-b border-slate-100 dark:border-slate-700">
            <h3 class="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
              Basic Information
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Page Title -->
              <div class="md:col-span-2">
                <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  {{ 'PAGE_TITLE_LABEL' | translate }}
                </label>
                <input 
                  [ngModel]="content.title"
                  (ngModelChange)="onContentChange('title', $event)"
                  class="w-full px-4 py-3 text-lg font-medium rounded-lg border border-slate-200 dark:border-slate-600 
                         bg-white dark:bg-slate-700 text-slate-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Enter page title" />
              </div>
              
              <!-- URL Slug -->
              <div>
                <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  {{ 'PAGE_URL_SLUG_LABEL' | translate }}
                </label>
                <div class="flex items-center rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 overflow-hidden">
                  <span class="px-3 py-3 bg-slate-100 dark:bg-slate-600 text-slate-500 dark:text-slate-400 text-sm font-mono border-r border-slate-200 dark:border-slate-600">
                    /{{ activeLang }}/
                  </span>
                  <input 
                    [ngModel]="content.slug_localized"
                    (ngModelChange)="onContentChange('slug_localized', $event)"
                    class="flex-1 px-3 py-3 bg-transparent text-slate-900 dark:text-white font-mono text-sm border-0 focus:ring-0"
                    placeholder="page-url-slug" />
                </div>
              </div>
              
              <!-- Theme Selector -->
              <div>
                <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Theme
                </label>
                <select 
                  [ngModel]="activeThemeId"
                  (ngModelChange)="themeChange.emit($event)"
                  class="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 
                         bg-white dark:bg-slate-700 text-slate-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none cursor-pointer">
                  <option [ngValue]="null">No Theme (Default)</option>
                  @for (theme of themes; track theme.id) {
                    <option [value]="theme.id">
                      {{ theme.name }} {{ theme.is_active ? '(Active)' : '' }}
                    </option>
                  }
                </select>
              </div>
            </div>
          </div>
          
          <!-- Status Section -->
          <div class="p-6 bg-slate-50/50 dark:bg-slate-800/50">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <span class="w-3 h-3 rounded-full bg-amber-400 animate-pulse"></span>
                <span class="text-sm font-medium text-slate-600 dark:text-slate-400">
                  {{ 'STATUS_DRAFT' | translate }}
                </span>
              </div>
              <div class="text-xs text-slate-400 dark:text-slate-500">
                Last saved: --
              </div>
            </div>
          </div>
          
        </div>
        
      </div>
    </div>
  `
})
export class PageSettingsPaneComponent {
    @Input() content: any = {};
    @Input() activeLang: string = '';
    @Input() activeThemeId: number | null = null;
    @Input() themes: any[] = [];

    @Output() contentChange = new EventEmitter<{ field: string; value: any }>();
    @Output() themeChange = new EventEmitter<number | null>();

    onContentChange(field: string, value: any) {
        this.contentChange.emit({ field, value });
    }
}
