import { Component, input, ElementRef, ViewChild, AfterViewInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ContentBlockManifest } from './block.types';

@Component({
  selector: 'app-image-comparison',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="py-16 md:py-20 bg-slate-50">
      <div class="max-w-5xl mx-auto px-6">
        <!-- Header -->
        <div *ngIf="title()" class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            {{ title() }}
          </h2>
        </div>
        
        <!-- Comparison Container -->
        <div 
          #container
          class="comparison-container relative overflow-hidden rounded-2xl shadow-2xl shadow-slate-200/50 cursor-ew-resize touch-none"
          [class.horizontal]="orientation() === 'horizontal'"
          [class.vertical]="orientation() === 'vertical'"
          (pointerdown)="onPointerDown($event)"
          (pointermove)="onPointerMove($event)"
          (pointerup)="onPointerUp($event)"
          (pointercancel)="onPointerUp($event)"
          (pointerleave)="onPointerUp($event)">
          
          <!-- Before Image (Full) -->
          <div class="before-image absolute inset-0 select-none">
            <img 
              *ngIf="beforeImage()"
              [src]="beforeImage()" 
              alt="Before"
              draggable="false"
              class="w-full h-full object-cover select-none pointer-events-none" />
            <div 
              *ngIf="beforeLabel()" 
              class="absolute top-4 left-4 px-3 py-1.5 bg-slate-900/70 backdrop-blur-sm text-white text-sm font-medium rounded-lg z-20">
              {{ beforeLabel() }}
            </div>
          </div>
          
          <!-- After Image (Clipped) -->
          <div 
            class="after-image absolute inset-0 overflow-hidden select-none"
            [style.clip-path]="clipPath">
            <img 
              *ngIf="afterImage()"
              [src]="afterImage()" 
              alt="After"
              draggable="false"
              class="w-full h-full object-cover select-none pointer-events-none" />
            <div 
              *ngIf="afterLabel()" 
              class="absolute top-4 right-4 px-3 py-1.5 bg-blue-600/90 backdrop-blur-sm text-white text-sm font-medium rounded-lg z-20">
              {{ afterLabel() }}
            </div>
          </div>
          
          <!-- Slider Handle -->
          <div 
            class="slider-handle absolute z-30 pointer-events-none"
            [class.horizontal]="orientation() === 'horizontal'"
            [class.vertical]="orientation() === 'vertical'"
            [style.left.%]="orientation() === 'horizontal' ? position : null"
            [style.top.%]="orientation() === 'vertical' ? position : null">
            
            <!-- Line -->
            <div 
              class="handle-line bg-white shadow-lg"
              [class.w-1]="orientation() === 'horizontal'"
              [class.h-full]="orientation() === 'horizontal'"
              [class.h-1]="orientation() === 'vertical'"
              [class.w-full]="orientation() === 'vertical'">
            </div>
            
            <!-- Circle Handle -->
            <div class="handle-circle absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center border-2 border-slate-100">
              <svg *ngIf="orientation() === 'horizontal'" class="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"/>
              </svg>
              <svg *ngIf="orientation() === 'vertical'" class="w-6 h-6 text-slate-600 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"/>
              </svg>
            </div>
          </div>
          
          <!-- Placeholder when no images -->
          <div 
            *ngIf="!beforeImage && !afterImage" 
            class="aspect-video bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
            <div class="text-center text-slate-500">
              <svg class="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              <p>Add before/after images</p>
            </div>
          </div>
        </div>
        
        <!-- Instructions -->
        <p class="text-center text-sm text-slate-500 mt-4">
          Drag the slider to compare
        </p>
      </div>
    </section>
  `,
  styles: [`
    .comparison-container {
      aspect-ratio: 16 / 10;
      user-select: none;
      -webkit-user-select: none;
    }
    .slider-handle.horizontal {
      top: 0;
      bottom: 0;
      transform: translateX(-50%);
    }
    .slider-handle.horizontal .handle-line {
      height: 100%;
    }
    .slider-handle.vertical {
      left: 0;
      right: 0;
      transform: translateY(-50%);
    }
    .slider-handle.vertical .handle-line {
      width: 100%;
    }
  `]
})
export class ImageComparisonComponent implements AfterViewInit {
  @ViewChild('container') container!: ElementRef;

  static manifest: ContentBlockManifest = {
    type: 'image-comparison',
    displayName: 'Image Comparison',
    category: 'Media',
    description: 'Interactive before/after image comparison slider',
    schema: {
      properties: {
        title: { type: 'string', title: 'Title' },
        beforeImage: { type: 'string', title: 'Before Image', ui: { widget: 'image' } },
        afterImage: { type: 'string', title: 'After Image', ui: { widget: 'image' } },
        beforeLabel: { type: 'string', title: 'Before Label', default: 'Before' },
        afterLabel: { type: 'string', title: 'After Label', default: 'After' },
        startPosition: {
          type: 'number',
          title: 'Start Position (%)',
          default: 50,
          ui: { widget: 'range' }
        },
        orientation: {
          type: 'string',
          title: 'Orientation',
          enum: ['horizontal', 'vertical'],
          default: 'horizontal',
          ui: { widget: 'select' }
        }
      }
    }
  };

    readonly title = input<string>('');
    readonly beforeImage = input<string>('');
    readonly afterImage = input<string>('');
    readonly beforeLabel = input<string>('Before');
    readonly afterLabel = input<string>('After');
    readonly startPosition = input<number>(50);
    readonly orientation = input<'horizontal' | 'vertical'>('horizontal');

  position: number = 50;
  isDragging = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  get clipPath(): string {
    if (this.orientation() === 'horizontal') {
      return `inset(0 0 0 ${this.position}%)`;
    } else {
      return `inset(${this.position}% 0 0 0)`;
    }
  }

  ngAfterViewInit() {
    this.position = this.startPosition();
  }

  onPointerDown(event: PointerEvent) {
    if (!isPlatformBrowser(this.platformId)) return;

    event.preventDefault(); // Prevent scroll/default
    event.stopPropagation(); // Prevent parent drag

    this.isDragging = true;

    // Set Pointer Capture to ensure we receive moves even if cursor leaves element
    const target = event.target as HTMLElement;
    if (target.setPointerCapture) {
      target.setPointerCapture(event.pointerId);
    }

    this.updatePosition(event);
  }

  onPointerMove(event: PointerEvent) {
    if (!this.isDragging) return;

    event.preventDefault();
    event.stopPropagation();
    this.updatePosition(event);
  }

  onPointerUp(event: PointerEvent) {
    if (!this.isDragging) return;

    this.isDragging = false;

    const target = event.target as HTMLElement;
    if (target.releasePointerCapture) {
      target.releasePointerCapture(event.pointerId);
    }
  }

  updatePosition(event: PointerEvent) {
    if (!this.container) return;

    const rect = this.container.nativeElement.getBoundingClientRect();
    const clientX = event.clientX;
    const clientY = event.clientY;

    if (this.orientation() === 'horizontal') {
      const x = clientX - rect.left;
      this.position = Math.max(0, Math.min(100, (x / rect.width) * 100));
    } else {
      const y = clientY - rect.top;
      this.position = Math.max(0, Math.min(100, (y / rect.height) * 100));
    }
  }
}
