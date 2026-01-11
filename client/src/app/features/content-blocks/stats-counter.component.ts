import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentBlockManifest } from './block.types';

interface Stat {
  value: string;
  label: string;
}

@Component({
  selector: 'app-stats-counter',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="py-16 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700">
      <div class="max-w-7xl mx-auto px-6">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div *ngFor="let stat of stats" class="text-center">
            <div class="text-4xl md:text-5xl font-bold text-white mb-2">
              {{ stat.value }}
            </div>
            <div class="text-blue-100 text-sm md:text-base font-medium">
              {{ stat.label }}
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class StatsCounterComponent {
  static manifest: ContentBlockManifest = {
    type: 'stats-counter',
    displayName: 'Stats Counter',
    category: 'Features',
    schema: {
      properties: {
        background: { type: 'string', title: 'Background Style' },
        stats: {
          type: 'array',
          title: 'Stats',
          items: {
            type: 'object',
            properties: {
              value: { type: 'string', title: 'Value (e.g. 10+)' },
              label: { type: 'string', title: 'Label' }
            }
          }
        }
      }
    }
  };

  @Input() stats: Stat[] = [];
  @Input() background: string = 'gradient-brand';
}
