import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MenuService, MenuItem } from '../../core/services/menu.service';
import { I18nService } from '../../core/services/i18n.service';

@Component({
    selector: 'app-site-footer',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <footer class="bg-slate-900 text-white mt-auto">
      <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Brand -->
          <div>
            <h3 class="text-lg font-bold mb-4">CMS<span class="text-blue-400">.Demo</span></h3>
            <p class="text-slate-400 text-sm">
                {{ i18n.translate('FOOTER_DESC') }}
            </p>
          </div>

          <!-- Quick Links (Dynamic Menu) -->
          <div>
            <h4 class="font-semibold text-slate-200 mb-4">{{ i18n.translate('FOOTER_LINKS') }}</h4>
            <ul class="space-y-2 text-sm text-slate-400">
              <li *ngFor="let item of footerItems()">
                <a [routerLink]="getLocalizedLink(item.link)" class="hover:text-white transition-colors">
                    {{ i18n.translate(item.labelKey || item.label) }}
                </a>
              </li>
            </ul>
          </div>

          <!-- Contact -->
          <div>
            <h4 class="font-semibold text-slate-200 mb-4">{{ i18n.translate('FOOTER_CONTACT') }}</h4>
            <p class="text-sm text-slate-400">Built with ❤️ using Angular v21</p>
          </div>
        </div>
        
        <!-- Copyright -->
        <div class="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-500">
          {{ i18n.translate('FOOTER_COPYRIGHT') }}
        </div>
      </div>
    </footer>
  `
})
export class SiteFooterComponent implements OnInit {
    footerItems = signal<MenuItem[]>([]);

    constructor(
        private menuService: MenuService,
        public i18n: I18nService
    ) { }

    ngOnInit() {
        this.menuService.getMenu('footer').subscribe({
            next: (menu) => { if (Array.isArray(menu.items_json)) this.footerItems.set(menu.items_json); },
            error: () => {
                // Fallback if no footer menu exists
                this.footerItems.set([
                    { label: 'Privacy Policy', labelKey: 'NAV_PRIVACY', link: '/privacy' },
                    { label: 'Terms of Service', labelKey: 'NAV_TERMS', link: '/terms' }
                ]);
            }
        });
    }

    getLocalizedLink(link: string): string {
        return link.startsWith('/') ? `/${this.i18n.currentLang()}${link}` : link;
    }
}
