import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Breadcrumb {
  label: string;
  link?: string;
}

@Component({
  selector: 'app-page-hero',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="relative py-20 md:py-28 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 overflow-hidden">
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute inset-0" style="background-image: url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23ffffff&quot; fill-opacity=&quot;0.4&quot;%3E%3Cpath d=&quot;M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div>
      </div>
      
      <div class="relative z-10 max-w-7xl mx-auto px-6">
        <!-- Breadcrumb -->
        <nav *ngIf="breadcrumb.length" class="mb-8 flex items-center gap-2 text-sm">
          <ng-container *ngFor="let item of breadcrumb; let last = last">
            <a *ngIf="item.link" [routerLink]="item.link" class="text-blue-300 hover:text-white transition-colors">
              {{ item.label }}
            </a>
            <span *ngIf="!item.link" class="text-slate-400">{{ item.label }}</span>
            <svg *ngIf="!last" class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </ng-container>
        </nav>
        
        <div class="max-w-3xl">
          <h1 class="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            {{ title }}
          </h1>
          <p class="text-xl text-slate-300 leading-relaxed">
            {{ subtitle }}
          </p>
        </div>
      </div>
    </section>
  `
})
export class PageHeroComponent {
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() breadcrumb: Breadcrumb[] = [];
  @Input() image: string = '';
}
