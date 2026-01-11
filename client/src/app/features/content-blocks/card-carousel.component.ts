import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContentBlockManifest } from './block.types';

interface Card {
  image: string;
  title: string;
  summary: string;
  link: string;
}

@Component({
  selector: 'app-card-carousel',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="py-20 bg-slate-50">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{{ title }}</h2>
          <p class="text-lg text-slate-600 max-w-2xl mx-auto">{{ subtitle }}</p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <a *ngFor="let card of cards" 
             [routerLink]="card.link"
             class="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 hover:border-transparent transition-all duration-300 hover:-translate-y-1">
            <!-- Image -->
            <div class="h-48 bg-gradient-to-br from-blue-600 to-indigo-600 overflow-hidden">
              <img *ngIf="card.image" 
                   [src]="card.image" 
                   [alt]="card.title"
                   class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div *ngIf="!card.image" class="w-full h-full flex items-center justify-center">
                <span class="text-4xl text-white/80">📦</span>
              </div>
            </div>
            
            <!-- Content -->
            <div class="p-6">
              <h3 class="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                {{ card.title }}
              </h3>
              <p class="text-slate-600 leading-relaxed mb-4">{{ card.summary }}</p>
              <span class="inline-flex items-center text-blue-600 font-medium group-hover:gap-2 transition-all">
                了解更多
                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              </span>
            </div>
          </a>
        </div>
      </div>
    </section>
  `
})
export class CardCarouselComponent {
  static manifest: ContentBlockManifest = {
    type: 'card-carousel',
    displayName: 'Card Carousel',
    category: 'Features',
    schema: {
      properties: {
        title: { type: 'string', title: 'Title' },
        subtitle: { type: 'string', title: 'Subtitle' },
        cards: {
          type: 'array',
          title: 'Cards',
          items: {
            type: 'object',
            properties: {
              image: { type: 'string', title: 'Image', ui: { widget: 'image' } },
              title: { type: 'string', title: 'Card Title' },
              summary: { type: 'string', title: 'Summary', ui: { widget: 'textarea' } },
              link: { type: 'string', title: 'Link' }
            }
          }
        }
      },
      required: ['title']
    }
  };

  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() cards: Card[] = [];
}
