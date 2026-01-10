import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Language } from '../../core/models/language.model';
import { MediaPickerComponent } from '../media-picker/media-picker.component';
import { MediaFile } from '../../core/services/media.service';

interface Block {
  type: 'text' | 'image' | 'html';
  content: string;
}

@Component({
  selector: 'app-page-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, MediaPickerComponent],
  template: `
    <div>
      <!-- Page Header -->
      <div class="admin-page-header">
        <h1 class="admin-page-title">Page Editor</h1>
        <select [ngModel]="selectedPageSlug()" (ngModelChange)="loadPage($event)" class="input-field w-64">
            <option value="">Select a page...</option>
            <option *ngFor="let p of pages()" [value]="p.slug_key">{{ p.slug_key }}</option>
        </select>
      </div>

      <!-- Language Tabs + Editor -->
      <div *ngIf="selectedPageSlug()" class="card">
        <!-- Language Tabs -->
        <div class="border-b border-slate-200">
          <nav class="flex -mb-px">
            <button *ngFor="let lang of languages()" 
                (click)="switchLang(lang.code)"
                [class.border-blue-500]="activeLang() === lang.code"
                [class.text-blue-600]="activeLang() === lang.code"
                [class.border-transparent]="activeLang() !== lang.code"
                [class.text-slate-500]="activeLang() !== lang.code"
                class="px-6 py-4 text-sm font-medium border-b-2 hover:text-slate-700 transition-colors">
              {{ lang.name }} <span class="text-xs opacity-60 ml-1">({{ lang.code }})</span>
            </button>
          </nav>
        </div>

        <div class="card-body" *ngIf="activeLang()">
          <!-- Metadata Section -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 pb-8 border-b border-slate-100">
            <div>
              <label class="form-label">Page Title</label>
              <input [(ngModel)]="content.title" class="input-field" placeholder="Enter page title" />
            </div>
            <div>
              <label class="form-label">URL Slug</label>
              <div class="flex">
                <span class="inline-flex items-center px-3 text-sm text-slate-500 bg-slate-50 border border-r-0 border-slate-300 rounded-l-lg">/{{ activeLang() }}/</span>
                <input [(ngModel)]="content.slug_localized" class="input-field rounded-l-none" />
              </div>
            </div>
            <div>
              <label class="form-label">SEO Title</label>
              <input [(ngModel)]="content.seo_title" class="input-field" />
            </div>
            <div>
              <label class="form-label">SEO Description</label>
              <textarea [(ngModel)]="content.seo_desc" rows="2" class="input-field"></textarea>
            </div>
          </div>

          <!-- Content Blocks -->
          <div>
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-slate-800">Content Blocks</h3>
              <div class="flex gap-2">
                <button (click)="addBlock('text')" class="btn btn-secondary btn-sm">+ Text</button>
                <button (click)="addBlock('image')" class="btn btn-secondary btn-sm">+ Image</button>
                <button (click)="addBlock('html')" class="btn btn-secondary btn-sm">+ HTML</button>
              </div>
            </div>

            <div class="space-y-4 min-h-[200px]">
              <div *ngFor="let block of blocks; let i = index" 
                   class="group relative bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors">
                <!-- Block Header -->
                <div class="flex items-center justify-between px-4 py-2 bg-slate-100 rounded-t-lg border-b border-slate-200">
                  <span class="badge badge-default text-xs">{{ block.type | uppercase }}</span>
                  <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button (click)="moveBlock(i, -1)" *ngIf="i > 0" class="btn btn-ghost btn-icon text-slate-500">↑</button>
                    <button (click)="moveBlock(i, 1)" *ngIf="i < blocks.length - 1" class="btn btn-ghost btn-icon text-slate-500">↓</button>
                    <button (click)="removeBlock(i)" class="btn btn-ghost btn-icon text-red-500">×</button>
                  </div>
                </div>
                
                <!-- Block Content -->
                <div class="p-4">
                  <textarea *ngIf="block.type === 'text'" [(ngModel)]="block.content" rows="3" 
                      class="input-field bg-white" placeholder="Enter text content..."></textarea>
                  <textarea *ngIf="block.type === 'html'" [(ngModel)]="block.content" rows="4" 
                      class="input-field bg-white font-mono text-sm" placeholder="<p>HTML content</p>"></textarea>
                  <div *ngIf="block.type === 'image'">
                    <div *ngIf="block.content" class="relative rounded-lg overflow-hidden bg-white border border-slate-200">
                      <img [src]="block.content" class="max-h-48 mx-auto" />
                      <button (click)="openPicker(i)" class="absolute inset-0 bg-black/50 text-white opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        Change Image
                      </button>
                    </div>
                    <button *ngIf="!block.content" (click)="openPicker(i)" class="w-full py-8 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-blue-400 hover:text-blue-500 transition-colors">
                      Select Image
                    </button>
                  </div>
                </div>
              </div>
              
              <div *ngIf="blocks.length === 0" class="py-12 text-center text-slate-400 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                No blocks yet. Add your first block above.
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-100">
            <div class="mr-auto flex items-center text-sm text-slate-500 italic">
                <span class="w-2 h-2 rounded-full bg-amber-400 mr-2"></span>
                Editing Draft Version
            </div>
            <button class="btn btn-secondary" (click)="saveDraft()">
              Save Draft
            </button>
            <button class="btn btn-primary" (click)="publish()">
              Publish
            </button>
          </div>
        </div>
      </div>
      
      <div *ngIf="!selectedPageSlug() && pages().length === 0" class="card">
        <div class="card-body text-center py-12">
          <h3 class="text-lg font-medium text-slate-600 mb-4">No pages yet</h3>
          <button class="btn btn-primary" (click)="createHome()">Create Home Page</button>
        </div>
      </div>

      <app-media-picker *ngIf="showPicker" (onSelect)="onImageSelected($event)" (onCancel)="showPicker = false"></app-media-picker>
    </div>
  `
})
export class PageEditorComponent {
  pages = signal<any[]>([]);
  languages = signal<Language[]>([]);
  selectedPageSlug = signal('');
  activeLang = signal('');
  content: any = {};
  pageId: number | null = null;
  blocks: Block[] = [];
  showPicker = false;
  currentBlockIndex: number | null = null;

  constructor(private http: HttpClient) { this.init(); }

  init() {
    this.http.get<any[]>('/api/pages').subscribe(p => this.pages.set(p));
    this.http.get<Language[]>('/api/languages').subscribe(l => {
      this.languages.set(l);
      if (l.length > 0) this.activeLang.set(l[0].code);
    });
  }

  loadPage(slug: string) {
    this.selectedPageSlug.set(slug);
    const p = this.pages().find(x => x.slug_key === slug);
    if (p) this.pageId = p.id;
    this.fetchContent();
  }

  switchLang(code: string) { this.activeLang.set(code); this.fetchContent(); }

  fetchContent() {
    if (!this.pageId || !this.activeLang()) return;
    this.http.get<any>(`/api/pages/${this.pageId}/draft?lang=${this.activeLang()}`)
      .subscribe(data => {
        this.content = data.title ? data : { title: '', slug_localized: '', seo_title: '', seo_desc: '' };
        const json = this.content.content_json;
        this.blocks = (json && Array.isArray(json)) ? json : [];
      });
  }

  addBlock(type: 'text' | 'image' | 'html') { this.blocks.push({ type, content: '' }); }
  removeBlock(index: number) { this.blocks.splice(index, 1); }
  moveBlock(index: number, direction: number) {
    const newIndex = index + direction;
    if (newIndex >= 0 && newIndex < this.blocks.length) {
      [this.blocks[index], this.blocks[newIndex]] = [this.blocks[newIndex], this.blocks[index]];
    }
  }
  openPicker(index: number) { this.currentBlockIndex = index; this.showPicker = true; }
  onImageSelected(file: MediaFile) {
    if (this.currentBlockIndex !== null) this.blocks[this.currentBlockIndex].content = file.url;
    this.showPicker = false; this.currentBlockIndex = null;
  }

  saveDraft() {
    if (!this.pageId) return;
    this.content.content_json = this.blocks;
    this.http.post(`/api/pages/${this.pageId}/draft`, { lang: this.activeLang(), ...this.content })
      .subscribe({
        next: () => alert('Draft Saved! (Changes are NOT live)'),
        error: (e) => alert('Error saving draft: ' + e.message)
      });
  }

  publish() {
    if (!this.pageId) return;
    if (!confirm('Are you sure you want to publish these changes to the live website? This will backup the current version.')) return;

    this.content.content_json = this.blocks;
    this.http.post(`/api/pages/${this.pageId}/publish`, { lang: this.activeLang(), ...this.content })
      .subscribe({
        next: () => alert('Published Successfully!'),
        error: (e) => alert('Error publishing: ' + e.message)
      });
  }
  createHome() {
    this.http.post('/api/pages', { slug_key: 'home', template: 'home' }).subscribe(() => this.init());
  }
}
