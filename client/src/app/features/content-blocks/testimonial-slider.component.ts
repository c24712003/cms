import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentBlockManifest } from './block.types';

interface Testimonial {
    quote: string;
    author: string;
    role?: string;
    company?: string;
    avatar?: string;
    rating?: number;
}

@Component({
    selector: 'app-testimonial-slider',
    standalone: true,
    imports: [CommonModule],
    template: `
    <section class="py-16 md:py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 overflow-hidden">
      <div class="max-w-7xl mx-auto px-6">
        <!-- Header -->
        <div *ngIf="title" class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
            {{ title }}
          </h2>
        </div>
        
        <!-- Testimonials Slider -->
        <div class="relative">
          <!-- Main Testimonial Display -->
          <div class="max-w-4xl mx-auto text-center">
            <!-- Quote Icon -->
            <svg class="w-12 h-12 text-blue-400/40 mx-auto mb-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
            </svg>
            
            <!-- Rating Stars -->
            <div *ngIf="testimonials[currentIndex]?.rating" class="flex justify-center gap-1 mb-6">
              <svg 
                *ngFor="let star of [1,2,3,4,5]"
                class="w-6 h-6"
                [class.text-amber-400]="star <= (testimonials[currentIndex]?.rating || 0)"
                [class.text-slate-600]="star > (testimonials[currentIndex]?.rating || 0)"
                fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            
            <!-- Quote Text -->
            <blockquote class="text-xl md:text-2xl text-white leading-relaxed mb-8 animate-fade-in">
              "{{ testimonials[currentIndex]?.quote }}"
            </blockquote>
            
            <!-- Author Info -->
            <div class="flex items-center justify-center gap-4">
              <img 
                *ngIf="testimonials[currentIndex]?.avatar"
                [src]="testimonials[currentIndex]?.avatar" 
                [alt]="testimonials[currentIndex]?.author"
                class="w-14 h-14 rounded-full object-cover border-2 border-blue-400/50" />
              <div 
                *ngIf="!testimonials[currentIndex]?.avatar"
                class="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold">
                {{ testimonials[currentIndex]?.author?.charAt(0) }}
              </div>
              <div class="text-left">
                <div class="font-semibold text-white">
                  {{ testimonials[currentIndex]?.author }}
                </div>
                <div class="text-sm text-blue-200">
                  <span *ngIf="testimonials[currentIndex]?.role">{{ testimonials[currentIndex]?.role }}</span>
                  <span *ngIf="testimonials[currentIndex]?.role && testimonials[currentIndex]?.company">, </span>
                  <span *ngIf="testimonials[currentIndex]?.company">{{ testimonials[currentIndex]?.company }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Navigation Dots -->
          <div *ngIf="testimonials.length > 1" class="flex justify-center gap-2 mt-12">
            <button 
              *ngFor="let t of testimonials; let i = index"
              (click)="goToSlide(i)"
              class="w-3 h-3 rounded-full transition-all duration-300"
              [class.bg-blue-400]="i === currentIndex"
              [class.bg-white/30]="i !== currentIndex"
              [class.w-8]="i === currentIndex">
            </button>
          </div>
          
          <!-- Navigation Arrows -->
          <button 
            *ngIf="testimonials.length > 1"
            (click)="prevSlide()"
            class="absolute left-0 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all hidden md:block">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <button 
            *ngIf="testimonials.length > 1"
            (click)="nextSlide()"
            class="absolute right-0 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all hidden md:block">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </section>
  `,
    styles: [`
    .animate-fade-in {
      animation: fadeIn 0.5s ease-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class TestimonialSliderComponent implements OnInit, OnDestroy {
    static manifest: ContentBlockManifest = {
        type: 'testimonial-slider',
        displayName: 'Testimonial Slider',
        category: 'Content',
        description: 'Customer testimonial carousel',
        schema: {
            properties: {
                title: { type: 'string', title: 'Title' },
                testimonials: {
                    type: 'array',
                    title: 'Testimonials',
                    ui: { widget: 'array', addLabel: 'Add Testimonial' },
                    items: {
                        type: 'object',
                        properties: {
                            quote: { type: 'string', title: 'Quote', ui: { widget: 'textarea' } },
                            author: { type: 'string', title: 'Author Name' },
                            role: { type: 'string', title: 'Role/Title' },
                            company: { type: 'string', title: 'Company' },
                            avatar: { type: 'string', title: 'Avatar', ui: { widget: 'image' } },
                            rating: {
                                type: 'number',
                                title: 'Rating (1-5)',
                                enum: [1, 2, 3, 4, 5],
                                default: 5,
                                ui: { widget: 'select' }
                            }
                        }
                    }
                },
                autoRotate: { type: 'boolean', title: 'Auto Rotate', default: true, ui: { widget: 'toggle' } },
                rotateInterval: {
                    type: 'number',
                    title: 'Rotation Interval (seconds)',
                    default: 5,
                    ui: { widget: 'range' }
                }
            }
        }
    };

    @Input() title: string = '';
    @Input() testimonials: Testimonial[] = [];
    @Input() autoRotate: boolean = true;
    @Input() rotateInterval: number = 5;

    currentIndex = 0;
    private intervalId: any;

    ngOnInit() {
        if (this.autoRotate && this.testimonials.length > 1) {
            this.startAutoRotate();
        }
    }

    ngOnDestroy() {
        this.stopAutoRotate();
    }

    startAutoRotate() {
        this.intervalId = setInterval(() => {
            this.nextSlide();
        }, this.rotateInterval * 1000);
    }

    stopAutoRotate() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }

    goToSlide(index: number) {
        this.currentIndex = index;
        if (this.autoRotate) {
            this.stopAutoRotate();
            this.startAutoRotate();
        }
    }

    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
    }

    prevSlide() {
        this.currentIndex = (this.currentIndex - 1 + this.testimonials.length) % this.testimonials.length;
        if (this.autoRotate) {
            this.stopAutoRotate();
            this.startAutoRotate();
        }
    }
}
