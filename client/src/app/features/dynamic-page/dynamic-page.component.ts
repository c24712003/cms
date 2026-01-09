import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
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
      
      <div class="content-blocks">
        <ng-container *ngFor="let block of blocks()">
            
            <!-- Text Block -->
            <div *ngIf="block.type === 'text'" class="block-text">
                <p>{{ block.content }}</p>
            </div>

            <!-- HTML Block -->
            <div *ngIf="block.type === 'html'" class="block-html" [innerHTML]="block.content"></div>

            <!-- Image Block -->
            <div *ngIf="block.type === 'image'" class="block-image">
                <img [src]="block.content" alt="Page Image" />
            </div>

        </ng-container>
      </div>
    
    </div>
    <ng-template #loading>
      <p>Loading...</p>
    </ng-template>
  `,
    styles: [`
    .page-container { max-width: 800px; margin: 0 auto; padding: 20px; }
    .block-text { margin-bottom: 1.5rem; line-height: 1.6; }
    .block-image { margin-bottom: 2rem; text-align: center; }
    .block-image img { max-width: 100%; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
  `]
})
export class DynamicPageComponent implements OnInit {
    pageContent = signal<PageContent | null>(null);
    blocks = signal<any[]>([]);

    constructor(
        private route: ActivatedRoute,
        private pageService: PageService,
        private i18n: I18nService,
        private title: Title,
        private meta: Meta
    ) { }

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            const lang = params.get('lang') || 'en';
            const slug = params.get('slug') || 'home';

            this.pageService.getPage(slug, lang).subscribe({
                next: (data) => {
                    if (data && data.title) {
                        this.pageContent.set(data);
                        this.updateSeo(data);

                        // Parse Content JSON
                        if (data.content_json && Array.isArray(data.content_json)) {
                            this.blocks.set(data.content_json);
                        } else {
                            this.blocks.set([]);
                        }
                    } else {
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
}
