import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SiteHeaderComponent } from '../site-header/site-header.component';
import { SiteFooterComponent } from '../site-footer/site-footer.component';

@Component({
  selector: 'app-site-layout',
  standalone: true,
  imports: [RouterOutlet, CommonModule, SiteHeaderComponent, SiteFooterComponent],
  template: `
    <div class="min-h-screen flex flex-col bg-slate-50">
      <app-site-header></app-site-header>
      
      <main class="flex-1">
        <router-outlet></router-outlet>
      </main>
      
      <!-- Footer -->
      <!-- Footer -->
      <app-site-footer></app-site-footer>
    </div>
  `
})
export class SiteLayoutComponent { }
