import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Language } from '../../core/models/language.model';

@Component({
    selector: 'app-page-editor',
    standalone: true,
    imports: [CommonModule, FormsModule],
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
                    <textarea [(ngModel)]="content.seo_desc"></textarea>
                </div>
            </fieldset>

            <div class="form-group">
                <label>Content JSON (Block Structure)</label>
                <textarea class="json-editor" [ngModel]="jsonString()" (change)="updateJson($event)"></textarea>
            </div>

            <div class="actions">
                <button class="btn-primary" (click)="save()">Save {{ activeLang() }} Version</button>
            </div>
        </div>
    </div>
    
    <div *ngIf="!selectedPageSlug() && pages().length === 0">
        <p>No pages found. <button (click)="createHome()">Create Home Page</button></p>
    </div>
  `,
    styles: [`
    .page-header { display: flex; align-items: center; gap: 20px; margin-bottom: 20px; }
    .lang-tabs { display: flex; border-bottom: 1px solid #ddd; margin-bottom: 20px; }
    .lang-tabs button { background: none; border: none; padding: 10px 20px; cursor: pointer; border-bottom: 2px solid transparent; }
    .lang-tabs button.active { border-bottom-color: #3498db; color: #3498db; font-weight: bold; }
    
    .form-group { margin-bottom: 15px; }
    .form-group label { display: block; margin-bottom: 5px; font-weight: 500; }
    input, textarea { width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
    textarea.json-editor { height: 200px; font-family: monospace; }
    
    .btn-primary { background: #3498db; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; }
    fieldset { border: 1px solid #ddd; padding: 15px; border-radius: 4px; margin-bottom: 15px; }
  `]
})
export class PageEditorComponent {
    pages = signal<any[]>([]);
    languages = signal<Language[]>([]);

    selectedPageSlug = signal('');
    activeLang = signal('');

    // Using simple object for form binding
    content: any = {};
    pageId: number | null = null;

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
                    title: '', slug_localized: '', seo_title: '', seo_desc: '', content_json: {}
                };
            });
    }

    jsonString() {
        return JSON.stringify(this.content.content_json || {}, null, 2);
    }

    updateJson(event: Event) {
        try {
            const val = (event.target as HTMLTextAreaElement).value;
            this.content.content_json = JSON.parse(val);
        } catch (e) {
            alert('Invalid JSON');
        }
    }

    save() {
        if (!this.pageId) return;
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
