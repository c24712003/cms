import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface CTA {
    text: string;
    link: string;
}

@Component({
    selector: 'app-cta-banner',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <section class="py-20 bg-slate-900">
      <div class="max-w-4xl mx-auto px-6 text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-6">
          {{ title }}
        </h2>
        <p class="text-xl text-slate-300 mb-10 leading-relaxed">
          {{ description }}
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a *ngIf="primaryCta" 
             [routerLink]="primaryCta.link"
             class="inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
            {{ primaryCta.text }}
            <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </a>
          <a *ngIf="secondaryCta" 
             [href]="secondaryCta.link"
             class="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white font-semibold rounded-xl transition-all duration-300">
            {{ secondaryCta.text }}
            <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  `
})
export class CtaBannerComponent {
    @Input() title: string = '';
    @Input() description: string = '';
    @Input() primaryCta?: CTA;
    @Input() secondaryCta?: CTA;
}
