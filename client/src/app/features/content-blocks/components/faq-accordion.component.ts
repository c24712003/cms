import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentBlockManifest } from '../block.types';

@Component({
    selector: 'app-faq-accordion',
    standalone: true,
    imports: [CommonModule],
    template: `
    <section class="py-12 px-4 md:px-8 max-w-4xl mx-auto" [id]="blockId">
      <h2 *ngIf="title" class="text-3xl font-bold text-center mb-10 text-slate-800 dark:text-white" data-aos="fade-up">
        {{ title }}
      </h2>

      <div class="space-y-4">
        <div *ngFor="let item of items; let i = index" 
             class="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-800 transition-all duration-200"
             [class.shadow-md]="isOpen(i)"
             data-aos="fade-up" [attr.data-aos-delay]="i * 100">
          
          <button (click)="toggle(i)" 
                  class="w-full text-left px-6 py-4 flex justify-between items-center focus:outline-none hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
            <span class="font-semibold text-lg text-slate-700 dark:text-slate-200">{{ item.question }}</span>
            <span class="transform transition-transform duration-300 text-slate-400" [class.rotate-180]="isOpen(i)">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </button>

          <div class="overflow-hidden transition-all duration-300 ease-in-out"
               [style.max-height]="isOpen(i) ? '500px' : '0'"
               [style.opacity]="isOpen(i) ? '1' : '0'">
            <div class="px-6 pb-6 text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-700/50 pt-4">
              {{ item.answer }}
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
    styles: [`
    :host { display: block; }
  `]
})
export class FaqAccordionComponent implements OnInit {
    @Input() blockId: string = '';
    @Input() styles: any = {};

    // Schema inputs
    @Input() title: string = 'Frequently Asked Questions';
    @Input() items: { question: string; answer: string }[] = [];

    openIndex: number | null = 0; // Open first by default

    // ... manifest omitted as it remains same ... 
    static manifest: ContentBlockManifest = {
        type: 'faq-accordion',
        displayName: 'FAQ',
        category: 'Content',
        previewImage: 'assets/blocks/faq-preview.png',
        schema: {
            properties: {
                title: {
                    type: 'string',
                    title: 'Title',
                    default: 'Frequently Asked Questions'
                },
                items: {
                    type: 'array',
                    title: 'Questions',
                    ui: {
                        widget: 'array',
                        addLabel: 'Add Question'
                    },
                    items: {
                        type: 'object',
                        properties: {
                            question: { type: 'string', title: 'Question', default: 'What is your refund policy?' },
                            answer: { type: 'string', title: 'Answer', ui: { widget: 'textarea' }, default: 'We offer a 30-day money-back guarantee for all our products.' }
                        }
                    }
                }
            }
        },
        styleSchema: {
            properties: {
                background: {
                    type: 'object',
                    title: 'Background',
                    properties: {
                        color: { type: 'string', title: 'Color', ui: { widget: 'color' } }
                    }
                },
                typography: {
                    type: 'object',
                    title: 'Typography',
                    properties: {
                        fontFamily: { type: 'string', title: 'Font Family' }
                    }
                },
                spacing: {
                    type: 'object',
                    title: 'Spacing',
                    properties: {
                        padding: { type: 'string', title: 'Padding', default: '3rem 1rem' }
                    }
                }
            }
        }
    };

    ngOnInit() {
        // Ensure default structure
        if (!this.items || this.items.length === 0) {
            this.items = [
                { question: 'Is this component responsive?', answer: 'Yes, it works perfectly on desktop, tablet, and mobile devices.' },
                { question: 'Can I customize the colors?', answer: 'Absolutely! You can change the background and text colors in the Styles tab.' }
            ];
        }
    }

    toggle(index: number) {
        if (this.openIndex === index) {
            this.openIndex = null;
        } else {
            this.openIndex = index;
        }
    }

    isOpen(index: number): boolean {
        return this.openIndex === index;
    }
}
