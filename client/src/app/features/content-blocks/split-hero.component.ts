import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContentBlockManifest } from './block.types';

interface CtaButton {
  text: string;
  link: string;
}

interface FeatureItem {
  icon: string;
  text: string;
}

@Component({
  selector: 'app-split-hero',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="py-16 md:py-24 bg-gradient-to-br from-slate-50 to-white overflow-hidden">
      <div class="max-w-7xl mx-auto px-6">
        <div 
          class="grid md:grid-cols-2 gap-12 md:gap-16 items-center"
          [class.md:flex-row-reverse]="mediaPosition === 'left'">
          
          <!-- Content Side -->
          <div [class.order-2]="mediaPosition === 'left'" [class.md:order-1]="mediaPosition === 'left'">
            <h1 class="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
              {{ title }}
            </h1>
            <p *ngIf="subtitle" class="text-lg text-slate-600 mb-8 leading-relaxed">
              {{ subtitle }}
            </p>
            
            <!-- Features List -->
            <ul *ngIf="features.length" class="space-y-4 mb-8">
              <li *ngFor="let feature of features" class="flex items-start gap-3">
                <span class="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                  <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                </span>
                <span class="text-slate-700">{{ feature.text }}</span>
              </li>
            </ul>
            
            <!-- CTAs -->
            <div class="flex flex-wrap gap-4">
              <a *ngIf="cta?.text" [routerLink]="cta?.link" class="btn-primary">
                {{ cta?.text }}
                <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              </a>
              <a *ngIf="secondaryCta?.text" [routerLink]="secondaryCta?.link" class="btn-secondary">
                {{ secondaryCta?.text }}
              </a>
            </div>
          </div>
          
          <!-- Media Side -->
          <div 
            [class.order-1]="mediaPosition === 'left'" 
            [class.md:order-2]="mediaPosition === 'left'"
            class="relative">
            <!-- Decorative Elements -->
            <div class="absolute -top-4 -right-4 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl"></div>
            <div class="absolute -bottom-8 -left-8 w-48 h-48 bg-indigo-200/40 rounded-full blur-2xl"></div>
            
            <!-- Image Container -->
            <div class="relative z-10 rounded-2xl overflow-hidden shadow-2xl shadow-slate-200/50">
              <img 
                *ngIf="image"
                [src]="image" 
                [alt]="title"
                class="w-full h-auto object-cover" />
              <div 
                *ngIf="!image" 
                class="w-full aspect-[4/3] bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <svg class="w-24 h-24 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .btn-primary {
      @apply inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/25 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5;
    }
    .btn-secondary {
      @apply inline-flex items-center px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl border border-slate-200 shadow-sm transition-all duration-300 hover:border-slate-300;
    }
  `]
})
export class SplitHeroComponent {
  static manifest: ContentBlockManifest = {
    type: 'split-hero',
    displayName: 'Split Hero',
    category: 'Hero & Headers',
    description: 'Side-by-side hero with media and content',
    schema: {
      properties: {
        title: { type: 'string', title: 'Title' },
        subtitle: { type: 'string', title: 'Subtitle', ui: { widget: 'textarea' } },
        image: { type: 'string', title: 'Image', ui: { widget: 'image' } },
        mediaPosition: {
          type: 'string',
          title: 'Media Position',
          enum: ['left', 'right'],
          default: 'right',
          ui: { widget: 'select' }
        },
        cta: {
          type: 'object',
          title: 'Primary CTA',
          properties: {
            text: { type: 'string', title: 'Button Text' },
            link: { type: 'string', title: 'Button Link' }
          }
        },
        secondaryCta: {
          type: 'object',
          title: 'Secondary CTA',
          properties: {
            text: { type: 'string', title: 'Button Text' },
            link: { type: 'string', title: 'Button Link' }
          }
        },
        features: {
          type: 'array',
          title: 'Features',
          ui: { widget: 'array', addLabel: 'Add Feature' },
          items: {
            type: 'object',
            properties: {
              icon: { type: 'string', title: 'Icon' },
              text: { type: 'string', title: 'Feature Text' }
            }
          }
        }
      },
      required: ['title']
    }
  };

  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() image: string = '';
  @Input() mediaPosition: 'left' | 'right' = 'right';
  @Input() cta: CtaButton | null = null;
  @Input() secondaryCta: CtaButton | null = null;
  @Input() features: FeatureItem[] = [];
}
