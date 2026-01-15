import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlockInstance, BlockSettings, ContentBlockManifest, AdvancedStyleOutput } from '../../../features/content-blocks/block.types';
import { BlockRegistryService } from '../../../features/content-blocks/block-registry.service';
import { PropertyPanelComponent } from '../../../features/content-blocks/editor/property-panel.component';
import { SettingsPanelComponent } from '../settings-panel/settings-panel.component';
import { AdvancedStylePanelComponent } from '../advanced-style-panel/advanced-style-panel.component';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';

@Component({
    selector: 'app-block-toolbar',
    standalone: true,
    imports: [CommonModule, PropertyPanelComponent, SettingsPanelComponent, AdvancedStylePanelComponent, TranslatePipe],
    template: `
    <div class="h-full flex flex-col bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 shadow-xl transition-all">
       <!-- Header -->
       <div class="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 shrink-0">
           <div>
               <h3 class="font-bold text-slate-700 dark:text-white text-sm">{{ getBlockDisplayName() }}</h3>
               <p class="text-[10px] text-slate-400 uppercase tracking-wider font-bold">{{ 'BLOCK_TOOLBAR_SETTINGS' | translate }}</p>
           </div>
           <button (click)="close.emit()" class="btn btn-xs btn-ghost text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
               <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
           </button>
       </div>

       <!-- Tabs -->
       <div class="grid grid-cols-4 p-1 m-4 rounded-lg bg-slate-100 dark:bg-slate-700/50 gap-1 border border-slate-200 dark:border-slate-700">
           <button class="px-2 py-2 text-xs font-medium rounded-md transition-all duration-200 focus:outline-none" 
              [class.bg-white]="activeTab === 'content'"
              [class.dark:bg-slate-600]="activeTab === 'content'"
              [class.text-slate-900]="activeTab === 'content'"
              [class.dark:text-white]="activeTab === 'content'"
              [class.shadow-sm]="activeTab === 'content'"
              [class.text-slate-500]="activeTab !== 'content'"
              [class.hover:text-slate-700]="activeTab !== 'content'"
              [class.dark:text-slate-400]="activeTab !== 'content'"
              (click)="activeTab = 'content'">{{ 'BLOCK_TAB_CONTENT' | translate }}</button>
           
           <button class="px-2 py-2 text-xs font-medium rounded-md transition-all duration-200 focus:outline-none" 
              [class.bg-white]="activeTab === 'styles'"
              [class.dark:bg-slate-600]="activeTab === 'styles'"
              [class.text-slate-900]="activeTab === 'styles'"
              [class.dark:text-white]="activeTab === 'styles'"
              [class.shadow-sm]="activeTab === 'styles'"
              [class.text-slate-500]="activeTab !== 'styles'"
              [class.hover:text-slate-700]="activeTab !== 'styles'"
              [class.dark:text-slate-400]="activeTab !== 'styles'"
              (click)="activeTab = 'styles'">{{ 'BLOCK_TAB_STYLES' | translate }}</button>
           
           <button class="px-2 py-2 text-xs font-medium rounded-md transition-all duration-200 focus:outline-none" 
              [class.bg-white]="activeTab === 'advanced'"
              [class.dark:bg-slate-600]="activeTab === 'advanced'"
              [class.text-slate-900]="activeTab === 'advanced'"
              [class.dark:text-white]="activeTab === 'advanced'"
              [class.shadow-sm]="activeTab === 'advanced'"
              [class.text-slate-500]="activeTab !== 'advanced'"
              [class.hover:text-slate-700]="activeTab !== 'advanced'"
              [class.dark:text-slate-400]="activeTab !== 'advanced'"
              (click)="activeTab = 'advanced'">{{ 'BLOCK_TAB_ADVANCED' | translate }}</button>
           
           <button class="px-2 py-2 text-xs font-medium rounded-md transition-all duration-200 focus:outline-none" 
              [class.bg-white]="activeTab === 'settings'"
              [class.dark:bg-slate-600]="activeTab === 'settings'"
              [class.text-slate-900]="activeTab === 'settings'"
              [class.dark:text-white]="activeTab === 'settings'"
              [class.shadow-sm]="activeTab === 'settings'"
              [class.text-slate-500]="activeTab !== 'settings'"
              [class.hover:text-slate-700]="activeTab !== 'settings'"
              [class.dark:text-slate-400]="activeTab !== 'settings'"
              (click)="activeTab = 'settings'">{{ 'BLOCK_TAB_SETTINGS' | translate }}</button>
       </div>

       <!-- Content Panel -->
       <div class="flex-1 overflow-hidden" *ngIf="activeTab === 'content'">
            <app-property-panel 
                class="block h-full"
                *ngIf="block && manifest"
                [schema]="manifest.schema"
                [model]="block.data"
                (modelChange)="onDataChange($event)">
            </app-property-panel>
       </div>

       <!-- Style Panel -->
       <div class="flex-1 flex flex-col overflow-hidden" *ngIf="activeTab === 'styles'">
            <!-- Viewport Toggle -->
            <div class="flex justify-center gap-2 p-2 border-b border-slate-100 shrink-0 dark:border-slate-700">
                <button class="btn btn-sm btn-square" [class.btn-primary]="viewport === 'desktop'" (click)="viewport = 'desktop'">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                </button>
                <button class="btn btn-sm btn-square" [class.btn-primary]="viewport === 'tablet'" (click)="viewport = 'tablet'">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                </button>
                <button class="btn btn-sm btn-square" [class.btn-primary]="viewport === 'mobile'" (click)="viewport = 'mobile'">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                </button>
            </div>

            <app-property-panel 
                class="block flex-1 min-h-0"
                *ngIf="block && manifest?.styleSchema"
                [schema]="manifest!.styleSchema"
                [model]="getCurrentStyles()"
                (modelChange)="onStyleChange($event)">
            </app-property-panel>
            
            <div *ngIf="!manifest?.styleSchema" class="p-8 text-center text-slate-400">
                <p>{{ 'BLOCK_NO_STYLE_OPTIONS' | translate }}</p>
            </div>
       </div>
       
       <!-- Advanced Style Panel -->
       <div class="flex-1 overflow-hidden" *ngIf="activeTab === 'advanced'">
            <app-advanced-style-panel
                class="block h-full"
                *ngIf="block"
                [customClasses]="block.styles?.customClasses || ''"
                [inlineStyles]="block.styles?.inlineStyles || ''"
                [customCss]="block.styles?.customCss || ''"
                (stylesChange)="onAdvancedStyleChange($event)">
            </app-advanced-style-panel>
       </div>
       
       <!-- Settings Panel -->
       <div class="flex-1 overflow-hidden" *ngIf="activeTab === 'settings'">
            <app-settings-panel
                class="block h-full"
                *ngIf="block"
                [blockSettings]="block.settings || {}"
                (settingsChange)="onSettingsChange($event)">
            </app-settings-panel>
       </div>

    </div>
  `
})
export class BlockToolbarComponent {
    @Input() block: BlockInstance | null = null;
    @Output() blockChange = new EventEmitter<BlockInstance>();
    @Output() close = new EventEmitter<void>();
    @Output() viewportChange = new EventEmitter<'desktop' | 'tablet' | 'mobile'>();

    activeTab: 'content' | 'styles' | 'advanced' | 'settings' = 'content';
    _viewport: 'desktop' | 'tablet' | 'mobile' = 'desktop';

    get viewport() { return this._viewport; }
    set viewport(v: 'desktop' | 'tablet' | 'mobile') {
        this._viewport = v;
        this.viewportChange.emit(v);
    }

    constructor(private registry: BlockRegistryService) { }

    get manifest(): ContentBlockManifest | undefined {
        if (!this.block) return undefined;
        return this.registry.getDefinition(this.block.type)?.manifest;
    }

    getBlockDisplayName(): string {
        return this.manifest?.displayName || this.block?.type || 'Block';
    }

    onDataChange(newData: Record<string, unknown>) {
        if (!this.block) return;
        this.blockChange.emit({
            ...this.block,
            data: newData
        });
    }

    getCurrentStyles() {
        if (!this.block || !this.block.styles) return {};
        return this.block.styles[this.viewport] || {};
    }

    onStyleChange(newStyles: Record<string, unknown>) {
        if (!this.block) return;

        const currentStyles = this.block.styles || {};

        this.blockChange.emit({
            ...this.block,
            styles: {
                ...currentStyles,
                [this.viewport]: newStyles
            }
        });
    }

    onSettingsChange(newSettings: BlockSettings) {
        if (!this.block) return;
        this.blockChange.emit({
            ...this.block,
            settings: newSettings
        });
    }

    onAdvancedStyleChange(advancedStyles: AdvancedStyleOutput) {
        if (!this.block) return;

        const currentStyles = this.block.styles || {};

        this.blockChange.emit({
            ...this.block,
            styles: {
                ...currentStyles,
                customClasses: advancedStyles.customClasses,
                inlineStyles: advancedStyles.inlineStyles,
                customCss: advancedStyles.customCss
            }
        });
    }
}

