import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { PageService } from '../../core/services/page.service';
import { I18nService } from '../../core/services/i18n.service';
import { PageContent } from '../../core/models/language.model';
import { BlockRendererComponent } from '../content-blocks/block-renderer.component';

@Component({
  selector: 'app-dynamic-page',
  standalone: true,
  imports: [CommonModule, BlockRendererComponent],
  template: `
    <div class="min-h-screen bg-white">
      <!-- Content Blocks -->
      <ng-container *ngIf="pageContent(); else loading">
        <!-- Check if using advanced blocks -->
        <ng-container *ngIf="hasAdvancedBlocks(); else legacyLayout">
          <app-block-renderer *ngFor="let block of blocks()" [block]="block"></app-block-renderer>
        </ng-container>
        
        <!-- Legacy layout for basic text/html blocks -->
        <ng-template #legacyLayout>
          <div class="max-w-4xl mx-auto px-6 py-16 md:py-24">
            <header class="text-center mb-16">
              <h1 class="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
                {{ pageContent()?.title }}
              </h1>
              <div class="w-16 h-1 bg-blue-600 mx-auto rounded-full"></div>
            </header>
            <article class="prose prose-lg prose-slate mx-auto">
              <ng-container *ngFor="let block of blocks()">
                <p *ngIf="block.type === 'text'" class="text-slate-600 leading-relaxed text-lg">
                  {{ block.content }}
                </p>
                <div *ngIf="block.type === 'html'" [innerHTML]="block.content"></div>
                <figure *ngIf="block.type === 'image'" class="my-12">
                  <img [src]="block.content" alt="Content image" class="w-full rounded-2xl shadow-lg" />
                </figure>
              </ng-container>
            </article>
          </div>
        </ng-template>
      </ng-container>

      <!-- Skeleton Loading -->
      <ng-template #loading>
        <div class="max-w-4xl mx-auto px-6 py-24 animate-pulse">
          <div class="text-center mb-16">
            <div class="h-12 bg-slate-200 rounded-lg w-2/3 mx-auto mb-4"></div>
            <div class="w-16 h-1 bg-slate-200 mx-auto rounded-full"></div>
          </div>
          <div class="space-y-4">
            <div class="h-4 bg-slate-200 rounded w-full"></div>
            <div class="h-4 bg-slate-200 rounded w-full"></div>
            <div class="h-4 bg-slate-200 rounded w-5/6"></div>
            <div class="h-64 bg-slate-200 rounded-2xl mt-8"></div>
          </div>
        </div>
      </ng-template>
    </div>
  `
})
export class DynamicPageComponent implements OnInit {
  pageContent = signal<PageContent | null>(null);
  blocks = signal<any[]>([]);

  // Advanced block types that use BlockRenderer
  private advancedBlockTypes = [
    'hero-carousel', 'feature-grid', 'card-carousel', 'stats-counter',
    'cta-banner', 'case-study-showcase', 'page-hero', 'faq-accordion',
    'timeline-steps', 'tabbed-content', 'content-with-image', 'case-cards',
    'contact-form-cta'
  ];

  constructor(
    private route: ActivatedRoute,
    private pageService: PageService,
    private i18n: I18nService,
    private title: Title,
    private meta: Meta
  ) { }

  hasAdvancedBlocks(): boolean {
    const blockList = this.blocks();
    return blockList.length > 0 && blockList.some(b => this.advancedBlockTypes.includes(b.type));
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const lang = params.get('lang') || 'en';
      const slug = params.get('slug') || 'home';

      this.pageService.getPage(slug, lang).subscribe({
        next: (data) => {
          if (data && data.title) {
            this.pageContent.set(data);
            this.title.setTitle(data.seo_title || data.title);
            this.meta.updateTag({ name: 'description', content: data.seo_desc || '' });
            this.blocks.set((data.content_json && Array.isArray(data.content_json)) ? data.content_json : []);
          } else {
            this.pageContent.set({ title: 'Page Not Found', content_json: {}, seo_title: '404', seo_desc: '', slug_localized: '' });
            this.blocks.set([{ type: 'text', content: 'The page you are looking for does not exist.' }]);
          }
        },
        error: () => {
          this.pageContent.set({ title: 'Error', content_json: {}, seo_title: 'Error', seo_desc: '', slug_localized: '' });
        }
      });
    });
  }
}
