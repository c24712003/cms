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
    <header class="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 transition-all duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
            <!-- Logo -->
            <div class="flex-shrink-0 flex items-center">
                <a routerLink="/" class="text-2xl font-black text-slate-900 tracking-tight hover:text-blue-600 transition-colors">
                    CMS<span class="text-blue-600">.Demo</span>
                </a>
            </div>

            <!-- Desktop Menu -->
            <nav class="hidden md:flex space-x-8">
                <a *ngFor="let item of menuItems()" 
                   [routerLink]="getLocalizedLink(item.link)" 
                   routerLinkActive="text-blue-600 font-semibold" 
                   [routerLinkActiveOptions]="{exact: true}"
                   class="text-slate-600 hover:text-slate-900 px-3 py-2 text-sm font-medium transition-colors">
                   {{ item.label }}
                </a>
            </nav>

            <!-- Actions -->
            <div class="flex items-center space-x-4">
                <select (change)="switchLang($event)" [value]="i18n.currentLang()" 
                    class="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2">
                    <option value="en">🇬🇧 EN</option>
                    <option value="zh-TW">🇹🇼 中文</option>
                    <option value="jp">🇯🇵 JP</option>
                </select>
                <a routerLink="/admin" class="text-sm font-medium text-slate-500 hover:text-blue-600">Admin</a>
            </div>
        </div>
      </div>
    </header>
  `
})
export class SiteHeaderComponent implements OnInit {
  menuItems = signal<MenuItem[]>([]);

  constructor(
    private menuService: MenuService,
    public i18n: I18nService
  ) { }

  ngOnInit() {
    this.menuService.getMenu('main').subscribe({
      next: (menu) => {
        if (Array.isArray(menu.items_json)) {
          this.menuItems.set(menu.items_json);
        }
      },
      error: () => {
        this.menuItems.set([
          { label: 'Home', link: '/home' },
          { label: 'Contact', link: '/contact' }
        ]);
      }
    });
  }

  getLocalizedLink(link: string): string {
    if (link.startsWith('/')) {
      return `/${this.i18n.currentLang()}${link}`;
    }
    return link;
  }

  switchLang(event: any) {
    const lang = event.target.value;
    const currentUrl = window.location.pathname;
    const newUrl = currentUrl.replace(/^\/[a-z]{2}(?:-[a-z]{2})?/, `/${lang}`);
    window.location.href = newUrl;
  }
}
