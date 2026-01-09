import { Component, OnInit, signal, effect, Injector, runInInjectionContext } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { PageService } from '../../core/services/page.service';
import { I18nService } from '../../core/services/i18n.service';
import { PageContent } from '../../core/models/language.model';

@Component({
    selector: 'app-dynamic-page',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="page-container" *ngIf="pageContent(); else loading">
      <h1>{{ pageContent()?.title }}</h1>
      <div class="content-body" [innerHTML]="jsonToHtml(pageContent()?.content_json)"></div>
    </div>
    <ng-template #loading>
      <p>Loading...</p>
    </ng-template>
  `,
    styles: [`
    .page-container { max-width: 800px; margin: 0 auto; padding: 20px; }
  `]
})
export class DynamicPageComponent implements OnInit {
    pageContent = signal<PageContent | null>(null);

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private pageService: PageService,
        private i18n: I18nService,
        private title: Title,
        private meta: Meta
    ) { }

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            const lang = params.get('lang') || 'en';
            const slug = params.get('slug') || 'home';

            // Update I18n Service
            if (lang !== this.i18n.currentLang()) {
                // In a real app we might want to validate if lang is supported
            }

            this.pageService.getPage(slug, lang).subscribe({
                next: (data) => {
                    if (data && data.title) {
                        this.pageContent.set(data);
                        this.updateSeo(data);
                    } else {
                        // 404 handling
                        this.pageContent.set({ title: 'Not Found', content_json: {}, seo_title: '404', seo_desc: '', slug_localized: '' });
                    }
                },
                error: () => {
                    this.pageContent.set({ title: 'Error', content_json: {}, seo_title: 'Error', seo_desc: '', slug_localized: '' });
                }
            });
        });
    }

    updateSeo(data: PageContent) {
        this.title.setTitle(data.seo_title || data.title);
        this.meta.updateTag({ name: 'description', content: data.seo_desc || '' });
    }

    // Simple Block Renderer for Demo
    jsonToHtml(json: any): string {
        // Expecting simple structure: { "blocks": [ { "type": "text", "content": "..." } ] }
        // Or just raw html/text for MVP
        if (!json) return '';
        if (typeof json === 'string') return json;

        // Detailed implementation would use a proper block renderer system
        return JSON.stringify(json);
    }
}
