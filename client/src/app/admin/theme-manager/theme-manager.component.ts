import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { I18nService } from '../../core/services/i18n.service';
import { TranslatePipe } from '../../core/pipes/translate.pipe';


interface Theme {
    id: number;
    name: string;
    template_id: string;
    is_active: number; // 0 or 1
    created_at: string;
    page_count: number;
    pages: { id: number, slug: string, title: string }[];
}

@Component({
    selector: 'app-theme-manager',
    standalone: true,
    imports: [CommonModule, DatePipe, RouterModule, TranslatePipe, FormsModule],
    template: `
    <div class="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 class="text-3xl font-bold font-display text-slate-900 dark:text-white mb-2">{{ 'THEME_MANAGER_TITLE' | translate }}</h1>
           <p class="text-slate-500 dark:text-slate-400">{{ 'THEME_MANAGER_SUBTITLE' | translate }}</p>
        </div>
        <button class="btn btn-primary flex items-center gap-2" (click)="openCreateModal()">
            <span class="text-xl leading-none">+</span>
            <span>{{ 'BTN_CREATE_NEW_THEME' | translate }}</span>
        </button>
      </div>

      <!-- Themes Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (theme of themes(); track theme.id) {
          <div class="group relative bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border transition-all duration-300"
               [ngClass]="theme.is_active ? 'border-blue-500 shadow-lg shadow-blue-500/10 ring-2 ring-blue-500/20' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'">
            
            <!-- Active Badge -->
            @if (theme.is_active) {
                <div class="absolute top-4 right-4 z-10 bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                    {{ 'THEME_ACTIVE_BADGE' | translate }}
                </div>
            }

            <div class="p-6">
                <!-- Icon/Avatar -->
                <div class="w-12 h-12 rounded-xl mb-4 flex items-center justify-center text-xl font-bold"
                     [ngClass]="theme.is_active ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'">
                    {{ theme.name.charAt(0).toUpperCase() }}
                </div>

                <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-1">{{ theme.name }}</h3>
                <p class="text-sm text-slate-500 dark:text-slate-400 mb-4">{{ 'THEME_TEMPLATE_LABEL' | translate }} {{ theme.template_id }}</p>

                <div class="flex items-center gap-4 text-xs font-medium text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-700 pt-4 mb-4">
                    <span class="flex items-center gap-1">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                        {{ theme.page_count }} {{ 'THEME_PAGES_COUNT' | translate }}
                    </span>
                    <span class="flex items-center gap-1">
                         <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        {{ theme.created_at | date:'mediumDate' }}
                    </span>
                </div>

                <!-- Page List Preview -->
                <div class="flex flex-wrap gap-2 mb-6">
                    @for (page of theme.pages; track page.slug) {
                        <span class="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300">
                            /{{ page.slug }}
                        </span>
                    }
                </div>

                <!-- Actions -->
                <div class="flex gap-3">
                    <a [routerLink]="['/admin/themes', theme.id, 'editor']" 
                       class="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-center flex items-center justify-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                        {{ 'THEME_BTN_CUSTOMIZE' | translate }}
                    </a>
                    @if (!theme.is_active) {
                        <button (click)="activateTheme(theme)" 
                            [disabled]="isLoading()"
                            class="flex-1 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50">
                            {{ isLoading() ? ('THEME_BTN_ACTIVATING' | translate) : ('THEME_BTN_ACTIVATE' | translate) }}
                        </button>
                         <button (click)="deleteTheme(theme)"
                            [disabled]="isLoading()" 
                            class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50">
                             <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                         </button>
                    } @else {
                        <button disabled class="flex-1 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold text-sm cursor-default border border-blue-100 dark:border-blue-800">
                            {{ 'THEME_BTN_ACTIVE' | translate }}
                        </button>
                    }
                </div>
            </div>
          </div>
        } @empty {
             <div class="col-span-full py-20 text-center bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
                <p class="text-slate-500 dark:text-slate-400 mb-4">{{ 'THEME_NO_THEMES' | translate }}</p>
                <div class="text-sm text-slate-400">{{ 'THEME_CREATE_HINT' | translate }}</div>
            </div>
        }
      </div>
      
      <!-- Create Theme Modal -->
      <div *ngIf="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden animate-scale-in">
            
            <!-- Modal Header -->
            <div class="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-start shrink-0">
                <div>
                    <h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-1">{{ 'MODAL_CHOOSE_TEMPLATE_TITLE' | translate }}</h3>
                    <p class="text-slate-500 dark:text-slate-400">{{ 'MODAL_CHOOSE_TEMPLATE_DESC' | translate }}</p>
                </div>
                <button (click)="showCreateModal = false" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
                    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
            </div>

            <!-- Content Area -->
            <div class="flex-1 overflow-hidden flex flex-col">
                <!-- Theme Name Input (Integrated at Top) -->
                <div class="px-8 pt-6 pb-2 shrink-0">
                    <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{{ 'THEME_NAME_LABEL' | translate }}</label>
                    <input [(ngModel)]="newThemeName" 
                           class="w-full text-lg border-b-2 border-slate-200 dark:border-slate-700 px-0 py-2 focus:border-blue-500 focus:ring-0 bg-transparent text-slate-900 dark:text-white placeholder-slate-300 transition-colors" 
                           [placeholder]="'THEME_NAME_PLACEHOLDER' | translate" 
                           autofocus />
                </div>

                <!-- Category Filters -->
                <div class="px-8 py-4 flex gap-2 overflow-x-auto no-scrollbar shrink-0">
                    <button *ngFor="let cat of templateCategories" 
                            (click)="selectedCategory = cat.id"
                            class="px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap"
                            [ngClass]="selectedCategory === cat.id ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-600'">
                        {{ cat.label | translate }}
                    </button>
                </div>

                <!-- Template Grid -->
                <div class="flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar">
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <button *ngFor="let t of filteredTemplates()" 
                             (click)="selectTemplate(t)"
                             class="group text-left flex flex-col h-full rounded-2xl overflow-hidden border transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                             [ngClass]="newThemeTemplate === t.id ? 'border-blue-500 ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-800 shadow-xl scale-[1.02]' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-lg'">
                            
                            <!-- Preview Image Area -->
                            <div class="aspect-[4/3] bg-slate-100 dark:bg-slate-700 relative overflow-hidden">
                                <div class="absolute inset-0 flex items-center justify-center text-slate-300 dark:text-slate-600 font-bold text-4xl group-hover:scale-105 transition-transform duration-500">
                                    {{ t.name.charAt(0) }}
                                </div>
                                <!-- Badge -->
                                <div class="absolute bottom-3 right-3 px-2 py-1 rounded bg-white/90 dark:bg-slate-800/90 text-xs font-semibold text-slate-600 dark:text-slate-300 shadow-sm backdrop-blur-sm">
                                    {{ t.categoryLabel | translate }}
                                </div>
                            </div>
                            
                            <div class="p-5 flex-1 flex flex-col bg-white dark:bg-slate-800">
                                <h4 class="text-lg font-bold text-slate-900 dark:text-white mb-2">{{ t.name }}</h4>
                                <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{{ t.description | translate }}</p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="p-6 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center bg-white dark:bg-slate-800 shrink-0">
                <div class="text-sm text-slate-500">
                    <span *ngIf="newThemeTemplate !== 'default'" class="animate-fade-in">
                        {{ 'SELECTED_TEMPLATE' | translate }}: <span class="font-bold text-slate-900 dark:text-white">{{ getSelectedTemplateName() }}</span>
                    </span>
                </div>
                <div class="flex gap-3">
                    <button class="btn btn-ghost" (click)="showCreateModal = false">{{ 'CANCEL' | translate }}</button>
                    <button class="btn btn-primary px-8" (click)="createTheme()" [disabled]="!newThemeName.trim() || isLoading()">
                        {{ isLoading() ? ('BTN_SAVING' | translate) : ('BTN_CREATE_THEME' | translate) }}
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .animate-fade-in { animation: fadeIn 0.4s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .animate-scale-in { animation: scaleIn 0.2s ease-out; }
    @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
  `]
})
export class ThemeManagerComponent implements OnInit {
    themes = signal<Theme[]>([]);
    isLoading = signal(false);
    showCreateModal = false;
    newThemeName = '';
    newThemeTemplate = 'modern-corporate';
    selectedCategory = 'all';

    templateCategories = [
        { id: 'all', label: 'CAT_ALL' },
        { id: 'corporate', label: 'CAT_CORPORATE' },
        { id: 'portfolio', label: 'CAT_PORTFOLIO' },
        { id: 'landing', label: 'CAT_LANDING' },
        { id: 'blog', label: 'CAT_BLOG' },
        { id: 'ecommerce', label: 'CAT_ECOMMERCE' }
    ];

    templates = [
        { id: 'modern-corporate', name: 'Modern Corporate', category: 'corporate', categoryLabel: 'CAT_CORPORATE', description: 'DESC_MODERN_CORPORATE' },
        { id: 'creative-portfolio', name: 'Creative Portfolio', category: 'portfolio', categoryLabel: 'CAT_PORTFOLIO', description: 'DESC_CREATIVE_PORTFOLIO' },
        { id: 'saas-landing', name: 'SaaS Landing', category: 'landing', categoryLabel: 'CAT_LANDING', description: 'DESC_SAAS_LANDING' },
        { id: 'minimal-blog', name: 'Minimal Blog', category: 'blog', categoryLabel: 'CAT_BLOG', description: 'DESC_MINIMAL_BLOG' },
        { id: 'ecommerce-starter', name: 'E-commerce Starter', category: 'ecommerce', categoryLabel: 'CAT_ECOMMERCE', description: 'DESC_ECOMMERCE_STARTER' },
        { id: 'blank-slate', name: 'Blank Slate', category: 'all', categoryLabel: 'CAT_ALL', description: 'DESC_BLANK_SLATE' }
    ];

    constructor(private http: HttpClient, private i18n: I18nService) { }

    ngOnInit() {
        this.loadThemes();
    }

    loadThemes() {
        this.http.get<Theme[]>('/api/themes').subscribe({
            next: (data) => this.themes.set(data),
            error: (err) => console.error('Failed to load themes', err)
        });
    }

    activateTheme(theme: Theme) {
        if (!confirm(this.i18n.translate('THEME_CONFIRM_ACTIVATE').replace('{{name}}', theme.name))) return;

        this.isLoading.set(true);
        this.http.patch(`/api/themes/${theme.id}/activate`, {}).subscribe({
            next: () => {
                this.isLoading.set(false);
                this.loadThemes(); // Refresh list to update active state
            },
            error: (err) => {
                this.isLoading.set(false);
                alert(this.i18n.translate('THEME_ACTIVATE_ERROR').replace('{{error}}', err.error?.error));
            }
        });
    }

    deleteTheme(theme: Theme) {
        if (!confirm(this.i18n.translate('THEME_CONFIRM_DELETE').replace('{{name}}', theme.name).replace('{{count}}', theme.page_count.toString()))) return;

        this.isLoading.set(true);
        this.http.delete(`/api/themes/${theme.id}`).subscribe({
            next: () => {
                this.isLoading.set(false);
                this.loadThemes();
            },
            error: (err) => {
                this.isLoading.set(false);
                alert(this.i18n.translate('THEME_DELETE_ERROR').replace('{{error}}', err.error?.error));
            }
        });
    }

    openCreateModal() {
        this.newThemeName = '';
        this.newThemeTemplate = 'modern-corporate';
        this.selectedCategory = 'all';
        this.showCreateModal = true;
    }

    selectTemplate(t: any) {
        this.newThemeTemplate = t.id;
    }

    filteredTemplates() {
        if (this.selectedCategory === 'all') return this.templates;
        return this.templates.filter(t => t.category === this.selectedCategory);
    }

    getSelectedTemplateName() {
        return this.templates.find(t => t.id === this.newThemeTemplate)?.name || '';
    }

    createTheme() {
        if (!this.newThemeName.trim()) return;

        this.isLoading.set(true);
        this.http.post<{ success: boolean, id: number }>('/api/themes', {
            name: this.newThemeName,
            template_id: this.newThemeTemplate
        }).subscribe({
            next: () => {
                this.isLoading.set(false);
                this.showCreateModal = false;
                this.loadThemes();
            },
            error: (e) => {
                this.isLoading.set(false);
                alert('Error creating theme: ' + e.error?.error);
            }
        });
    }
}
