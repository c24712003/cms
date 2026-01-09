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
    <div class="min-h-screen bg-white">
        <div class="max-w-4xl mx-auto px-6 py-12 md:py-20" *ngIf="pageContent(); else loading">
        
            <div class="mb-12 text-center">
                 <h1 class="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
                    {{ pageContent()?.title }}
                 </h1>
                 <div class="h-1 w-20 bg-blue-600 mx-auto"></div>
            </div>

            <div class="prose prose-lg prose-slate mx-auto text-slate-600 leading-loose">
                <ng-container *ngFor="let block of blocks()">
                    
                    <!-- Text Block -->
                    <div *ngIf="block.type === 'text'" class="mb-8 font-serif text-xl">
                        <p>{{ block.content }}</p>
                    </div>

                    <!-- HTML Block -->
                    <div *ngIf="block.type === 'html'" class="mb-8" [innerHTML]="block.content"></div>

                    <!-- Image Block -->
                    <div *ngIf="block.type === 'image'" class="mb-12">
                        <img [src]="block.content" alt="Page Image" class="w-full rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-500" />
                    </div>

                </ng-container>
            </div>
            
        </div>
        <ng-template #loading>
            <!-- Skeleton Loader -->
            <div class="max-w-4xl mx-auto px-6 py-20 animate-pulse">
                <div class="h-12 bg-slate-200 rounded w-3/4 mx-auto mb-8"></div>
                <div class="h-4 bg-slate-200 rounded w-1/2 mx-auto mb-16"></div>
                <div class="space-y-4">
                    <div class="h-4 bg-slate-200 rounded w-full"></div>
                    <div class="h-4 bg-slate-200 rounded w-full"></div>
                    <div class="h-4 bg-slate-200 rounded w-5/6"></div>
                </div>
            </div>
        </ng-template>
    </div>
  `
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
                        if (data.content_json && Array.isArray(data.content_json)) {
                            this.blocks.set(data.content_json);
                        } else {
                            this.blocks.set([]);
                        }
                    } else {
                        this.pageContent.set({ title: 'Page Not Found', content_json: {}, seo_title: '404', seo_desc: '', slug_localized: '' });
                        this.blocks.set([{ type: 'text', content: 'Sorry, the page you are looking for does not exist.' }]);
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
