import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface FeatureItem {
    icon: string;
    title: string;
    description: string;
}

@Component({
    selector: 'app-feature-grid',
    standalone: true,
    imports: [CommonModule],
    template: `
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-6">
        <h2 class="text-3xl md:text-4xl font-bold text-slate-900 text-center mb-16">
          {{ title }}
        </h2>
        
        <div class="grid md:grid-cols-3 gap-8">
          <div *ngFor="let item of items" 
               class="group p-8 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300">
            <!-- Icon -->
            <div class="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:scale-110 transition-all duration-300">
              <span class="text-2xl" [ngSwitch]="item.icon">
                <ng-container *ngSwitchCase="'icon-certified'">🏆</ng-container>
                <ng-container *ngSwitchCase="'icon-experience'">⏱️</ng-container>
                <ng-container *ngSwitchCase="'icon-support'">🛡️</ng-container>
                <ng-container *ngSwitchDefault>✨</ng-container>
              </span>
            </div>
            
            <h3 class="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
              {{ item.title }}
            </h3>
            <p class="text-slate-600 leading-relaxed">
              {{ item.description }}
            </p>
          </div>
        </div>
      </div>
    </section>
  `
})
export class FeatureGridComponent {
    @Input() title: string = '';
    @Input() items: FeatureItem[] = [];
}
