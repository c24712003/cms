import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentBlockManifest } from './block.types';

interface TimelineStep {
  number: string;
  title: string;
  description: string;
  duration?: string;
}

@Component({
  selector: 'app-timeline-steps',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="py-20 bg-white">
      <div class="max-w-5xl mx-auto px-6">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{{ title() }}</h2>
          <p *ngIf="subtitle()" class="text-lg text-slate-600">{{ subtitle() }}</p>
        </div>
        
        <div class="relative">
          <!-- Line -->
          <div class="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-600 via-blue-400 to-blue-200 hidden md:block"></div>
          
          <!-- Steps -->
          <div class="space-y-8">
            <div *ngFor="let step of steps()" class="relative flex gap-6">
              <!-- Number -->
              <div class="flex-shrink-0 w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-xl font-bold shadow-lg shadow-blue-600/30 z-10">
                {{ step.number }}
              </div>
              
              <!-- Content -->
              <div class="flex-1 bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <h3 class="text-xl font-bold text-slate-900 mb-2">{{ step.title }}</h3>
                    <p class="text-slate-600 leading-relaxed">{{ step.description }}</p>
                  </div>
                  <span *ngIf="step.duration" class="badge badge-info flex-shrink-0">
                    {{ step.duration }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class TimelineStepsComponent {
  static manifest: ContentBlockManifest = {
    type: 'timeline-steps',
    displayName: 'Timeline Steps',
    category: 'Features',
    schema: {
      properties: {
        title: { type: 'string', title: 'Title' },
        subtitle: { type: 'string', title: 'Subtitle' },
        steps: {
          type: 'array',
          title: 'Steps',
          items: {
            type: 'object',
            properties: {
              number: { type: 'string', title: 'Step Number (e.g. 01)' },
              title: { type: 'string', title: 'Title' },
              description: { type: 'string', title: 'Description', ui: { widget: 'textarea' } },
              duration: { type: 'string', title: 'Duration (Optional)' }
            }
          }
        }
      },
      required: ['title']
    }
  };

  readonly title = input<string>('');
  readonly subtitle = input<string>('');
  readonly steps = input<TimelineStep[]>([]);
}
