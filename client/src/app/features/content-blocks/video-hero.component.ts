import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContentBlockManifest } from './block.types';

interface CtaButton {
  text: string;
  link: string;
}

@Component({
  selector: 'app-video-hero',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="relative h-[600px] md:h-[700px] overflow-hidden bg-slate-900">
      <!-- Video Background -->
      <div class="absolute inset-0">
        <video
          *ngIf="videoUrl()"
          [src]="videoUrl()"
          [poster]="posterImage()"
          [autoplay]="autoplay()"
          [loop]="loop()"
          [muted]="muted()"
          playsinline
          class="w-full h-full object-cover">
        </video>
        <img 
          *ngIf="!videoUrl() && posterImage()" 
          [src]="posterImage()" 
          alt="Hero background"
          class="w-full h-full object-cover" />
      </div>
      
      <!-- Overlay -->
      <div 
        class="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/50"
        [style.opacity]="overlayOpacity() / 100">
      </div>
      
      <!-- Content -->
      <div class="relative z-10 h-full flex items-center">
        <div class="max-w-7xl mx-auto px-6 w-full">
          <div class="max-w-2xl">
            <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight animate-fade-in">
              {{ title() }}
            </h1>
            <p *ngIf="subtitle()" class="text-xl md:text-2xl text-slate-200 mb-8 leading-relaxed">
              {{ subtitle() }}
            </p>
            <div *ngIf="cta()?.text" class="flex gap-4">
              <a [routerLink]="cta()?.link" class="btn-hero-primary">
                {{ cta()?.text }}
                <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Video Controls (Play/Pause) -->
      <button 
        *ngIf="videoUrl() && !autoplay()"
        (click)="togglePlay()"
        class="absolute bottom-8 right-8 z-20 p-4 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-all">
        <svg *ngIf="!isPlaying" class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z"/>
        </svg>
        <svg *ngIf="isPlaying" class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
        </svg>
      </button>
      
      <!-- Scroll Indicator -->
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <svg class="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
        </svg>
      </div>
    </section>
  `,
  styles: [`
    .btn-hero-primary {
      @apply inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-600/40 hover:-translate-y-0.5;
    }
    .animate-fade-in {
      animation: fadeIn 0.8s ease-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class VideoHeroComponent {
  static manifest: ContentBlockManifest = {
    type: 'video-hero',
    displayName: 'Video Hero',
    category: 'Hero & Headers',
    description: 'Full-screen video background hero with text overlay',
    schema: {
      properties: {
        videoUrl: { type: 'string', title: 'Video URL (MP4/WebM)' },
        posterImage: { type: 'string', title: 'Poster Image', ui: { widget: 'image' } },
        title: { type: 'string', title: 'Title' },
        subtitle: { type: 'string', title: 'Subtitle', ui: { widget: 'textarea' } },
        cta: {
          type: 'object',
          title: 'Call to Action',
          properties: {
            text: { type: 'string', title: 'Button Text' },
            link: { type: 'string', title: 'Button Link' }
          }
        },
        overlayOpacity: {
          type: 'number',
          title: 'Overlay Opacity',
          default: 60,
          ui: { widget: 'range' }
        },
        autoplay: { type: 'boolean', title: 'Autoplay', default: true, ui: { widget: 'toggle' } },
        loop: { type: 'boolean', title: 'Loop', default: true, ui: { widget: 'toggle' } },
        muted: { type: 'boolean', title: 'Muted', default: true, ui: { widget: 'toggle' } }
      },
      required: ['title']
    }
  };

  readonly videoUrl = input<string>('');
  readonly posterImage = input<string>('');
  readonly title = input<string>('');
  readonly subtitle = input<string>('');
  readonly cta = input<CtaButton | null>(null);
  readonly overlayOpacity = input<number>(60);
  readonly autoplay = input<boolean>(true);
  readonly loop = input<boolean>(true);
  readonly muted = input<boolean>(true);

  isPlaying = false;

  togglePlay() {
    const video = document.querySelector('app-video-hero video') as HTMLVideoElement;
    if (video) {
      if (this.isPlaying) {
        video.pause();
      } else {
        video.play();
      }
      this.isPlaying = !this.isPlaying;
    }
  }
}
