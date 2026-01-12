import { Component, signal, ViewChild, ElementRef, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { Language } from '../../core/models/language.model';
import { I18nService } from '../../core/services/i18n.service';
import { BlockInstance } from '../../features/content-blocks/block.types';
import { SeoPanelComponent } from '../components/seo-panel.component';
import { SeoValidatorService } from '../services/seo-validator.service';
import { EditorCanvasComponent } from '../components/editor-canvas/editor-canvas.component';

import { TranslatePipe } from '../../core/pipes/translate.pipe';

@Component({
  selector: 'app-page-editor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SeoPanelComponent,
    EditorCanvasComponent,
    TranslatePipe
  ],
  template: `
    <div class="flex flex-col h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden transition-colors">
      <!-- Page Header (Toolbar) -->
      <header class="h-auto min-h-[4rem] py-2 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex flex-wrap gap-y-2 items-center justify-between px-2 sm:px-4 shadow-sm z-20 shrink-0 transition-colors">
        <!-- Left: Title, Selector, New Button -->
        <div class="flex items-center gap-2 flex-grow sm:flex-grow-0">
          <h1 class="font-bold text-slate-800 dark:text-white text-sm flex items-center gap-2 shrink-0">
            <span class="text-slate-400 dark:text-slate-500 hidden sm:inline">{{ 'NAV_PAGES' | translate }} /</span> 
            {{ 'NAV_EDITOR' | translate }}
          </h1>
          
          <!-- Page Selector -->
          <div class="relative group flex-grow sm:flex-grow-0 max-w-[140px] sm:max-w-none">
             <select [ngModel]="selectedPageSlug()" (ngModelChange)="loadPage($event)" 
                     class="w-full appearance-none pl-3 pr-8 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 transition-colors cursor-pointer border-transparent focus:border-blue-500 focus:ring-0 truncate">
                  <option value="">{{ 'SELECT_PLACEHOLDER' | translate }}</option>
                  <option *ngFor="let p of pages()" [value]="p.slug_key">{{ p.slug_key }}</option>
             </select>
             <div class="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 dark:text-slate-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
             </div>
          </div>
          
          <button class="btn btn-sm btn-ghost px-2 sm:px-3" (click)="openCreateModal()">
            <span class="sm:hidden text-xl leading-none">+</span>
            <span class="hidden sm:inline">{{ 'ACTION_NEW' | translate }}</span>
          </button>
        </div>

        <!-- Right Toolbar Actions -->
        <div class="flex items-center gap-2 sm:gap-3 ml-auto">
             <!-- Language Tabs (Compact) -->
             <div class="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1" *ngIf="languages().length > 0">
                <ng-container *ngFor="let lang of languages()">
                    <button 
                    (click)="switchLang(lang.code)"
                    [class.bg-white]="activeLang() === lang.code"
                    [class.dark:bg-slate-600]="activeLang() === lang.code"
                    [class.shadow-sm]="activeLang() === lang.code"
                    [class.text-slate-900]="activeLang() === lang.code"
                    [class.dark:text-white]="activeLang() === lang.code"
                    [class.text-slate-500]="activeLang() !== lang.code"
                    [class.dark:text-slate-400]="activeLang() !== lang.code"
                    class="px-2 sm:px-3 py-1 text-xs font-semibold rounded-md transition-all">
                  {{ lang.code | uppercase }}
                </button>
                </ng-container>
             </div>

            <div class="hidden sm:block h-6 w-px bg-slate-200 dark:bg-slate-600 mx-1"></div>

            <div class="hidden md:flex items-center text-xs text-slate-500 dark:text-slate-400 italic mr-2" *ngIf="selectedPageSlug()">
                <span class="w-2 h-2 rounded-full bg-amber-400 mr-2"></span>
                {{ 'STATUS_DRAFT' | translate }}
            </div>

            <button class="btn btn-secondary btn-sm px-2 sm:px-4" (click)="saveDraft()" [disabled]="!selectedPageSlug() || isSaving" title="Save Draft">
               <!-- Icon for Mobile -->
               <svg class="w-4 h-4 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/></svg>
               <span class="hidden sm:inline">{{ isSaving ? 'Saving...' : ('BTN_SAVE_DRAFT' | translate) }}</span>
            </button>
            <button class="btn btn-primary btn-sm px-2 sm:px-4" (click)="publish()" [disabled]="!selectedPageSlug() || isSaving" title="Publish">
              <!-- Icon for Mobile -->
               <svg class="w-4 h-4 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
               <span class="hidden sm:inline">{{ 'BTN_DEPLOY_PUBLISH' | translate }}</span>
            </button>
        </div>
      </header>

      <!-- Main Workspace -->
      <div class="flex-1 flex overflow-hidden relative" *ngIf="selectedPageSlug(); else noPageSelected">
        
        <!-- Left: Canvas Wrapper -->
        <main class="flex-1 flex flex-col overflow-hidden bg-slate-100/50 dark:bg-slate-900 relative transition-colors">
            
            <!-- Metadata Headers (Sticky or Top) -->
            <div class="shrink-0 max-w-5xl mx-auto w-full p-6 pb-0 z-10">
                <!-- Metadata Card (Collapsible or Top) -->
                <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm group transition-colors mb-6 overflow-hidden">
                    <!-- Card Header -->
                    <div class="px-6 py-4 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50 cursor-pointer select-none border-b border-transparent"
                         [class.border-slate-100]="isSettingsExpanded"
                         [class.dark:border-slate-700]="isSettingsExpanded"
                         (click)="isSettingsExpanded = !isSettingsExpanded">
                        <div class="flex items-center gap-3">
                             <button class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors transform duration-200"
                                     [class.rotate-180]="!isSettingsExpanded">
                                 <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                             </button>
                             <h3 class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{{ 'PAGE_SETTINGS_HEADER' | translate }}</h3>
                        </div>
                        
                        <div class="flex items-center gap-2">
                             <!-- SEO Score Badge (Click to toggle details below, stop propagation to prevent card toggle) -->
                            <button (click)="$event.stopPropagation(); showSeoPanel = !showSeoPanel" 
                                    class="text-xs font-bold px-3 py-1.5 rounded-full transition-colors flex items-center gap-2"
                                    [class.bg-emerald-100]="seoScore >= 80" [class.text-emerald-700]="seoScore >= 80"
                                    [class.dark:bg-emerald-900/30]="seoScore >= 80" [class.dark:text-emerald-400]="seoScore >= 80"
                                    [class.bg-amber-100]="seoScore < 80 && seoScore >= 50" [class.text-amber-700]="seoScore < 80 && seoScore >= 50"
                                    [class.dark:bg-amber-900/30]="seoScore < 80 && seoScore >= 50" [class.dark:text-amber-400]="seoScore < 80 && seoScore >= 50"
                                    [class.bg-red-100]="seoScore < 50" [class.text-red-700]="seoScore < 50"
                                    [class.dark:bg-red-900/30]="seoScore < 50" [class.dark:text-red-400]="seoScore < 50">
                                <span class="w-2 h-2 rounded-full" 
                                      [class.bg-emerald-500]="seoScore >= 80"
                                      [class.bg-amber-500]="seoScore < 80 && seoScore >= 50"
                                      [class.bg-red-500]="seoScore < 50"></span>
                                SEO Score: {{ seoScore }}
                            </button>
                        </div>
                    </div>

                    <!-- Card Body -->
                    <div *ngIf="isSettingsExpanded" class="p-6 pt-4 animate-slide-down">
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
                                <label class="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Theme</label>
                                <select [(ngModel)]="activeThemeId" 
                                        class="w-full border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white appearance-none">
                                    <option [ngValue]="null">No Theme (Default)</option>
                                    <option *ngFor="let t of themes()" [value]="t.id">
                                        {{ t.name }} {{ t.is_active ? '(Active)' : '' }}
                                    </option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">SEO Title 
                                    <span class="font-normal text-slate-400 dark:text-slate-500">({{ content.seo_title?.length || 0 }}/60)</span>
                                </label>
                                <input [(ngModel)]="content.seo_title" 
                                        (ngModelChange)="updateSeoScore()"
                                        class="w-full border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white" 
                                        placeholder="SEO 標題（建議 50-60 字元）" />
                            </div>
                            <div class="col-span-2 sm:col-span-1">
                                <label class="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">OG Image URL</label>
                                <input [(ngModel)]="content.og_image" 
                                        class="w-full border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white" 
                                        placeholder="https://example.com/image.jpg" />
                            </div>
                        </div>
                        <div class="mt-4">
                            <label class="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Meta Description 
                                <span class="font-normal text-slate-400 dark:text-slate-500">({{ content.seo_desc?.length || 0 }}/160)</span>
                            </label>
                            <textarea [(ngModel)]="content.seo_desc" 
                                        (ngModelChange)="updateSeoScore()"
                                        rows="2" 
                                        class="w-full border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white" 
                                        placeholder="頁面描述（建議 120-160 字元）"></textarea>
                        </div>
                    </div>
                </div>
                
                <!-- SEO Panel (Collapsible) -->
                <div *ngIf="showSeoPanel" class="max-w-5xl mx-auto mb-6">
                    <app-seo-panel
                        [title]="content.seo_title || content.title"
                        [description]="content.seo_desc"
                        [content]="blocks"
                        [language]="activeLang()">
                    </app-seo-panel>
                </div>
            </div>

            <!-- Editor Canvas (Flex 1 to fill remaining space) -->
            <!-- EditorCanvas handles its own scrolling via :host styles now -->
            <app-editor-canvas
                class="flex-1"
                [blocks]="blocks"
                (blocksChange)="blocks = $event"
                [(selectedBlock)]="selectedBlock">
            </app-editor-canvas>

        </main>
      </div>

      <!-- No Page Selected State -->
      <ng-template #noPageSelected>
          <div class="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-900">
             <div class="text-center max-w-md">
                 <div class="inline-block p-6 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400 mb-6">
                    <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
                 </div>
                 <h2 class="text-2xl font-bold text-slate-800 dark:text-white mb-2">{{ 'EMPTY_TITLE' | translate }}</h2>
                 <p class="text-slate-500 dark:text-slate-400 mb-8">{{ 'EMPTY_DESC' | translate }}</p>
                 <button class="btn btn-primary" (click)="openCreateModal()">{{ 'BTN_CREATE_NEW' | translate }}</button>
             </div>
          </div>
      </ng-template>

      <!-- Create Page Modal -->
        <div *ngIf="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6 w-96">
            <h3 class="text-lg font-bold mb-4 text-slate-900 dark:text-white">{{ 'MODAL_CREATE_TITLE' | translate }}</h3>
            
            <div class="space-y-4">
                <div>
                    <label class="form-label">{{ 'PAGE_URL_SLUG_LABEL' | translate }}</label>
                    <input [(ngModel)]="newPageSlug" class="input-field" placeholder="e.g. services" />
                    <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Unique identifier for the URL.</p>
                </div>
                <div>
                    <label class="form-label">Template</label>
                    <select [(ngModel)]="newPageTemplate" class="input-field">
                        <option value="default">Default Page</option>
                        <option value="home">Home Page</option>
                        <option value="landing">Landing Page</option>
                    </select>
                </div>
            </div>

            <div class="flex justify-end gap-2 mt-6">
                <button class="btn btn-ghost" (click)="showCreateModal = false">{{ 'MODAL_CANCEL' | translate }}</button>
                <button class="btn btn-primary" (click)="createPage()">{{ 'MODAL_CONFIRM_CREATE' | translate }}</button>
            </div>
        </div>
      </div>

      <!-- Toast Notification -->
      <div *ngIf="toast.message" class="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] px-6 py-3 rounded-lg shadow-lg font-medium transition-all transform animate-bounce-in"
           [class.bg-green-500]="toast.type === 'success'"
           [class.bg-red-500]="toast.type === 'error'"
           [class.bg-amber-500]="toast.type === 'warning'"
           [class.text-white]="true">
        {{ toast.message }}
      </div>

      <!-- Confirmation Modal -->
      <div *ngIf="showConfirmModal" class="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6 w-96 max-w-full">
            <h3 class="text-lg font-bold text-slate-800 dark:text-white mb-2">Confirm Action</h3>
            <p class="text-slate-600 dark:text-slate-300 mb-6">{{ confirmMessage }}</p>
            <div class="flex justify-end gap-3">
                <button class="btn btn-ghost" (click)="showConfirmModal = false">Cancel</button>
                <button class="btn btn-primary" (click)="confirmAction()">Confirm</button>
            </div>
        </div>
      </div>

    </div>
  `
})
export class PageEditorComponent {

  // State
  pages = signal<any[]>([]);
  themes = signal<any[]>([]);
  languages = signal<Language[]>([]);
  selectedPageSlug = signal('');
  activeLang = signal('');
  activeThemeId: number | null = null;

  content: any = {};
  blocks: BlockInstance[] = [];
  selectedBlock: BlockInstance | null = null;

  pageId: number | null = null;
  isSaving = false;
  showCreateModal = false;
  showSeoPanel = false;
  isSettingsExpanded = true;
  seoScore = 0;

  // UI Feedback
  toast = { message: '', type: 'success' as 'success' | 'error' | 'warning' };
  showConfirmModal = false;
  confirmMessage = '';
  pendingAction: (() => void) | null = null;

  // Form
  newPageSlug = '';
  newPageTemplate = 'default';

  // NOTE: showBlockPicker moved to EditorCanvasComponent
  // Blocks logic moved to EditorCanvasComponent

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    public i18n: I18nService,
    private seoValidator: SeoValidatorService,
    private route: ActivatedRoute
  ) { this.init(); }

  showToast(message: string, type: 'success' | 'error' | 'warning' = 'success') {
    this.toast = { message, type };
    this.cdr.detectChanges(); // Ensure visible
    setTimeout(() => {
      this.toast.message = '';
      this.cdr.detectChanges();
    }, 3000);
  }

  triggerConfirm(message: string, action: () => void) {
    this.confirmMessage = message;
    this.pendingAction = action;
    this.showConfirmModal = true;
  }

  confirmAction() {
    if (this.pendingAction) {
      this.pendingAction();
    }
    this.showConfirmModal = false;
    this.pendingAction = null;
  }

  init() {
    this.http.get<any[]>('/api/pages').subscribe(p => this.pages.set(p));
    this.http.get<any[]>('/api/themes').subscribe(t => this.themes.set(t));
    this.http.get<Language[]>('/api/languages').subscribe(l => {
      this.languages.set(l);
      if (l.length > 0 && !this.activeLang()) this.activeLang.set(l[0].code);
    });

    // Check for query params (e.g., action=create)
    this.route.queryParams.subscribe((params: any) => {
      if (params['action'] === 'create') {
        setTimeout(() => this.openCreateModal(), 100);
      }
    });
  }

  private fetchSub?: any; // Subscription

  loadPage(slug: string) {
    this.selectedPageSlug.set(slug);
    const p = this.pages().find(x => x.slug_key === slug);
    if (p) {
      this.pageId = p.id;
      this.activeThemeId = p.theme_id || null;
    } else {
      this.pageId = null;
      this.activeThemeId = null;
    }
    this.selectedBlock = null;
    this.fetchContent();
  }

  switchLang(code: string) {
    this.activeLang.set(code);
    this.selectedBlock = null;
    this.fetchContent();
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

  fetchContent() {
    if (!this.pageId || !this.activeLang()) return;

    if (this.fetchSub) this.fetchSub.unsubscribe();

    // Hard reset state to prevent stale data display
    this.content = { title: '', slug_localized: '' };
    this.blocks = [];
    this.selectedBlock = null;

    this.fetchSub = this.http.get<any>(`/api/pages/${this.pageId}/draft?lang=${this.activeLang()}`)
      .subscribe({
        next: (data) => {
          this.content = data.title ? data : { title: '', slug_localized: '' };
          const json = this.content.content_json;

          if (json && Array.isArray(json)) {
            // Migration check: ensure blocks have IDs and data is correctly nested
            this.blocks = json.map((b: any) => {
              const metaKeys = ['id', 'type', 'data', 'styles'];
              const rootProps: any = {};

              // Extract legacy root properties
              Object.keys(b).forEach(key => {
                if (!metaKeys.includes(key)) {
                  rootProps[key] = b[key];
                }
              });

              // Legacy Merge Strategy: 
              // We found that some blocks have both root properties (Seed Data) and an empty 'data' object (broken save).
              // To recover, we merge root properties into the data object.
              let mergedData = b.data || {};

              if (Object.keys(rootProps).length > 0) {
                // Merge rootProps into data. We use spread to mix them.
                // If there are collisions, we let rootProps overwrite purely because we are recovering from empty data.
                // In a normal migration, we might want to be more careful, but here "content missing" is the bug.
                mergedData = { ...mergedData, ...rootProps };
              }

              return {
                id: b.id || Math.random().toString(36).substring(2, 11),
                type: b.type,
                data: mergedData,
                styles: b.styles
              };
            });
          } else {
            this.blocks = [];
          }
          this.updateSeoScore(); // Recalculate score after load
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Failed to fetch content:', err);
          this.cdr.detectChanges();
        }
      });
  }

  // --- Persistence ---

  prepareSavePayload() {
    // Ensure content object is updated with metadata inputs
    return {
      lang: this.activeLang(),
      ...this.content,
      content_json: this.blocks
    };
  }

  validatePage(): boolean {
    if (!this.content.title?.trim()) {
      this.showToast('Page Title is required.', 'warning');
      return false;
    }
    if (!this.content.slug_localized?.trim()) {
      this.showToast('URL Slug is required.', 'warning');
      return false;
    }
    return true;
  }

  savePageMetadata() {
    if (!this.pageId) return;
    this.http.patch(`/api/pages/${this.pageId}`, {
      theme_id: this.activeThemeId
    }).subscribe({
      next: () => {
        // Update local state so it persists if we switch away and back
        this.pages.update(pages => pages.map(p =>
          p.id === this.pageId ? { ...p, theme_id: this.activeThemeId } : p
        ));
      },
      error: (e) => console.error('Failed to update page metadata', e)
    });
  }

  saveDraft() {
    if (!this.pageId) return;
    if (!this.validatePage()) return;

    this.isSaving = true;
    this.http.post(`/api/pages/${this.pageId}/draft`, this.prepareSavePayload())
      .subscribe({
        next: () => {
          this.savePageMetadata(); // Also save theme/template
          this.isSaving = false;
          this.showToast('Draft saved successfully', 'success');
        },
        error: (e) => {
          this.isSaving = false;
          this.showToast('Error saving: ' + e.message, 'error');
        }
      });
  }

  publish() {
    if (!this.pageId) return;
    if (!this.validatePage()) return;

    this.triggerConfirm('Are you sure you want to publish this page to the live site?', () => {
      this.isSaving = true;
      this.http.post(`/api/pages/${this.pageId}/publish`, this.prepareSavePayload())
        .subscribe({
          next: () => {
            this.savePageMetadata(); // Also save theme/template
            this.isSaving = false;
            this.showToast('Page published successfully!', 'success');
          },
          error: (e) => {
            this.isSaving = false;
            this.showToast('Error publishing: ' + e.message, 'error');
          }
        });
    });
  }

  // --- Modal & Create ---
  openCreateModal() {
    this.newPageSlug = '';
    this.newPageTemplate = 'default';
    this.showCreateModal = true;
  }

  createPage() {
    if (!this.newPageSlug) return this.showToast('Slug required', 'warning');
    this.http.post<{ success: boolean, id: number }>('/api/pages', { slug_key: this.newPageSlug, template: this.newPageTemplate })
      .subscribe({
        next: () => {
          this.showCreateModal = false;
          this.init();
          setTimeout(() => this.loadPage(this.newPageSlug), 500);
        },
        error: (e) => this.showToast('Error: ' + e.message, 'error')
      });
  }
}
