import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MenuService, MenuItem, SocialLink } from '../../core/services/menu.service';
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
            <p class="text-slate-400 text-sm mb-6">
                {{ i18n.translate('FOOTER_DESC') }}
            </p>
            <!-- Social Links -->
            <div class="flex space-x-4">
                <a *ngFor="let social of socialLinks()" 
                   [href]="social.url" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   class="text-slate-400 hover:text-white transition-colors">
                   <img *ngIf="social.icon_path" [src]="social.icon_path" class="w-5 h-5">
                   <i *ngIf="!social.icon_path" [class]="getIconClass(social.platform) + ' text-xl'"></i>
                </a>
            </div>
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
  socialLinks = signal<SocialLink[]>([]);

  constructor(
    private menuService: MenuService,
    public i18n: I18nService
  ) { }

  ngOnInit() {
    this.menuService.getMenu('footer').subscribe({
      next: (menu) => { this.footerItems.set(menu.items || []); },
      error: () => {
        this.footerItems.set([
          { label: 'Privacy Policy', labelKey: 'NAV_PRIVACY', link: '/privacy' },
          { label: 'Terms of Service', labelKey: 'NAV_TERMS', link: '/terms' }
        ]);
      }
    });

    this.menuService.getSocialLinks().subscribe({
      next: (links) => this.socialLinks.set(links.filter(l => l.is_active))
    });
  }

  getIconClass(platform: string): string {
    const map: Record<string, string> = {
      facebook: 'fab fa-facebook',
      twitter: 'fab fa-twitter',
      x: 'fab fa-x-twitter',
      instagram: 'fab fa-instagram',
      linkedin: 'fab fa-linkedin',
      youtube: 'fab fa-youtube',
      github: 'fab fa-github'
    };
    return map[platform.toLowerCase()] || 'fas fa-link';
  }

  getLocalizedLink(link: string): string {
    return link.startsWith('/') ? `/${this.i18n.currentLang()}${link}` : link;
  }
}
