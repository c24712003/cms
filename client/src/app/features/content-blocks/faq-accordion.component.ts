import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentBlockManifest } from './block.types';

interface FaqItem {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-faq-accordion',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="py-20 bg-slate-50">
      <div class="max-w-3xl mx-auto px-6">
        <h2 class="text-3xl md:text-4xl font-bold text-slate-900 text-center mb-12">{{ title }}</h2>
        
        <div class="space-y-4">
          <div *ngFor="let item of items; let i = index" 
               class="bg-white rounded-xl border border-slate-200 overflow-hidden transition-all duration-200"
               [class.shadow-md]="openIndex === i">
            <!-- Question -->
            <button (click)="toggle(i)" 
                    class="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors">
              <span class="font-semibold text-slate-900 pr-4">{{ item.question }}</span>
              <svg class="w-5 h-5 text-slate-500 transition-transform duration-200 flex-shrink-0"
                   [class.rotate-180]="openIndex === i"
                   fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
            
            <!-- Answer -->
            <div class="overflow-hidden transition-all duration-300"
                 [style.maxHeight]="openIndex === i ? '500px' : '0px'">
              <div class="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                {{ item.answer }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class FaqAccordionComponent {
  static manifest: ContentBlockManifest = {
    type: 'faq-accordion',
    displayName: 'FAQ',
    category: 'Text & Content',
    schema: {
      properties: {
        title: { type: 'string', title: 'Title' },
        items: {
          type: 'array',
          title: 'Questions',
          items: {
            type: 'object',
            properties: {
              question: { type: 'string', title: 'Question' },
              answer: { type: 'string', title: 'Answer', ui: { widget: 'textarea' } }
            }
          }
        }
      },
      required: ['title']
    }
  };

  @Input() title: string = '';
  @Input() items: FaqItem[] = [];

  openIndex: number | null = null;

  toggle(index: number) {
    this.openIndex = this.openIndex === index ? null : index;
  }
}
