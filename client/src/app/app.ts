import { Component, Inject, LOCALE_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { I18nService } from './core/services/i18n.service';
import { CommonModule } from '@angular/common';
import { SiteHeaderComponent } from './layout/site-header/site-header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, SiteHeaderComponent],
  template: `
    <div class="min-h-screen flex flex-col bg-slate-50">
      <app-site-header></app-site-header>
      
      <main class="flex-1">
        <router-outlet></router-outlet>
      </main>
      
      <!-- Footer -->
      <footer class="bg-slate-900 text-white mt-auto">
        <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 class="text-lg font-bold mb-4">CMS<span class="text-blue-400">.Demo</span></h3>
              <p class="text-slate-400 text-sm">A modern, multilingual content management system built with Angular and Node.js.</p>
            </div>
            <div>
              <h4 class="font-semibold text-slate-200 mb-4">Quick Links</h4>
              <ul class="space-y-2 text-sm text-slate-400">
                <li><a href="/" class="hover:text-white transition-colors">Home</a></li>
                <li><a href="/admin" class="hover:text-white transition-colors">Admin Dashboard</a></li>
              </ul>
            </div>
            <div>
              <h4 class="font-semibold text-slate-200 mb-4">Contact</h4>
              <p class="text-sm text-slate-400">Built with ❤️ using Angular v21</p>
            </div>
          </div>
          <div class="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-500">
            © 2026 CMS Demo. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  `
})
export class App {
  constructor(public i18n: I18nService, @Inject(LOCALE_ID) public locale: string) { }
}
