import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContentBlockManifest } from './block.types';

interface Case {
  logo: string;
  name: string;
  industry: string;
  challenge: string;
  result: string;
  quote: string;
  link: string;
}

@Component({
  selector: 'app-case-study-showcase',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-6">
        <h2 class="text-3xl md:text-4xl font-bold text-slate-900 text-center mb-16">{{ title }}</h2>
        
        <div *ngFor="let c of cases" class="bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-100 p-8 md:p-12 mb-8">
          <div class="flex flex-col md:flex-row gap-8">
            <!-- Left: Info -->
            <div class="md:w-2/3">
              <div class="flex items-center gap-4 mb-6">
                <div class="w-16 h-16 bg-white rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden">
                  <img *ngIf="c.logo" [src]="c.logo" [alt]="c.name" class="w-12 h-12 object-contain" />
                  <span *ngIf="!c.logo" class="text-2xl">🏢</span>
                </div>
                <div>
                  <h3 class="text-xl font-bold text-slate-900">{{ c.name }}</h3>
                  <span class="badge badge-info">{{ c.industry }}</span>
                </div>
              </div>
              
              <div class="space-y-4 mb-6">
                <div>
                  <span class="text-sm font-semibold text-slate-500 uppercase tracking-wide">挑戰</span>
                  <p class="text-slate-700 mt-1">{{ c.challenge }}</p>
                </div>
                <div>
                  <span class="text-sm font-semibold text-slate-500 uppercase tracking-wide">成果</span>
                  <p class="text-blue-600 font-semibold mt-1">{{ c.result }}</p>
                </div>
              </div>
              
              <a [routerLink]="c.link" class="inline-flex items-center text-blue-600 font-medium hover:gap-2 transition-all">
                查看完整案例
                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              </a>
            </div>
            
            <!-- Right: Quote -->
            <div class="md:w-1/3 bg-blue-50 rounded-xl p-6 flex items-center">
              <blockquote class="text-slate-700 italic leading-relaxed">
                {{ c.quote }}
              </blockquote>
            </div>
          </div>
        </div>
        
        <div class="text-center mt-12" *ngIf="viewMoreLink">
          <a [routerLink]="viewMoreLink" class="btn btn-secondary">
            {{ viewMoreText }}
            <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  `
})
export class CaseStudyShowcaseComponent {
  static manifest: ContentBlockManifest = {
    type: 'case-study-showcase',
    displayName: 'Case Study Showcase',
    category: 'Social Proof',
    schema: {
      properties: {
        title: { type: 'string', title: 'Title' },
        viewMoreText: { type: 'string', title: 'Button Text' },
        viewMoreLink: { type: 'string', title: 'Button Link' },
        cases: {
          type: 'array',
          title: 'Case Studies',
          items: {
            type: 'object',
            properties: {
              logo: { type: 'string', title: 'Logo URL', ui: { widget: 'image' } },
              name: { type: 'string', title: 'Client Name' },
              industry: { type: 'string', title: 'Industry' },
              challenge: { type: 'string', title: 'Challenge', ui: { widget: 'textarea' } },
              result: { type: 'string', title: 'Result' },
              quote: { type: 'string', title: 'Quote', ui: { widget: 'textarea' } },
              link: { type: 'string', title: 'Link' }
            }
          }
        }
      },
      required: ['title']
    }
  };

  @Input() title: string = '';
  @Input() cases: Case[] = [];
  @Input() viewMoreText: string = '';
  @Input() viewMoreLink: string = '';
}
