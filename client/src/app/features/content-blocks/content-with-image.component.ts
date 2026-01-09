import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-content-with-image',
    standalone: true,
    imports: [CommonModule],
    template: `
    <section class="py-20 bg-white">
      <div class="max-w-6xl mx-auto px-6">
        <div class="grid md:grid-cols-2 gap-12 items-center" [class.md:flex-row-reverse]="imagePosition === 'left'">
          <!-- Content -->
          <div [class.order-2]="imagePosition === 'left'" [class.md:order-1]="imagePosition === 'left'">
            <h2 class="text-3xl md:text-4xl font-bold text-slate-900 mb-6">{{ title }}</h2>
            <ul class="space-y-4">
              <li *ngFor="let item of items" class="flex items-start gap-3 text-lg text-slate-700">
                <span class="text-xl mt-0.5">{{ getIcon(item) }}</span>
                <span>{{ getText(item) }}</span>
              </li>
            </ul>
          </div>
          
          <!-- Image -->
          <div [class.order-1]="imagePosition === 'left'" [class.md:order-2]="imagePosition === 'left'">
            <div class="relative">
              <div class="absolute -inset-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl opacity-20 blur-xl"></div>
              <img *ngIf="image" [src]="image" [alt]="title" 
                   class="relative w-full h-auto rounded-2xl shadow-lg" />
              <div *ngIf="!image" class="relative w-full h-64 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center">
                <span class="text-6xl">📋</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class ContentWithImageComponent {
    @Input() title: string = '';
    @Input() items: string[] = [];
    @Input() image: string = '';
    @Input() imagePosition: 'left' | 'right' = 'right';

    getIcon(item: string): string {
        // Extract emoji if it starts with one
        const emojiMatch = item.match(/^[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u);
        return emojiMatch ? emojiMatch[0] : '•';
    }

    getText(item: string): string {
        // Remove leading emoji if present
        return item.replace(/^[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]\s*/u, '');
    }
}
