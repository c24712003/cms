import { Component, signal, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { Language } from '../../../core/models/language.model';
import { EditorCanvasComponent } from '../../components/editor-canvas/editor-canvas.component';
import { SeoPanelComponent } from '../../components/seo-panel.component';
import { SeoValidatorService } from '../../services/seo-validator.service';
import { I18nService } from '../../../core/services/i18n.service';
import { BlockInstance } from '../../../features/content-blocks/block.types';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';

interface HelperPage {
    id: number;
    slug: string;
    title: string;
}

interface Theme {
    id: number;
    name: string;
    pages: HelperPage[];
}

@Component({
    selector: 'app-theme-editor',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        EditorCanvasComponent,
        SeoPanelComponent,
        TranslatePipe
    ],
    template: `
    <div class="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden">
        
        <!-- Sidebar: Theme Pages -->
        <aside class="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col z-20 shrink-0">
            <div class="h-14 flex items-center px-4 border-b border-slate-100 dark:border-slate-700 gap-3 bg-white dark:bg-slate-800">
                <button routerLink="/admin/themes" class="btn btn-xs btn-ghost btn-circle text-slate-400">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                </button>
                <div class="overflow-hidden">
                    <h2 class="font-bold text-slate-800 dark:text-white truncate text-sm">{{ theme()?.name || 'Loading...' }}</h2>
                </div>
                <button (click)="openPageManager()" class="ml-auto btn btn-xs btn-ghost text-blue-600 dark:text-blue-400" [title]="'THEME_EDITOR_MANAGE_PAGES_TOOLTIP' | translate">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                </button>
            </div>

            <div class="flex-1 overflow-y-auto p-2 space-y-0.5">
                <div class="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">{{ 'NAV_PAGES' | translate }}</div>
                <button *ngFor="let p of theme()?.pages" 
                        (click)="selectPage(p)"
                        class="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between group"
                        [class.bg-blue-50]="selectedPage?.id === p.id"
                        [class.dark:bg-blue-900/20]="selectedPage?.id === p.id"
                        [class.text-blue-600]="selectedPage?.id === p.id"
                        [class.dark:text-blue-400]="selectedPage?.id === p.id"
                        [class.text-slate-600]="selectedPage?.id !== p.id"
                        [class.dark:text-slate-300]="selectedPage?.id !== p.id"
                        [class.hover:bg-slate-50]="selectedPage?.id !== p.id"
                        [class.dark:hover:bg-slate-700/50]="selectedPage?.id !== p.id">
                    <span class="truncate">{{ p.slug }}</span>
                </button>
            </div>
        </aside>

        <!-- Main Workspace -->
        <main class="flex-1 flex flex-col min-w-0 relative bg-slate-100/50 dark:bg-slate-900 transition-colors">
            
            <ng-container *ngIf="selectedPage; else noSelection">
                <!-- Toolbar (Matching PageEditor Header Height/Style) -->
                <header class="h-auto min-h-[4rem] py-2 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex flex-wrap gap-y-2 items-center justify-between px-4 shrink-0 shadow-sm z-10">
                    <div class="flex items-center gap-4">
                        <div class="text-sm">
                             <span class="text-slate-400 dark:text-slate-500 font-medium">{{ 'NAV_EDITOR' | translate }}:</span>
                             <span class="font-bold text-slate-800 dark:text-white ml-2 text-lg">{{ content.title || selectedPage.slug }}</span>
                             <span class="ml-2 text-xs text-slate-400 font-mono">/{{ activeLang() }}/{{ content.slug_localized || selectedPage.slug }}</span>
                        </div>
                    </div>

                    <div class="flex items-center gap-3 ml-auto">
                        <!-- Language Switcher -->
                         <div class="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1" *ngIf="languages().length > 0">
                            <button *ngFor="let lang of languages()"
                                (click)="switchLang(lang.code)"
                                [class.bg-white]="activeLang() === lang.code"
                                [class.dark:bg-slate-600]="activeLang() === lang.code"
                                [class.shadow-sm]="activeLang() === lang.code"
                                [class.text-slate-900]="activeLang() === lang.code"
                                [class.dark:text-white]="activeLang() === lang.code"
                                [class.text-slate-500]="activeLang() !== lang.code"
                                [class.dark:text-slate-400]="activeLang() !== lang.code"
                                class="px-3 py-1 text-xs font-semibold rounded-md transition-all">
                                {{ lang.code | uppercase }}
                            </button>
                         </div>

                        <div class="h-6 w-px bg-slate-200 dark:bg-slate-600 mx-1 hidden sm:block"></div>

                        <div class="hidden md:flex items-center text-xs text-slate-500 dark:text-slate-400 italic mr-2">
                            <span class="w-2 h-2 rounded-full bg-amber-400 mr-2"></span>
                            {{ 'STATUS_DRAFT' | translate }}
                        </div>
                        <button class="btn btn-secondary btn-sm px-3" (click)="saveDraft()" [disabled]="isSaving">
                            {{ isSaving ? 'Saving...' : ('BTN_SAVE_DRAFT' | translate) }}
                        </button>
                         <button class="btn btn-primary btn-sm px-3" (click)="publish()" [disabled]="isSaving">
                            {{ 'BTN_DEPLOY_PUBLISH' | translate }}
                        </button>
                    </div>
                </header>

                <!-- Fixed Height Container for Card + Canvas -->
                <div class="flex-1 flex flex-col overflow-hidden bg-slate-100/50 dark:bg-slate-900 relative">
                    
                    <div class="shrink-0 max-w-5xl mx-auto w-full p-6 pb-0 z-10">
                         <!-- Metadata Card (Identical to PageEditor) -->
                        <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm group transition-colors mb-6">
                            <div class="flex justify-between items-center mb-4">
                                <h3 class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{{ 'PAGE_SETTINGS_HEADER' | translate }}</h3>
                                <button (click)="showMetaPanel = !showMetaPanel" 
                                        class="text-xs font-medium px-3 py-1 rounded-full transition-colors"
                                        [class.bg-blue-100]="showMetaPanel" [class.dark:bg-blue-900]="showMetaPanel" [class.text-blue-700]="showMetaPanel" [class.dark:text-blue-300]="showMetaPanel"
                                        [class.bg-slate-100]="!showMetaPanel" [class.dark:bg-slate-700]="!showMetaPanel" [class.text-slate-600]="!showMetaPanel" [class.dark:text-slate-300]="!showMetaPanel">
                                    <i class="fas fa-chart-line mr-1"></i> SEO Score: {{ seoScore }}
                                </button>
                            </div>
                            <div class="grid grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">{{ 'PAGE_TITLE_LABEL' | translate }}</label>
                                    <input [(ngModel)]="content.title" class="w-full text-lg font-bold border-0 border-b border-transparent focus:border-blue-500 focus:ring-0 px-0 py-1 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 bg-transparent text-slate-900 dark:text-white" placeholder="Page Title" />
                                </div>
                                <div>
                                    <label class="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">{{ 'PAGE_URL_SLUG_LABEL' | translate }}</label>
                                    <div class="flex items-baseline text-slate-500 dark:text-slate-400">
                                            <span class="text-sm">/{{ activeLang() }}/</span>
                                            <input [(ngModel)]="content.slug_localized" class="flex-1 bg-transparent border-0 border-b border-transparent focus:border-blue-500 focus:ring-0 px-0 py-1 text-sm font-mono text-slate-700 dark:text-slate-300" />
                                    </div>
                                </div>
                            </div>
                            
                             <div class="grid grid-cols-2 gap-6 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                                <div>
                                    <label class="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">SEO Title</label>
                                    <input [(ngModel)]="content.seo_title" (ngModelChange)="updateSeoScore()" class="w-full border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm focus:border-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
                                </div>
                                <div>
                                    <label class="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">OG Image URL</label>
                                    <input [(ngModel)]="content.og_image" class="w-full border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm focus:border-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
                                </div>
                            </div>
                            <div class="mt-4">
                                <label class="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Meta Description</label>
                                <textarea [(ngModel)]="content.seo_desc" (ngModelChange)="updateSeoScore()" rows="2" class="w-full border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm focus:border-blue-500 resize-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white"></textarea>
                            </div>
                        </div>

                         <!-- SEO Panel (Collapsible) -->
                        <div *ngIf="showMetaPanel" class="mb-6">
                            <app-seo-panel
                                [title]="content.seo_title || content.title"
                                [description]="content.seo_desc"
                                [content]="blocks"
                                [language]="activeLang()">
                            </app-seo-panel>
                        </div>
                    </div>

                    <!-- Canvas -->
                    <!-- Note: EditorCanvas now handles its own display/height via :host styles -->
                    <app-editor-canvas
                        class="flex-1"
                        [blocks]="blocks"
                        (blocksChange)="blocks = $event"
                        [(selectedBlock)]="selectedBlock">
                    </app-editor-canvas>
                </div>
            </ng-container>

            <ng-template #noSelection>
                 <div class="flex-1 flex items-center justify-center text-slate-400">
                    <div class="text-center">
                        <div class="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800">
                            <svg class="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>
                        </div>
                        <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2">{{ 'EMPTY_TITLE' | translate }}</h3>
                        <p class="max-w-xs mx-auto">{{ 'EMPTY_DESC' | translate }}</p>
                    </div>
                 </div>
            </ng-template>

        </main>
    </div>

    <!-- Toast -->
    <div *ngIf="toast.message" class="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] px-6 py-3 rounded-lg shadow-lg font-medium text-white animate-bounce-in"
        [class.bg-green-500]="toast.type === 'success'"
        [class.bg-red-500]="toast.type === 'error'">
        {{ toast.message }}
    </div>

    <!-- Manage Pages Modal -->
    <div *ngIf="showPageManager" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[85vh]">
            <div class="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <h3 class="text-xl font-bold text-slate-800 dark:text-white">{{ 'THEME_EDITOR_MANAGE_PAGES_TITLE' | translate }}</h3>
                <button (click)="showPageManager = false" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
            </div>
            
            <div class="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-900/50">
                <p class="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    {{ 'THEME_EDITOR_MANAGE_PAGES_DESC' | translate }}
                </p>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div *ngFor="let page of allPages()" 
                         (click)="togglePageSelection(page.id)"
                         class="flex items-center p-3 rounded-lg border cursor-pointer transition-all select-none"
                         [class.bg-blue-50]="selectedPageIds.has(page.id)"
                         [class.dark:bg-blue-900/20]="selectedPageIds.has(page.id)"
                         [class.border-blue-500]="selectedPageIds.has(page.id)"
                         [class.border-slate-200]="!selectedPageIds.has(page.id)"
                         [class.dark:border-slate-700]="!selectedPageIds.has(page.id)"
                         [class.bg-white]="!selectedPageIds.has(page.id)"
                         [class.dark:bg-slate-800]="!selectedPageIds.has(page.id)">
                        
                        <div class="w-5 h-5 rounded border flex items-center justify-center mr-3 transition-colors"
                             [class.bg-blue-500]="selectedPageIds.has(page.id)"
                             [class.border-blue-500]="selectedPageIds.has(page.id)"
                             [class.border-slate-300]="!selectedPageIds.has(page.id)">
                            <svg *ngIf="selectedPageIds.has(page.id)" class="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                        </div>
                        
                        <div>
                            <div class="font-medium text-slate-900 dark:text-white">{{ page.slug_key }}</div>
                            <div class="text-xs text-slate-500">ID: {{ page.id }}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="p-6 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3 rounded-b-xl bg-white dark:bg-slate-800">
                <button class="btn btn-ghost" (click)="showPageManager = false">{{ 'CANCEL' | translate }}</button>
                <button class="btn btn-primary" (click)="saveThemePages()" [disabled]="isSaving">
                    {{ isSaving ? ('BTN_SAVING' | translate) : ('BTN_SAVE_CHANGES' | translate) }}
                </button>
            </div>
        </div>
    </div>
  `,
    styles: [`
    .input-field { @apply w-full border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm focus:border-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white; }
  `]
})
export class ThemeEditorComponent implements OnInit {
    theme = signal<Theme | null>(null);
    languages = signal<Language[]>([]);
    activeLang = signal('');

    selectedPage: HelperPage | null = null;
    content: any = {};
    blocks: BlockInstance[] = [];
    selectedBlock: BlockInstance | null = null;

    showMetaPanel = false;
    isSaving = false;
    seoScore = 0;
    toast = { message: '', type: 'success' };

    // Page Manager State
    showPageManager = false;
    allPages = signal<any[]>([]);
    selectedPageIds = new Set<number>();

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private http: HttpClient,
        private cdr: ChangeDetectorRef,
        private seoValidator: SeoValidatorService,
        private i18n: I18nService
    ) { }

    ngOnInit() {
        // Load Languages
        this.http.get<Language[]>('/api/languages').subscribe(l => {
            this.languages.set(l);
            if (l.length > 0) this.activeLang.set(l[0].code);
        });

        // Load Theme
        this.route.paramMap.subscribe(params => {
            const id = params.get('id');
            if (id) this.loadTheme(id);
        });

        // Sync query params for page selection
        this.route.queryParams.subscribe(params => {
            if (params['pageId'] && this.theme()) {
                const p = this.theme()!.pages.find(x => x.id === +params['pageId']);
                if (p && p.id !== this.selectedPage?.id) {
                    this.selectPage(p, false);
                }
            }
        });
    }

    loadTheme(id: string) {
        // Note: The /api/themes endpoint returns a list. 
        // Ideally we should have /api/themes/:id but for now we filter locally or assuming we fetched the list.
        // Or did I verify GET /api/themes returns list? Yes.
        // I will use GET /api/themes and filter (inefficient but works for now as per minimal changes).
        this.http.get<any[]>('/api/themes').subscribe({
            next: (themes) => {
                const t = themes.find(x => x.id === +id);
                if (t) {
                    this.theme.set(t);
                    // Check initial query param
                    this.route.snapshot.queryParamMap.getAll('pageId');
                    // Angular's queryParams subscription above handles it after theme is set
                }
            },
            error: (e) => console.error(e)
        });
    }

    selectPage(page: HelperPage, updateUrl = true) {
        if (this.selectedPage?.id === page.id) return;

        // TODO: dirty check
        this.selectedPage = page;
        this.selectedBlock = null;

        if (updateUrl) {
            this.router.navigate([], {
                relativeTo: this.route,
                queryParams: { pageId: page.id },
                queryParamsHandling: 'merge'
            });
        }

        this.fetchContent();
    }

    switchLang(code: string) {
        this.activeLang.set(code);
        this.selectedBlock = null;
        this.fetchContent();
    }

    fetchContent() {
        if (!this.selectedPage || !this.activeLang()) return;

        this.content = { title: '', slug_localized: '' };
        this.blocks = [];

        this.http.get<any>(`/api/pages/${this.selectedPage.id}/draft?lang=${this.activeLang()}`)
            .subscribe({
                next: (data) => {
                    this.content = data.title ? data : { title: '', slug_localized: '' };
                    const json = this.content.content_json;
                    if (json && Array.isArray(json)) {
                        // Migration check: ensure blocks have IDs and data is correctly nested
                        this.blocks = json.map((b: any) => {
                            let blockData = b.data;
                            // Partial migration check: if no 'data' prop but has other props, assume root is data
                            if (!blockData && Object.keys(b).length > 2) {
                                const { id, type, styles, ...rest } = b;
                                blockData = rest;
                            }
                            return {
                                id: b.id || Math.random().toString(36).substring(2, 11),
                                type: b.type,
                                data: blockData || {},
                                styles: b.styles
                            };
                        });
                    }
                    this.updateSeoScore();
                    this.cdr.detectChanges();
                }
            });
    }

    updateSeoScore() {
        const result = this.seoValidator.validatePage({
            title: this.content.seo_title || this.content.title,
            description: this.content.seo_desc,
            content: this.blocks,
            language: this.activeLang()
        });
        this.seoScore = result.score;
    }

    saveDraft() {
        if (!this.selectedPage) return;
        this.isSaving = true;
        const payload = {
            lang: this.activeLang(),
            ...this.content,
            content_json: this.blocks
        };
        this.http.post(`/api/pages/${this.selectedPage.id}/draft`, payload).subscribe({
            next: () => {
                this.isSaving = false;
                this.showToast('Draft saved', 'success');
            },
            error: () => {
                this.isSaving = false;
                this.showToast('Error saving', 'error');
            }
        });
    }

    publish() {
        if (!this.selectedPage) return;
        if (!confirm(this.i18n.translate('MSG_CONFIRM_PUBLISH'))) return;
        this.isSaving = true;
        // Prepare payload same as save
        const payload = {
            lang: this.activeLang(),
            ...this.content,
            content_json: this.blocks
        };

        this.http.post(`/api/pages/${this.selectedPage.id}/publish`, payload).subscribe({
            next: () => {
                this.isSaving = false;
                this.showToast('Published!', 'success');
            },
            error: () => {
                this.isSaving = false;
                this.showToast('Error publishing', 'error');
            }
        });
    }

    // --- Page Manager Logic ---

    openPageManager() {
        this.isSaving = true;
        // 1. Fetch all pages
        this.http.get<any[]>('/api/pages').subscribe({
            next: (pages) => {
                this.allPages.set(pages);

                // 2. Initialize selection from current theme pages
                this.selectedPageIds.clear();
                this.theme()?.pages.forEach(p => this.selectedPageIds.add(p.id));

                this.isSaving = false;
                this.showPageManager = true;
            },
            error: (e) => {
                this.isSaving = false;
                this.showToast('Failed to load pages', 'error');
            }
        });
    }

    togglePageSelection(id: number) {
        if (this.selectedPageIds.has(id)) {
            this.selectedPageIds.delete(id);
        } else {
            this.selectedPageIds.add(id);
        }
    }

    saveThemePages() {
        const themeId = this.theme()?.id;
        if (!themeId) return;

        this.isSaving = true;
        const pageIds = Array.from(this.selectedPageIds);

        this.http.put(`/api/themes/${themeId}/pages`, { pageIds }).subscribe({
            next: () => {
                this.showToast(this.i18n.translate('MSG_THEME_PAGES_UPDATED'), 'success');
                this.showPageManager = false;
                this.isSaving = false;
                // Reload theme to reflect changes in sidebar
                this.loadTheme(themeId.toString());
            },
            error: (e) => {
                this.isSaving = false;
                this.showToast('Error updating pages: ' + e.error?.error, 'error');
            }
        });
    }

    showToast(msg: string, type: string) {
        this.toast = { message: msg, type };
        this.cdr.detectChanges();
        setTimeout(() => { this.toast.message = ''; this.cdr.detectChanges(); }, 3000);
    }
}
