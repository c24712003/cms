import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentBlockManifest } from './block.types';

interface GalleryImage {
    src: string;
    alt: string;
    caption?: string;
}

@Component({
    selector: 'app-masonry-gallery',
    standalone: true,
    imports: [CommonModule],
    template: `
    <section class="py-16 md:py-20 bg-white">
      <div class="max-w-7xl mx-auto px-6">
        <!-- Header -->
        <div *ngIf="title || subtitle" class="text-center mb-12">
          <h2 *ngIf="title" class="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            {{ title }}
          </h2>
          <p *ngIf="subtitle" class="text-lg text-slate-600 max-w-2xl mx-auto">
            {{ subtitle }}
          </p>
        </div>
        
        <!-- Masonry Grid -->
        <div 
          class="masonry-grid"
          [class.columns-2]="columns === 2"
          [class.columns-3]="columns === 3"
          [class.columns-4]="columns === 4"
          [class.gap-2]="gap === 'sm'"
          [class.gap-4]="gap === 'md'"
          [class.gap-6]="gap === 'lg'">
          <div 
            *ngFor="let image of images; let i = index" 
            class="masonry-item group cursor-pointer"
            (click)="enableLightbox && openLightbox(i)">
            <div class="relative overflow-hidden rounded-xl">
              <img 
                [src]="image.src" 
                [alt]="image.alt || 'Gallery image'"
                class="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105" />
              
              <!-- Overlay on Hover -->
              <div class="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div class="absolute bottom-0 left-0 right-0 p-4">
                  <p *ngIf="image.caption" class="text-white text-sm font-medium">
                    {{ image.caption }}
                  </p>
                </div>
                <div *ngIf="enableLightbox" class="absolute top-4 right-4">
                  <span class="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/>
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Lightbox -->
      <div 
        *ngIf="lightboxOpen" 
        class="fixed inset-0 z-50 bg-slate-900/95 flex items-center justify-center p-4"
        (click)="closeLightbox()">
        <button 
          class="absolute top-4 right-4 p-2 text-white/80 hover:text-white transition-colors"
          (click)="closeLightbox()">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
        
        <button 
          *ngIf="images.length > 1"
          class="absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          (click)="prevImage($event)">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        
        <img 
          [src]="images[currentIndex]?.src" 
          [alt]="images[currentIndex]?.alt"
          class="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
          (click)="$event.stopPropagation()" />
        
        <button 
          *ngIf="images.length > 1"
          class="absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          (click)="nextImage($event)">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
        
        <!-- Caption -->
        <div 
          *ngIf="images[currentIndex]?.caption" 
          class="absolute bottom-8 left-1/2 -translate-x-1/2 text-white text-center">
          <p class="text-lg font-medium">{{ images[currentIndex].caption }}</p>
          <p class="text-sm text-white/60 mt-1">{{ currentIndex + 1 }} / {{ images.length }}</p>
        </div>
      </div>
    </section>
  `,
    styles: [`
    .masonry-grid {
      column-gap: 1rem;
    }
    .masonry-grid.columns-2 { column-count: 2; }
    .masonry-grid.columns-3 { column-count: 3; }
    .masonry-grid.columns-4 { column-count: 4; }
    
    @media (max-width: 768px) {
      .masonry-grid.columns-3,
      .masonry-grid.columns-4 { column-count: 2; }
    }
    @media (max-width: 480px) {
      .masonry-grid { column-count: 1 !important; }
    }
    
    .masonry-item {
      break-inside: avoid;
      margin-bottom: 1rem;
    }
    .masonry-grid.gap-2 { column-gap: 0.5rem; }
    .masonry-grid.gap-2 .masonry-item { margin-bottom: 0.5rem; }
    .masonry-grid.gap-4 { column-gap: 1rem; }
    .masonry-grid.gap-4 .masonry-item { margin-bottom: 1rem; }
    .masonry-grid.gap-6 { column-gap: 1.5rem; }
    .masonry-grid.gap-6 .masonry-item { margin-bottom: 1.5rem; }
  `]
})
export class MasonryGalleryComponent {
    static manifest: ContentBlockManifest = {
        type: 'masonry-gallery',
        displayName: 'Masonry Gallery',
        category: 'Media',
        description: 'Pinterest-style responsive image gallery',
        schema: {
            properties: {
                title: { type: 'string', title: 'Title' },
                subtitle: { type: 'string', title: 'Subtitle', ui: { widget: 'textarea' } },
                images: {
                    type: 'array',
                    title: 'Images',
                    ui: { widget: 'array', addLabel: 'Add Image' },
                    items: {
                        type: 'object',
                        properties: {
                            src: { type: 'string', title: 'Image', ui: { widget: 'image' } },
                            alt: { type: 'string', title: 'Alt Text' },
                            caption: { type: 'string', title: 'Caption' }
                        }
                    }
                },
                columns: {
                    type: 'number',
                    title: 'Columns',
                    enum: [2, 3, 4],
                    default: 3,
                    ui: { widget: 'select' }
                },
                gap: {
                    type: 'string',
                    title: 'Gap Size',
                    enum: ['sm', 'md', 'lg'],
                    default: 'md',
                    ui: { widget: 'select' }
                },
                enableLightbox: {
                    type: 'boolean',
                    title: 'Enable Lightbox',
                    default: true,
                    ui: { widget: 'toggle' }
                }
            }
        }
    };

    @Input() title: string = '';
    @Input() subtitle: string = '';
    @Input() images: GalleryImage[] = [];
    @Input() columns: number = 3;
    @Input() gap: 'sm' | 'md' | 'lg' = 'md';
    @Input() enableLightbox: boolean = true;

    lightboxOpen = false;
    currentIndex = 0;

    openLightbox(index: number) {
        this.currentIndex = index;
        this.lightboxOpen = true;
        document.body.style.overflow = 'hidden';
    }

    closeLightbox() {
        this.lightboxOpen = false;
        document.body.style.overflow = '';
    }

    nextImage(event: Event) {
        event.stopPropagation();
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
    }

    prevImage(event: Event) {
        event.stopPropagation();
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    }
}
