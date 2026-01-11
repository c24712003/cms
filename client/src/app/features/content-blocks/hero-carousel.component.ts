import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContentBlockManifest } from './block.types';

interface Slide {
  title: string;
  subtitle: string;
  cta?: { text: string; link: string };
  image: string;
}

@Component({
  selector: 'app-hero-carousel',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="relative h-[600px] overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <!-- Background Image with Overlay -->
      <div class="absolute inset-0">
        <div class="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-transparent z-10"></div>
        <img *ngIf="slides[currentSlide]?.image" 
             [src]="slides[currentSlide].image" 
             alt="Hero background"
             class="w-full h-full object-cover opacity-40" />
      </div>

      <!-- Content -->
      <div class="relative z-20 h-full max-w-7xl mx-auto px-6 flex items-center">
        <div class="max-w-2xl">
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight animate-fade-in">
            {{ slides[currentSlide]?.title }}
          </h1>
          <p class="text-xl md:text-2xl text-slate-300 mb-8 leading-relaxed">
            {{ slides[currentSlide]?.subtitle }}
          </p>
          <div class="flex gap-4" *ngIf="slides[currentSlide]?.cta">
            <a [routerLink]="slides[currentSlide].cta!.link" 
               class="btn-hero-primary">
              {{ slides[currentSlide].cta!.text }}
              <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      <!-- Slide Indicators -->
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3" *ngIf="slides.length > 1">
        <button *ngFor="let slide of slides; let i = index"
                (click)="currentSlide = i"
                [class.bg-white]="currentSlide === i"
                [class.bg-white/40]="currentSlide !== i"
                class="w-3 h-3 rounded-full transition-all duration-300 hover:bg-white/80">
        </button>
      </div>

      <!-- Nav Arrows -->
      <button *ngIf="slides.length > 1" 
              (click)="prevSlide()" 
              class="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-all">
        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
      </button>
      <button *ngIf="slides.length > 1" 
              (click)="nextSlide()" 
              class="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-all">
        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
      </button>
    </section>
  `,
  styles: [`
    .btn-hero-primary {
      @apply inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-600/40 hover:-translate-y-0.5;
    }
    .animate-fade-in {
      animation: fadeIn 0.6s ease-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class HeroCarouselComponent {
  static manifest: ContentBlockManifest = {
    type: 'hero-carousel',
    displayName: 'Hero Carousel',
    category: 'Hero & Headers',
    schema: {
      properties: {
        slides: {
          type: 'array',
          title: 'Slides',
          items: {
            type: 'object',
            properties: {
              title: { type: 'string', title: 'Headline' },
              subtitle: { type: 'string', title: 'Subtitle', ui: { widget: 'textarea' } },
              image: { type: 'string', title: 'Background Image', ui: { widget: 'image' } },
              cta: {
                type: 'object',
                title: 'Primary Button',
                properties: {
                  text: { type: 'string', title: 'Button Label' },
                  link: { type: 'string', title: 'Button Link' }
                }
              }
            }
          }
        }
      }
    }
  };

  @Input() slides: Slide[] = [];
  currentSlide = 0;

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }
}
