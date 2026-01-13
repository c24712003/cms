import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';

export type EditorTab = 'settings' | 'canvas' | 'seo';

@Component({
    selector: 'app-editor-tab-bar',
    standalone: true,
    imports: [CommonModule, TranslatePipe],
    template: `
    <!-- Desktop: Vertical Left Tab Bar -->
    <nav class="hidden md:flex flex-col w-14 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 py-4 gap-1 shrink-0">
      @for (tab of tabs; track tab.id) {
        <button 
          (click)="selectTab(tab.id)"
          [class.bg-blue-50]="activeTab === tab.id"
          [class.dark:bg-blue-900/30]="activeTab === tab.id"
          [class.text-blue-600]="activeTab === tab.id"
          [class.dark:text-blue-400]="activeTab === tab.id"
          [class.text-slate-500]="activeTab !== tab.id"
          [class.dark:text-slate-400]="activeTab !== tab.id"
          [class.hover:bg-slate-50]="activeTab !== tab.id"
          [class.dark:hover:bg-slate-700]="activeTab !== tab.id"
          class="w-full flex flex-col items-center justify-center py-3 px-2 transition-all duration-200 relative group"
          [attr.title]="tab.label | translate"
          [attr.aria-selected]="activeTab === tab.id"
          role="tab">
          
          <!-- Active Indicator -->
          <div *ngIf="activeTab === tab.id" 
               class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full"></div>
          
          <!-- Icon -->
          <span class="text-lg mb-1">{{ tab.icon }}</span>
          
          <!-- Label (hidden by default, show on hover via tooltip) -->
          <span class="text-[10px] font-medium uppercase tracking-wide leading-tight text-center">
            {{ tab.shortLabel }}
          </span>
          
          <!-- Tooltip -->
          <div class="absolute left-full ml-2 px-2 py-1 bg-slate-900 dark:bg-slate-700 text-white text-xs rounded 
                      opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
            {{ tab.label | translate }}
          </div>
        </button>
      }
    </nav>
    
    <!-- Mobile: Bottom Horizontal Tab Bar -->
    <nav class="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 
                flex items-center justify-around h-14 safe-area-bottom">
      @for (tab of tabs; track tab.id) {
        <button 
          (click)="selectTab(tab.id)"
          [class.text-blue-600]="activeTab === tab.id"
          [class.dark:text-blue-400]="activeTab === tab.id"
          [class.text-slate-500]="activeTab !== tab.id"
          [class.dark:text-slate-400]="activeTab !== tab.id"
          class="flex-1 flex flex-col items-center justify-center py-2 transition-colors relative"
          [attr.aria-selected]="activeTab === tab.id"
          role="tab">
          
          <!-- Active Indicator -->
          <div *ngIf="activeTab === tab.id" 
               class="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-blue-500 rounded-b-full"></div>
          
          <span class="text-lg">{{ tab.icon }}</span>
          <span class="text-[10px] font-medium">{{ tab.label | translate }}</span>
        </button>
      }
    </nav>
  `,
    styles: [`
    :host {
      display: contents;
    }
    
    /* iOS Safe Area */
    .safe-area-bottom {
      padding-bottom: env(safe-area-inset-bottom, 0);
    }
  `]
})
export class EditorTabBarComponent {
    @Input() activeTab: EditorTab = 'canvas';
    @Output() tabChange = new EventEmitter<EditorTab>();

    tabs: { id: EditorTab; icon: string; label: string; shortLabel: string }[] = [
        { id: 'settings', icon: '⚙️', label: 'TAB_SETTINGS', shortLabel: 'SET' },
        { id: 'canvas', icon: '🎨', label: 'TAB_CANVAS', shortLabel: 'EDIT' },
        { id: 'seo', icon: '📊', label: 'TAB_SEO', shortLabel: 'SEO' }
    ];

    selectTab(tabId: EditorTab) {
        this.activeTab = tabId;
        this.tabChange.emit(tabId);
    }

    // Keyboard shortcuts: Ctrl+1/2/3
    @HostListener('document:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        if (event.ctrlKey || event.metaKey) {
            const keyToTab: Record<string, EditorTab> = {
                '1': 'settings',
                '2': 'canvas',
                '3': 'seo'
            };

            if (keyToTab[event.key]) {
                event.preventDefault();
                this.selectTab(keyToTab[event.key]);
            }
        }
    }
}
