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
    <div class="page-header">
      <h1>Page Content Editor</h1>
      <select [ngModel]="selectedPageSlug()" (ngModelChange)="loadPage($event)">
          <option value="">Select a Page...</option>
          <option *ngFor="let p of pages()" [value]="p.slug_key">{{ p.slug_key }}</option>
      </select>
    </div>

    <!-- Language Tabs -->
    <div *ngIf="selectedPageSlug()" class="editor-container">
        <div class="lang-tabs">
            <button 
                *ngFor="let lang of languages()" 
                [class.active]="activeLang() === lang.code"
                (click)="switchLang(lang.code)"
            >{{ lang.name }} ({{ lang.code }})</button>
        </div>

        <div class="form-content" *ngIf="activeLang()">
            <div class="form-group">
                <label>Page Title</label>
                <input [(ngModel)]="content.title" />
            </div>
            
            <div class="form-group">
                <label>Localized Slug (URL)</label>
                <input [(ngModel)]="content.slug_localized" />
            </div>

            <fieldset>
                <legend>SEO</legend>
                <div class="form-group">
                    <label>Meta Title</label>
                    <input [(ngModel)]="content.seo_title" />
                </div>
                <div class="form-group">
                    <label>Meta Description</label>
                    <textarea [(ngModel)]="content.seo_desc" rows="2"></textarea>
                </div>
            </fieldset>

            <div class="block-editor">
                <h3>Content Blocks</h3>
                <div class="blocks-list">
                    <div class="block-item" *ngFor="let block of blocks; let i = index">
                        <div class="block-header">
                            <span class="type-tag">{{ block.type | uppercase }}</span>
                            <div class="actions">
                                <button class="btn-sm danger" (click)="removeBlock(i)">Delete</button>
                                <button class="btn-sm" *ngIf="i > 0" (click)="moveBlock(i, -1)">↑</button>
                                <button class="btn-sm" *ngIf="i < blocks.length - 1" (click)="moveBlock(i, 1)">↓</button>
                            </div>
                        </div>
                        
                        <!-- Text Block -->
                        <div *ngIf="block.type === 'text'" class="block-body">
                            <textarea [(ngModel)]="block.content" rows="4" placeholder="Enter text content..."></textarea>
                        </div>
                        
                         <!-- HTML Block -->
                        <div *ngIf="block.type === 'html'" class="block-body">
                            <textarea [(ngModel)]="block.content" rows="4" placeholder="Enter raw HTML..."></textarea>
                        </div>

                        <!-- Image Block -->
                        <div *ngIf="block.type === 'image'" class="block-body image-block">
                            <div *ngIf="block.content" class="preview">
                                <img [src]="block.content" style="max-height: 100px;" />
                                <button (click)="openPicker(i)">Change Image</button>
                            </div>
                            <div *ngIf="!block.content">
                                <button (click)="openPicker(i)">Select Image</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="add-bar">
                    <button (click)="addBlock('text')">+ Text</button>
                    <button (click)="addBlock('image')">+ Image</button>
                    <button (click)="addBlock('html')">+ HTML</button>
                </div>
            </div>

            <div class="actions main-actions">
                <button class="btn-primary" (click)="save()">Save {{ activeLang() }} Version</button>
            </div>
        </div>
    </div>
    
    <div *ngIf="!selectedPageSlug() && pages().length === 0">
        <p>No pages found. <button (click)="createHome()">Create Home Page</button></p>
    </div>

    <app-media-picker *ngIf="showPicker" (onSelect)="onImageSelected($event)" (onCancel)="showPicker = false"></app-media-picker>
  `,
    styles: [`
    .page-header { display: flex; align-items: center; gap: 20px; margin-bottom: 20px; }
    .lang-tabs { display: flex; border-bottom: 1px solid #ddd; margin-bottom: 20px; }
    .lang-tabs button { background: none; border: none; padding: 10px 20px; cursor: pointer; border-bottom: 2px solid transparent; }
    .lang-tabs button.active { border-bottom-color: #3498db; color: #3498db; font-weight: bold; }
    
    .form-group { margin-bottom: 15px; }
    .form-group label { display: block; margin-bottom: 5px; font-weight: 500; }
    input, textarea { width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
    
    .btn-primary { background: #3498db; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-size: 1rem; }
    fieldset { border: 1px solid #ddd; padding: 15px; border-radius: 4px; margin-bottom: 15px; }

    /* Block Editor Styles */
    .block-editor { background: #f9f9f9; padding: 15px; border-radius: 5px; border: 1px solid #eee; margin-bottom: 20px; }
    .block-item { background: white; border: 1px solid #ddd; margin-bottom: 10px; padding: 10px; border-radius: 4px; }
    .block-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
    .type-tag { font-size: 0.8rem; background: #eee; padding: 2px 6px; border-radius: 3px; font-weight: bold; color: #555; }
    .btn-sm { padding: 3px 8px; font-size: 0.8rem; margin-left: 5px; cursor: pointer; }
    .btn-sm.danger { color: #e74c3c; border: 1px solid #e74c3c; background: transparent; }
    .add-bar button { margin-right: 10px; padding: 8px 15px; background: #2ecc71; color: white; border: none; border-radius: 4px; cursor: pointer; }
    .main-actions { text-align: right; border-top: 1px solid #eee; padding-top: 20px; }
  `]
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
        this.http.get<any[]>('http://localhost:3000/api/pages').subscribe(p => this.pages.set(p));
        this.http.get<Language[]>('http://localhost:3000/api/languages').subscribe(l => {
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

        this.http.get<any>(`http://localhost:3000/api/pages/${this.selectedPageSlug()}/content?lang=${this.activeLang()}`)
            .subscribe(data => {
                this.content = data.title ? data : {
                    title: '', slug_localized: '', seo_title: '', seo_desc: ''
                };

                // Parse blocks
                const json = this.content.content_json;
                if (json && Array.isArray(json)) {
                    this.blocks = json;
                } else if (json && typeof json === 'object') {
                    // Migration support if structure was different (e.g. { blocks: [] })
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

        this.http.post(`http://localhost:3000/api/pages/${this.pageId}/content`, {
            lang: this.activeLang(),
            ...this.content
        }).subscribe(() => {
            alert('Saved!');
        });
    }

    createHome() {
        this.http.post('http://localhost:3000/api/pages', { slug_key: 'home', template: 'home' }).subscribe(() => {
            this.init();
        });
    }
}
