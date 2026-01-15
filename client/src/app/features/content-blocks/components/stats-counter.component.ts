import { Component, Input, input, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentBlockManifest } from '../block.types';

@Component({
  selector: 'app-stats-counter',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="py-16 px-4 md:px-8 relative overflow-hidden" [id]="blockId"
             [style.background-color]="styles?.background?.color || '#f8fafc'">
      
      <div class="max-w-6xl mx-auto relative z-10">
        <h2 *ngIf="header.title" 
            class="text-3xl md:text-4xl font-bold text-center mb-12"
            [style.color]="styles?.typography?.color"
            data-aos="fade-up">
          {{ header.title }}
        </h2>

        <!-- Auto-fit Grid: Adapts to any screen size without fixed breakpoints -->
        <div class="grid gap-6 md:gap-8 w-full" 
             style="grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));">
          
          <div *ngFor="let stat of stats; let i = index" 
               class="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-100 dark:border-slate-700 hover:border-blue-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group"
               data-aos="fade-up" [attr.data-aos-delay]="i * 100">
            
            <div class="text-3xl md:text-5xl font-extrabold mb-3 bg-clip-text text-transparent bg-gradient-to-br from-blue-600 to-indigo-600 group-hover:scale-110 transition-transform duration-300"
                 [style.color]="styles?.typography?.highlightColor">
              {{ stat.value }}
            </div>
            
            <div class="text-sm md:text-base font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider break-words text-center leading-relaxed"
                 [style.color]="styles?.typography?.color">
              {{ stat.label }}
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
export class StatsCounterComponent implements OnInit {
  @Input() blockId: string = '';
  @Input() styles: any = {}; // Styles are now passed explicitly
  // Data Inputs
  @Input() header: { title: string } = { title: 'Our Impact' };
  @Input() stats: { value: string; label: string }[] = [];

  static manifest: ContentBlockManifest = {
    type: 'stats-counter',
    displayName: 'Stats Counter',
    category: 'Content',
    previewImage: 'assets/blocks/stats-preview.png',
    schema: {
      properties: {
        header: {
          type: 'object',
          title: 'Header',
          properties: {
            title: { type: 'string', title: 'Title', default: 'Our Impact by the Numbers' }
          }
        },
        stats: {
          type: 'array',
          title: 'Statistics',
          ui: {
            widget: 'array',
            addLabel: 'Add Stat'
          },
          items: {
            type: 'object',
            properties: {
              value: { type: 'string', title: 'Value', default: '100+' },
              label: { type: 'string', title: 'Label', default: 'Happy Clients' }
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
            color: { type: 'string', title: 'Background Color', ui: { widget: 'color' } }
          }
        },
        typography: {
          type: 'object',
          title: 'Typography',
          properties: {
            color: { type: 'string', title: 'Text Color', ui: { widget: 'color' } },
            highlightColor: { type: 'string', title: 'Highlight Color', ui: { widget: 'color' } }
          }
        }
      }
    }
  };

  ngOnInit() {
    if (!this.stats || this.stats.length === 0) {
      this.stats = [
        { value: '100+', label: 'Projects' },
        { value: '24/7', label: 'Support' }
      ];
    }
  }
}
