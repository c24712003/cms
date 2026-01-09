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
    <header class="site-header">
      <div class="logo">CMS Demo</div>
      <nav>
        <ul>
          <li *ngFor="let item of menuItems()">
            <a [routerLink]="getLocalizedLink(item.link)" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
              {{ item.label }}
            </a>
          </li>
          <li>
            <select (change)="switchLang($event)" [value]="i18n.currentLang()">
                <option value="en">English</option>
                <option value="zh-TW">繁體中文</option>
            </select>
          </li>
        </ul>
      </nav>
    </header>
  `,
    styles: [`
    .site-header { display: flex; justify-content: space-between; align-items: center; padding: 20px; background: #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .logo { font-weight: bold; font-size: 1.5rem; }
    ul { list-style: none; display: flex; gap: 20px; margin: 0; padding: 0; align-items: center; }
    a { text-decoration: none; color: #333; font-weight: 500; }
    a.active { color: #3498db; }
    select { padding: 5px; border-radius: 4px; border: 1px solid #ddd; }
  `]
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
                this.menuItems.set(menu.items_json);
            },
            error: () => {
                // Fallback
                this.menuItems.set([
                    { label: 'Home', link: '/home' },
                    { label: 'Contact', link: '/contact' }
                ]);
            }
        });
    }

    getLocalizedLink(link: string): string {
        // If link starts with /, prepend /lang
        if (link.startsWith('/')) {
            return `/${this.i18n.currentLang()}${link}`;
        }
        return link;
    }

    switchLang(event: any) {
        const lang = event.target.value;
        const currentUrl = window.location.pathname;
        // Simple regex replace for demo: /en/... -> /zh-tw/...
        const newUrl = currentUrl.replace(/^\/[a-z]{2}(?:-[a-z]{2})?/, `/${lang}`);
        window.location.href = newUrl;
    }
}
