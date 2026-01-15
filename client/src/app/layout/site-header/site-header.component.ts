import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { MenuService, MenuItem } from '../../core/services/menu.service';
import { I18nService } from '../../core/services/i18n.service';
import { SiteSettingsService, SiteSettings } from '../../core/services/site-settings.service';
import { GlobalSearchInputComponent } from '../../shared/components/global-search-input/global-search-input.component';

@Component({
  selector: 'app-site-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, GlobalSearchInputComponent],
  template: `
    <header class="bg-white/95 backdrop-blur-sm sticky top-0 z-50 border-b border-slate-200 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <a routerLink="/" class="flex items-center hover:opacity-80 transition-opacity">
            <img *ngIf="settings().header_logo_url || settings().logo_url" 
                 [src]="settings().header_logo_url || settings().logo_url" 
                 [alt]="settings().logo_alt_text || 'Logo'"
                 class="h-10 max-w-[180px] object-contain">
            <span *ngIf="!settings().header_logo_url && !settings().logo_url" class="text-xl font-bold text-slate-900">
              {{ getSiteName() }}
            </span>
          </a>

          <!-- Desktop Nav -->
          <nav class="hidden md:flex items-center space-x-1">
            <ng-container *ngFor="let item of menuItems()">
                <!-- Single Link -->
                <a *ngIf="!item.children || item.children.length === 0"
                   [routerLink]="getLocalizedLink(item.link)" 
                   routerLinkActive="text-blue-600 bg-blue-50" 
                   [routerLinkActiveOptions]="{exact: true}"
                   class="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors">
                    {{ i18n.translate(item.labelKey || item.label) }}
                </a>

                <!-- Dropdown -->
                <div *ngIf="item.children && item.children.length > 0" class="relative group">
                    <button class="flex items-center gap-1 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors group-hover:text-blue-600">
                        {{ i18n.translate(item.labelKey || item.label) }}
                        <svg class="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                    <!-- Dropdown Menu -->
                    <div class="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left z-50">
                        <div class="py-1">
                            <a *ngFor="let child of item.children"
                               [routerLink]="getLocalizedLink(child.link)"
                               class="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600">
                                {{ i18n.translate(child.labelKey || child.label) }}
                            </a>
                        </div>
                    </div>
                </div>
            </ng-container>
          </nav>

          <!-- Actions -->
          <div class="flex items-center space-x-4">
             <div class="w-48 sm:w-64">
                <app-global-search-input mode="public" placeholder="Search..."></app-global-search-input>
             </div>
            <select (change)="switchLang($event)" [value]="i18n.currentLang()" 
                class="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="en-US">🇬🇧 EN</option>
              <option value="zh-TW">🇹🇼 中文</option>
              <!-- Temporarily comment out unsupported languages or map strictly if needed
              <option value="ja">🇯🇵 日本語</option>
              <option value="ko">🇰🇷 한국어</option> -->
            </select>
          </div>
        </div>
      </div>
    </header>
  `
})
export class SiteHeaderComponent implements OnInit {
  menuItems = signal<MenuItem[]>([]);
  settings = signal<SiteSettings>({
    logo_url: null,
    logo_alt_text: 'Site Logo',
    site_name: 'CMS.Demo',
    header_logo_url: null,
    footer_logo_url: null
  });

  constructor(
    private menuService: MenuService,
    public i18n: I18nService,
    private router: Router,
    private siteSettingsService: SiteSettingsService
  ) { }

  ngOnInit() {
    this.menuService.getMenu('main').subscribe({
      next: (menu) => {
        // New Service returns { items: ... }
        this.menuItems.set(menu.items || []);
      },
      error: () => { this.menuItems.set([{ label: 'Home', link: '/home' }, { label: 'Contact', link: '/contact' }]); }
    });

    // Load site settings for logo
    this.siteSettingsService.loadSettings().subscribe(settings => {
      this.settings.set(settings);
    });
  }

  getSiteName(): string {
    const name = this.settings().site_name || 'CMS.Demo';
    // If contains a dot, make the part after the dot blue (for styling like "CMS.Demo")
    return name;
  }

  getLocalizedLink(link: string): string {
    // No language prefix needed - language is determined by cookie/Accept-Language
    return link;
  }

  switchLang(event: any) {
    const lang = event.target.value;
    // Language switch is handled by i18n service which saves cookie and reloads
    this.i18n.switchLanguage(lang);
  }
}

