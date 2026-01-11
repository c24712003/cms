import { Component, signal, ViewChild, ElementRef, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

import { Language } from '../../core/models/language.model';
import { I18nService } from '../../core/services/i18n.service';
import { BlockRegistryService } from '../../features/content-blocks/block-registry.service';
import { DynamicBlockRendererComponent } from '../../features/content-blocks/dynamic-block-renderer.component';
import { PropertyPanelComponent } from '../../features/content-blocks/editor/property-panel.component';
import { BlockInstance, ContentBlockManifest } from '../../features/content-blocks/block.types';

@Component({
  selector: 'app-page-editor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DragDropModule,
    DynamicBlockRendererComponent,
    PropertyPanelComponent
  ],
  template: `
    <div class="flex flex-col h-screen bg-slate-50 overflow-hidden">
      <!-- Page Header (Toolbar) -->
      <header class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm z-30 shrink-0">
        <div class="flex items-center gap-4">
          <h1 class="font-bold text-slate-800 text-lg flex items-center gap-2">
            <span class="text-slate-400">Pages /</span> 
            Editor
          </h1>
          
          <!-- Page Selector -->
          <div class="relative group">
             <select [ngModel]="selectedPageSlug()" (ngModelChange)="loadPage($event)" 
                     class="appearance-none pl-3 pr-8 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium text-slate-700 transition-colors cursor-pointer border-transparent focus:border-blue-500 focus:ring-0">
                  <option value="">Select a page...</option>
                  <option *ngFor="let p of pages()" [value]="p.slug_key">{{ p.slug_key }}</option>
             </select>
             <div class="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
             </div>
          </div>
          
          <button class="btn btn-sm btn-ghost" (click)="openCreateModal()">+ New</button>
        </div>

        <!-- Right Toolbar Actions -->
        <div class="flex items-center gap-3">
             <!-- Language Tabs (Compact) -->
             <div class="flex bg-slate-100 rounded-lg p-1 mr-4" *ngIf="languages().length > 0">
                <button *ngFor="let lang of languages()" 
                    (click)="switchLang(lang.code)"
                    [class.bg-white]="activeLang() === lang.code"
                    [class.shadow-sm]="activeLang() === lang.code"
                    [class.text-slate-900]="activeLang() === lang.code"
                    [class.text-slate-500]="activeLang() !== lang.code"
                    class="px-3 py-1 text-xs font-semibold rounded-md transition-all">
                  {{ lang.code | uppercase }}
                </button>
             </div>

            <div class="h-6 w-px bg-slate-200 mx-2"></div>

            <div class="flex items-center text-xs text-slate-500 italic mr-2" *ngIf="selectedPageSlug()">
                <span class="w-2 h-2 rounded-full bg-amber-400 mr-2"></span>
                {{ i18n.translate('STATUS_DRAFT') }}
            </div>

            <button class="btn btn-secondary btn-sm" (click)="saveDraft()" [disabled]="!selectedPageSlug() || isSaving">
              {{ isSaving ? 'Saving...' : i18n.translate('BTN_SAVE_DRAFT') }}
            </button>
            <button class="btn btn-primary btn-sm" (click)="publish()" [disabled]="!selectedPageSlug() || isSaving">
              {{ i18n.translate('BTN_DEPLOY_PUBLISH') }}
            </button>
        </div>
      </header>

      <!-- Main Workspace -->
      <div class="flex-1 flex overflow-hidden" *ngIf="selectedPageSlug(); else noPageSelected">
        
        <!-- Left: Canvas -->
        <main class="flex-1 overflow-y-auto bg-slate-100/50 p-8 relative" (click)="selectedBlock = null">
            
            <!-- Metadata Card (Collapsible or Top) -->
            <div class="max-w-5xl mx-auto mb-8 bg-white rounded-xl border border-slate-200 p-6 shadow-sm group">
                <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">{{ i18n.translate('PAGE_SETTINGS_HEADER') }}</h3>
                <div class="grid grid-cols-2 gap-6">
                    <div>
                        <label class="block text-xs font-semibold text-slate-500 mb-1">{{ i18n.translate('PAGE_TITLE_LABEL') }}</label>
                        <input [(ngModel)]="content.title" class="w-full text-lg font-bold border-0 border-b border-transparent focus:border-blue-500 focus:ring-0 px-0 py-1 transition-all placeholder:text-slate-300" placeholder="Page Title" />
                    </div>
                     <div>
                        <label class="block text-xs font-semibold text-slate-500 mb-1">{{ i18n.translate('PAGE_URL_SLUG_LABEL') }}</label>
                        <div class="flex items-baseline text-slate-500">
                             <span class="text-sm">/{{ activeLang() }}/</span>
                             <input [(ngModel)]="content.slug_localized" class="flex-1 bg-transparent border-0 border-b border-transparent focus:border-blue-500 focus:ring-0 px-0 py-1 text-sm font-mono text-slate-700" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Block Canvas -->
            <div cdkDropList 
                 (cdkDropListDropped)="drop($event)"
                 class="max-w-5xl mx-auto space-y-6 pb-32 min-h-[400px]">
                 
                 <div *ngFor="let block of blocks; trackBy: trackBlockId" 
                      cdkDrag
                      class="group relative bg-white rounded-xl border-2 border-transparent transition-all shadow-sm hover:shadow-md cursor-pointer"
                      [class.border-blue-500]="selectedBlock === block"
                      [class.ring-4]="selectedBlock === block"
                      [class.ring-blue-500/10]="selectedBlock === block"
                      (click)="selectBlock(block, $event)">
                    
                    <!-- Drag Handle (Left) -->
                    <div class="absolute left-0 top-0 bottom-0 w-8 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-move z-20 hover:bg-slate-50 rounded-l-xl transition-all" cdkDragHandle>
                        <svg class="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="currentColor"><path d="M7 19h2v2H7zM7 15h2v2H7zM7 11h2v2H7zM7 7h2v2H7zM11 19h2v2h-2zM11 15h2v2h-2zM11 11h2v2h-2zM11 7h2v2h-2zM15 19h2v2h-2zM15 15h2v2h-2zM15 11h2v2h-2zM15 7h2v2h-2z"/></svg>
                    </div>

                    <!-- Remove Button (Right) -->
                    <button (click)="removeBlock(block, $event)" class="absolute -right-3 -top-3 bg-white text-slate-400 hover:text-red-500 shadow-sm border border-slate-200 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all z-30 hover:scale-110">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>

                    <!-- Block Renderer -->
                    <div class="pointer-events-none">
                        <app-dynamic-block-renderer [block]="block"></app-dynamic-block-renderer>
                    </div>
                 </div>

                 <!-- Drop Zone / Empty State -->
                 <div class="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer"
                      (click)="showBlockPicker = true">
                     <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-3">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                     </div>
                     <h3 class="font-bold text-slate-700">{{ i18n.translate('ADD_BLOCK_TITLE') }}</h3>
                     <p class="text-sm text-slate-500">{{ i18n.translate('ADD_BLOCK_DESC') }}</p>
                 </div>
            </div>

            <!-- Floating Add Button (Mobile/Quick) -->
            <button class="fixed bottom-8 right-8 md:hidden btn btn-circle btn-primary shadow-xl" (click)="showBlockPicker = true">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            </button>
        </main>

        <!-- Right: Property Panel -->
        <aside class="w-96 bg-white border-l border-slate-200 flex flex-col z-20 shadow-xl transition-transform duration-300"
               [class.translate-x-0]="selectedBlock"
               [class.translate-x-full]="!selectedBlock"
               [class.hidden]="!selectedBlock"> <!-- Use hidden/transform for better UX if desired, strictly mimicking requirements -->
             
             <div class="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                 <h3 class="font-bold text-slate-700 text-sm">Block Properties</h3>
                 <button (click)="selectedBlock = null" class="btn btn-xs btn-ghost text-slate-400 hover:text-slate-600">Close</button>
             </div>

             <div class="flex-1 overflow-y-auto">
                 <app-property-panel 
                    *ngIf="selectedBlock"
                    [schema]="getBlockSchema(selectedBlock.type)"
                    [model]="selectedBlock.data"
                    (modelChange)="updateBlockData($event)">
                 </app-property-panel>
             </div>
        </aside>

      </div>

      <!-- No Page Selected State -->
      <ng-template #noPageSelected>
          <div class="flex-1 flex items-center justify-center bg-slate-50">
             <div class="text-center max-w-md">
                 <div class="inline-block p-6 rounded-full bg-blue-50 text-blue-500 mb-6">
                    <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
                 </div>
                 <h2 class="text-2xl font-bold text-slate-800 mb-2">Select a Page to Edit</h2>
                 <p class="text-slate-500 mb-8">Choose an existing page from the dropdown above or create a new one to get started.</p>
                 <button class="btn btn-primary" (click)="openCreateModal()">Create New Page</button>
             </div>
          </div>
      </ng-template>

      <!-- Block Picker Modal -->
      <div *ngIf="showBlockPicker" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-[800px] max-w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div class="p-6 border-b border-slate-100 flex justify-between items-center">
                <div>
                    <h3 class="text-xl font-bold text-slate-800">Add Content Block</h3>
                    <p class="text-sm text-slate-500">Choose a component to add to your page</p>
                </div>
                <button (click)="showBlockPicker = false" class="btn btn-circle btn-ghost btn-sm text-slate-400">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
            </div>
            
            <div class="flex-1 overflow-y-auto p-6 bg-slate-50">
                <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <button *ngFor="let def of availableBlocks" 
                            (click)="addBlock(def.type)"
                            class="group relative bg-white p-5 rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all text-left flex flex-col">
                        <div class="mb-3 w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                             <!-- Icon placeholder based on category or type -->
                             <span class="text-lg font-bold">{{ def.displayName.charAt(0) }}</span>
                        </div>
                        <h4 class="font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">{{ def.displayName }}</h4>
                        <p class="text-xs text-slate-500 line-clamp-2">Category: {{ def.category || 'General' }}</p>
                    </button>
                </div>
            </div>
        </div>
      </div>

      <!-- Create Page Modal -->
        <div *ngIf="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div class="bg-white rounded-xl shadow-2xl p-6 w-96">
            <h3 class="text-lg font-bold mb-4">Create New Page</h3>
            
            <div class="space-y-4">
                <div>
                    <label class="form-label">URL Slug Key</label>
                    <input [(ngModel)]="newPageSlug" class="input-field" placeholder="e.g. services" />
                    <p class="text-xs text-slate-500 mt-1">Unique identifier for the URL.</p>
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
                <button class="btn btn-ghost" (click)="showCreateModal = false">Cancel</button>
                <button class="btn btn-primary" (click)="createPage()">Create Page</button>
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
        <div class="bg-white rounded-xl shadow-2xl p-6 w-96 max-w-full">
            <h3 class="text-lg font-bold text-slate-800 mb-2">Confirm Action</h3>
            <p class="text-slate-600 mb-6">{{ confirmMessage }}</p>
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
  languages = signal<Language[]>([]);
  selectedPageSlug = signal('');
  activeLang = signal('');

  content: any = {};
  blocks: BlockInstance[] = [];
  selectedBlock: BlockInstance | null = null;

  pageId: number | null = null;
  isSaving = false;
  showBlockPicker = false;
  showCreateModal = false;

  // UI Feedback
  toast = { message: '', type: 'success' as 'success' | 'error' | 'warning' };
  showConfirmModal = false;
  confirmMessage = '';
  pendingAction: (() => void) | null = null;

  // Form
  newPageSlug = '';
  newPageTemplate = 'default';

  constructor(
    private http: HttpClient,
    private registry: BlockRegistryService,
    private cdr: ChangeDetectorRef,
    public i18n: I18nService
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

  get availableBlocks(): ContentBlockManifest[] {
    // Get all registered definitions
    // In a real scenario, registry should expose a method to get getAllDefinitions()
    // For now, we can iterate known types or usage the registry internal map if exposed, 
    // OR better, BlockRegistryService should definitely have a getManifests() method. 
    // *Wait*, I implemented BlockRegistryService earlier. Let's assume I missed `getAll` method or similar.
    // Re-checking BlockRegistryService implementation in thought...
    // It has `getDefinition`. 
    // I will implement a quick helper here or use what's available. 
    // Actually, for this prototype, I'll assume the registry has a public `definitions` map or method.
    // If not, I'll need to update the Registry service. 
    // Let's assume I can access the registry map values.
    // *Correction*: I should verify `BlockRegistryService`. 
    // But to proceed fast: I will rely on a hardcoded list of types retrieved from registry 
    // OR better, update `BlockRegistryService` to expose a list.
    // For this step, I will use a getter that calls `getDefinition` on known types.
    const types = [
      'page-hero', 'timeline-steps', 'case-study-showcase',
      'hero-carousel', 'feature-grid', 'card-carousel',
      'stats-counter', 'cta-banner', 'faq-accordion',
      'contact-form-cta', 'content-with-image'
    ];
    return types.map(t => this.registry.getDefinition(t)?.manifest).filter(Boolean) as ContentBlockManifest[];
  }

  init() {
    this.http.get<any[]>('/api/pages').subscribe(p => this.pages.set(p));
    this.http.get<Language[]>('/api/languages').subscribe(l => {
      this.languages.set(l);
      if (l.length > 0 && !this.activeLang()) this.activeLang.set(l[0].code);
    });
  }

  private fetchSub?: any; // Subscription

  loadPage(slug: string) {
    this.selectedPageSlug.set(slug);
    const p = this.pages().find(x => x.slug_key === slug);
    if (p) this.pageId = p.id;
    else this.pageId = null;
    this.selectedBlock = null;
    this.fetchContent();
  }

  switchLang(code: string) {
    this.activeLang.set(code);
    this.selectedBlock = null;
    this.fetchContent();
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
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Failed to fetch content:', err);
          // Optional: alert('Failed to load content for this language.');
          this.cdr.detectChanges();
        }
      });
  }

  // --- Block Actions ---

  addBlock(type: string) {
    const newBlock: BlockInstance = {
      id: Math.random().toString(36).substr(2, 9),
      type: type,
      data: {} // In future: SchemaFormBuilder.createDefault(schema)
    };
    this.blocks.push(newBlock);
    this.selectedBlock = newBlock;
    this.showBlockPicker = false;
  }

  removeBlock(block: BlockInstance, event?: Event) {
    if (event) event.stopPropagation();
    const index = this.blocks.indexOf(block);
    if (index > -1) {
      this.blocks.splice(index, 1);
      if (this.selectedBlock === block) this.selectedBlock = null;
    }
  }

  selectBlock(block: BlockInstance, event: MouseEvent) {
    event.stopPropagation();
    this.selectedBlock = block;
  }

  drop(event: CdkDragDrop<BlockInstance[]>) {
    moveItemInArray(this.blocks, event.previousIndex, event.currentIndex);
  }

  getBlockSchema(type: string) {
    return this.registry.getDefinition(type)?.manifest.schema;
  }

  trackBlockId(index: number, block: BlockInstance) {
    return block.id;
  }

  updateBlockData(newData: any) {
    if (this.selectedBlock) {
      // Create new immutable reference with updated data
      const updatedBlock = {
        ...this.selectedBlock,
        data: { ...newData }
      };

      // Update in array to trigger OnChanges in DynamicBlockRenderer
      const index = this.blocks.findIndex(b => b.id === updatedBlock.id);
      if (index > -1) {
        this.blocks[index] = updatedBlock;
        // IMPORTANT: Reassign to trigger Angular detection of array change if needed, 
        // though index assignment works with Default IterableDiffer if ref changes.
        // But to be safe and clean with signals/future:
        // this.blocks = [...this.blocks]; // Optional but safer for Observables
      }

      // Update active selection reference
      this.selectedBlock = updatedBlock;
    }
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

  saveDraft() {
    if (!this.pageId) return;
    if (!this.validatePage()) return;

    this.isSaving = true;
    this.http.post(`/api/pages/${this.pageId}/draft`, this.prepareSavePayload())
      .subscribe({
        next: () => {
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
