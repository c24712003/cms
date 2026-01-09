import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MenuService, MenuItem } from '../../core/services/menu.service';
import { I18nService } from '../../core/services/i18n.service';

@Component({
  selector: 'app-site-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="bg-white/95 backdrop-blur-sm sticky top-0 z-50 border-b border-slate-200 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <a routerLink="/" class="text-xl font-bold text-slate-900 hover:text-blue-600 transition-colors">
            CMS<span class="text-blue-600">.Demo</span>
          </a>

          <!-- Desktop Nav -->
          <nav class="hidden md:flex items-center space-x-1">
            <a *ngFor="let item of menuItems()" 
               [routerLink]="getLocalizedLink(item.link)" 
               routerLinkActive="text-blue-600 bg-blue-50" 
               [routerLinkActiveOptions]="{exact: true}"
               class="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors">
               {{ item.label }}
            </a>
          </nav>

          <!-- Actions -->
          <div class="flex items-center space-x-4">
            <select (change)="switchLang($event)" [value]="i18n.currentLang()" 
                class="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="en">🇬🇧 EN</option>
              <option value="zh-TW">🇹🇼 中文</option>
            </select>
            <a routerLink="/admin" class="btn btn-primary btn-sm">Admin</a>
          </div>
        </div>
      </div>
    </header>
  `
})
export class SiteHeaderComponent implements OnInit {
  menuItems = signal<MenuItem[]>([]);

  constructor(private menuService: MenuService, public i18n: I18nService) { }

  ngOnInit() {
    this.menuService.getMenu('main').subscribe({
      next: (menu) => { if (Array.isArray(menu.items_json)) this.menuItems.set(menu.items_json); },
      error: () => { this.menuItems.set([{ label: 'Home', link: '/home' }, { label: 'Contact', link: '/contact' }]); }
    });
  }

  getLocalizedLink(link: string): string {
    return link.startsWith('/') ? `/${this.i18n.currentLang()}${link}` : link;
  }

  switchLang(event: any) {
    const lang = event.target.value;
    const currentUrl = window.location.pathname;
    const newUrl = currentUrl.replace(/^\/[a-z]{2}(?:-[a-zA-Z]{2})?/, `/${lang}`);
    window.location.href = newUrl || `/${lang}/home`;
  }
}
