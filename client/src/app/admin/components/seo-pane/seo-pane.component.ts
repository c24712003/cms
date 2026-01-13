import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';
import { SeoPanelComponent } from '../seo-panel.component';
import { BlockInstance } from '../../../features/content-blocks/block.types';

@Component({
    selector: 'app-seo-pane',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslatePipe, SeoPanelComponent],
    template: `
    <div class="h-full overflow-y-auto bg-slate-50 dark:bg-slate-900">
      <div class="max-w-4xl mx-auto p-6 lg:p-8">
        
        <!-- Header -->
        <div class="mb-8 flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold text-slate-800 dark:text-white mb-2">
              {{ 'TAB_SEO' | translate }}
            </h2>
            <p class="text-slate-500 dark:text-slate-400">
              Optimize your page for search engines and social sharing
            </p>
          </div>
          
          <!-- SEO Score Badge -->
          <div class="flex items-center gap-3">
            <div class="text-right">
              <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Score</p>
              <p class="text-3xl font-bold"
                 [class.text-emerald-600]="seoScore >= 80"
                 [class.text-amber-500]="seoScore < 80 && seoScore >= 50"
                 [class.text-red-500]="seoScore < 50">
                {{ seoScore }}
              </p>
            </div>
            <div class="w-16 h-16 rounded-full border-4 flex items-center justify-center"
                 [class.border-emerald-500]="seoScore >= 80"
                 [class.bg-emerald-50]="seoScore >= 80"
                 [class.dark:bg-emerald-900/30]="seoScore >= 80"
                 [class.border-amber-500]="seoScore < 80 && seoScore >= 50"
                 [class.bg-amber-50]="seoScore < 80 && seoScore >= 50"
                 [class.dark:bg-amber-900/30]="seoScore < 80 && seoScore >= 50"
                 [class.border-red-500]="seoScore < 50"
                 [class.bg-red-50]="seoScore < 50"
                 [class.dark:bg-red-900/30]="seoScore < 50">
              <span class="text-2xl">
                {{ seoScore >= 80 ? '✓' : seoScore >= 50 ? '!' : '✗' }}
              </span>
            </div>
          </div>
        </div>
        
        <!-- SEO Settings Card -->
        <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden mb-6">
          
          <!-- Meta Tags Section -->
          <div class="p-6 border-b border-slate-100 dark:border-slate-700">
            <h3 class="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
              Meta Tags
            </h3>
            
            <div class="space-y-6">
              <!-- SEO Title -->
              <div>
                <label class="flex items-center justify-between text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  <span>SEO Title</span>
                  <span class="font-normal text-slate-400 dark:text-slate-500">
                    {{ content.seo_title?.length || 0 }}/60
                  </span>
                </label>
                <input 
                  [ngModel]="content.seo_title"
                  (ngModelChange)="onContentChange('seo_title', $event)"
                  class="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 
                         bg-white dark:bg-slate-700 text-slate-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  [class.border-amber-400]="(content.seo_title?.length || 0) > 60"
                  placeholder="SEO Title (recommended 50-60 characters)" />
                <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  This will appear as the title in search engine results
                </p>
              </div>
              
              <!-- Meta Description -->
              <div>
                <label class="flex items-center justify-between text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  <span>Meta Description</span>
                  <span class="font-normal text-slate-400 dark:text-slate-500">
                    {{ content.seo_desc?.length || 0 }}/160
                  </span>
                </label>
                <textarea 
                  [ngModel]="content.seo_desc"
                  (ngModelChange)="onContentChange('seo_desc', $event)"
                  rows="3"
                  class="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 
                         bg-white dark:bg-slate-700 text-slate-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                  [class.border-amber-400]="(content.seo_desc?.length || 0) > 160"
                  placeholder="Page description (recommended 120-160 characters)"></textarea>
              </div>
            </div>
          </div>
          
          <!-- Open Graph Section -->
          <div class="p-6">
            <h3 class="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
              Social Sharing (Open Graph)
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- OG Image -->
              <div class="md:col-span-2">
                <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  OG Image URL
                </label>
                <input 
                  [ngModel]="content.og_image"
                  (ngModelChange)="onContentChange('og_image', $event)"
                  class="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 
                         bg-white dark:bg-slate-700 text-slate-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="https://example.com/og-image.jpg" />
                <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Recommended size: 1200x630 pixels for best display on social media
                </p>
              </div>
              
              <!-- OG Image Preview -->
              <div *ngIf="content.og_image" class="md:col-span-2">
                <div class="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-600 bg-slate-100 dark:bg-slate-700">
                  <img [src]="content.og_image" 
                       alt="OG Image Preview" 
                       class="w-full h-48 object-cover"
                       (error)="onImageError($event)" />
                </div>
              </div>
            </div>
          </div>
          
        </div>
        
        <!-- SEO Checker Panel -->
        <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div class="p-6">
            <h3 class="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
              SEO Analysis
            </h3>
            <app-seo-panel
              [title]="content.seo_title || content.title"
              [description]="content.seo_desc"
              [content]="blocks"
              [language]="activeLang">
            </app-seo-panel>
          </div>
        </div>
        
      </div>
    </div>
  `
})
export class SeoPaneComponent {
    @Input() content: any = {};
    @Input() blocks: BlockInstance[] = [];
    @Input() activeLang: string = '';
    @Input() seoScore: number = 0;

    @Output() contentChange = new EventEmitter<{ field: string; value: any }>();
    @Output() seoScoreChange = new EventEmitter<void>();

    onContentChange(field: string, value: any) {
        this.contentChange.emit({ field, value });
        this.seoScoreChange.emit();
    }

    onImageError(event: Event) {
        const img = event.target as HTMLImageElement;
        img.style.display = 'none';
    }
}
