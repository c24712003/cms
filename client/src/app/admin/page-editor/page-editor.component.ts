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
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold text-slate-800">Page Editor</h2>
        <select [ngModel]="selectedPageSlug()" (ngModelChange)="loadPage($event)" class="input-field w-64 bg-white">
            <option value="">Select a Page...</option>
            <option *ngFor="let p of pages()" [value]="p.slug_key">{{ p.slug_key }}</option>
        </select>
      </div>

      <!-- Language Tabs -->
      <div *ngIf="selectedPageSlug()" class="space-y-6">
          <div class="flex border-b border-gray-200">
              <button 
                  *ngFor="let lang of languages()" 
                  [class.text-blue-600]="activeLang() === lang.code"
                  [class.border-blue-600]="activeLang() === lang.code"
                  class="px-6 py-3 font-medium text-sm text-slate-500 hover:text-slate-700 border-b-2 border-transparent transition-colors"
                  (click)="switchLang(lang.code)"
              >{{ lang.name }} <span class="text-xs uppercase ml-1 opacity-75">{{ lang.code }}</span></button>
          </div>

          <div class="space-y-8 animate-in fade-in duration-300" *ngIf="activeLang()">
              <!-- Metadata Card -->
              <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
                  <h3 class="text-lg font-bold text-slate-800 border-b border-gray-100 pb-2">Metadata</h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div class="space-y-1">
                          <label class="block text-sm font-medium text-slate-700">Page Title</label>
                          <input [(ngModel)]="content.title" class="input-field" placeholder="Entry Title" />
                      </div>
                      <div class="space-y-1">
                          <label class="block text-sm font-medium text-slate-700">URL Slug</label>
                          <div class="flex items-center">
                              <span class="bg-gray-50 border border-r-0 border-gray-300 rounded-l-lg px-3 py-2 text-gray-500 text-sm">/{{ activeLang() }}/</span>
                              <input [(ngModel)]="content.slug_localized" class="input-field rounded-l-none" />
                          </div>
                      </div>
                  </div>
                  <div class="space-y-4 pt-4">
                      <div class="space-y-1">
                          <label class="block text-sm font-medium text-slate-700">SEO Title</label>
                          <input [(ngModel)]="content.seo_title" class="input-field" />
                      </div>
                      <div class="space-y-1">
                          <label class="block text-sm font-medium text-slate-700">SEO Description</label>
                          <textarea [(ngModel)]="content.seo_desc" rows="2" class="input-field"></textarea>
                      </div>
                  </div>
              </div>

              <!-- Content Blocks -->
              <div class="space-y-4">
                  <div class="flex justify-between items-center">
                      <h3 class="text-lg font-bold text-slate-800">Content Blocks</h3>
                      <div class="flex space-x-2">
                          <button (click)="addBlock('text')" class="btn btn-secondary text-sm flex items-center shadow-sm">
                            <span class="mr-1 text-blue-500">¶</span> Text
                          </button>
                          <button (click)="addBlock('image')" class="btn btn-secondary text-sm flex items-center shadow-sm">
                            <span class="mr-1 text-emerald-500">🖼</span> Image
                          </button>
                          <button (click)="addBlock('html')" class="btn btn-secondary text-sm flex items-center shadow-sm">
                             <span class="mr-1 text-orange-500">&lt;/&gt;</span> HTML
                          </button>
                      </div>
                  </div>

                  <div class="space-y-4 min-h-[200px]">
                      <div *ngFor="let block of blocks; let i = index" 
                           class="group relative bg-white rounded-xl shadow-sm border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200">
                          
                          <!-- Drag Handle & Actions -->
                          <div class="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-50 rounded-l-xl border-r border-gray-100 cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600">
                              <span class="text-xl">⋮</span>
                          </div>

                          <div class="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                              <button (click)="moveBlock(i, -1)" *ngIf="i > 0" class="p-1 hover:bg-slate-100 rounded text-slate-500">↑</button>
                              <button (click)="moveBlock(i, 1)" *ngIf="i < blocks.length - 1" class="p-1 hover:bg-slate-100 rounded text-slate-500">↓</button>
                              <button (click)="removeBlock(i)" class="p-1 hover:bg-red-50 rounded text-red-500">✕</button>
                          </div>

                          <!-- Block Content -->
                          <div class="p-6 pl-12">
                              <div class="text-xs uppercase font-bold text-slate-300 mb-2 tracking-wider">{{ block.type }}</div>
                              
                              <!-- Text Block -->
                              <div *ngIf="block.type === 'text'">
                                  <textarea [(ngModel)]="block.content" rows="3" 
                                      class="w-full border-0 focus:ring-0 p-0 text-slate-700 text-lg placeholder-gray-300 resize-none font-serif leading-relaxed" 
                                      placeholder="Type your story here..."></textarea>
                              </div>
                              
                               <!-- HTML Block -->
                              <div *ngIf="block.type === 'html'">
                                  <textarea [(ngModel)]="block.content" rows="4" 
                                      class="w-full bg-slate-50 border border-slate-200 rounded p-3 font-mono text-sm text-slate-600 focus:border-blue-500 outline-none" 
                                      placeholder="<p>Raw HTML content</p>"></textarea>
                              </div>

                              <!-- Image Block -->
                              <div *ngIf="block.type === 'image'">
                                  <div *ngIf="block.content" class="relative group/img rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                                      <img [src]="block.content" class="max-h-64 mx-auto" />
                                      <div class="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 transition-opacity flex justify-center items-center">
                                          <button (click)="openPicker(i)" class="btn btn-secondary">Change Image</button>
                                      </div>
                                  </div>
                                  <div *ngIf="!block.content" class="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer" (click)="openPicker(i)">
                                      <div class="text-4xl mb-2">🖼</div>
                                      <span class="text-slate-500 font-medium">Select an Image</span>
                                  </div>
                              </div>
                          </div>
                      </div>
                      
                      <div *ngIf="blocks.length === 0" class="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 text-slate-400">
                          Add your first block to start writing.
                      </div>
                  </div>
              </div>

              <!-- Footer Actions -->
              <div class="sticky bottom-6 flex justify-end">
                  <button class="btn btn-primary shadow-lg border border-blue-500/50" (click)="save()">
                      Save {{ activeLang() | uppercase }} Version
                  </button>
              </div>
          </div>
      </div>
      
      <div *ngIf="!selectedPageSlug() && pages().length === 0" class="text-center py-20">
          <h3 class="text-xl font-medium text-slate-600 mb-4">No content yet.</h3>
          <button class="btn btn-primary" (click)="createHome()">Initialize Home Page</button>
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

    // Blocks
    blocks: Block[] = [];
    showPicker = false;
    currentBlockIndex: number | null = null;

    constructor(private http: HttpClient) {
        this.init();
    }

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

    switchLang(code: string) {
        this.activeLang.set(code);
        this.fetchContent();
    }

    fetchContent() {
        if (!this.selectedPageSlug() || !this.activeLang()) return;

        this.http.get<any>(`/api/pages/${this.selectedPageSlug()}/content?lang=${this.activeLang()}`)
            .subscribe(data => {
                this.content = data.title ? data : {
                    title: '', slug_localized: '', seo_title: '', seo_desc: ''
                };

                // Parse blocks
                const json = this.content.content_json;
                if (json && Array.isArray(json)) {
                    this.blocks = json;
                } else if (json && typeof json === 'object') {
                    this.blocks = []; // Default empty
                } else {
                    this.blocks = [];
                }
            });
    }

    addBlock(type: 'text' | 'image' | 'html') {
        this.blocks.push({ type, content: '' });
    }

    removeBlock(index: number) {
        this.blocks.splice(index, 1);
    }

    moveBlock(index: number, direction: number) {
        const newIndex = index + direction;
        if (newIndex >= 0 && newIndex < this.blocks.length) {
            [this.blocks[index], this.blocks[newIndex]] = [this.blocks[newIndex], this.blocks[index]];
        }
    }

    openPicker(index: number) {
        this.currentBlockIndex = index;
        this.showPicker = true;
    }

    onImageSelected(file: MediaFile) {
        if (this.currentBlockIndex !== null) {
            this.blocks[this.currentBlockIndex].content = file.url;
        }
        this.showPicker = false;
        this.currentBlockIndex = null;
    }

    save() {
        if (!this.pageId) return;

        // Update content object
        this.content.content_json = this.blocks;

        this.http.post(`/api/pages/${this.pageId}/content`, {
            lang: this.activeLang(),
            ...this.content
        }).subscribe(() => {
            alert('Saved!');
        });
    }

    createHome() {
        this.http.post('/api/pages', { slug_key: 'home', template: 'home' }).subscribe(() => {
            this.init();
        });
    }
}
