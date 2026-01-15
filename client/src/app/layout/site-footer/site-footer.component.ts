import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MenuService, MenuItem, SocialLink } from '../../core/services/menu.service';
import { I18nService } from '../../core/services/i18n.service';
import { SiteSettingsService, SiteSettings } from '../../core/services/site-settings.service';

@Component({
  selector: 'app-site-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="bg-slate-900 text-white mt-auto">
      <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          <ng-container *ngFor="let item of footerItems()">
            <!-- Case: Brand Widget (3 cols) -->
            <div *ngIf="item.link_type === 'brand-widget'" class="lg:col-span-3">
                <!-- Dynamic Logo -->
                <div class="mb-4">
                    <a routerLink="/" class="inline-block">
                        <img *ngIf="settings().logo_url || settings().footer_logo_url" 
                             [src]="settings().footer_logo_url || settings().logo_url" 
                             [alt]="settings().logo_alt_text || 'Logo'"
                             class="h-10 max-w-[180px] object-contain brightness-0 invert">
                        <span *ngIf="!settings().logo_url && !settings().footer_logo_url" 
                              class="text-lg font-bold">
                            {{ settings().site_name || 'CMS' }}<span class="text-blue-400">.Demo</span>
                        </span>
                    </a>
                </div>
                <p class="text-slate-400 text-sm mb-6">
                    {{ i18n.translate('FOOTER_DESC') }}
                </p>
            </div>

            <!-- Case: Social Widget (3 cols, or auto width) -->
            <div *ngIf="item.link_type === 'social-widget'" class="lg:col-span-3">
                 <h4 class="font-semibold text-slate-200 mb-4">{{ i18n.translate(item.labelKey || item.label || 'TAB_SOCIAL') }}</h4>
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

            <!-- Case: Contact Widget (3 cols) -->
            <div *ngIf="item.link_type === 'contact-widget'" class="lg:col-span-3">
                <h4 class="font-semibold text-slate-200 mb-4">{{ i18n.translate(item.labelKey || item.label || 'FOOTER_CONTACT') }}</h4>
                <div class="space-y-3 text-sm text-slate-400">
                    <p>123 Tech Park Blvd.<br>San Francisco, CA 94107</p>
                    <p><a href="mailto:contact@cms.demo" class="hover:text-white">contact@cms.demo</a></p>
                    <p><a href="tel:+15551234567" class="hover:text-white">+1 (555) 123-4567</a></p>
                </div>
                <p class="text-xs text-slate-500 mt-6">Built with ❤️ using Angular v21</p>
            </div>

            <!-- Case: Standard Menu Column (Default) -->
            <div *ngIf="!['brand-widget', 'social-widget', 'contact-widget'].includes(item.link_type || '')" class="lg:col-span-3">
                <h4 class="font-semibold text-slate-200 mb-4">
                    <a *ngIf="item.link && item.link !== '#'" [routerLink]="getLocalizedLink(item.link)" class="hover:text-blue-400 transition-colors">
                        {{ i18n.translate(item.labelKey || item.label) }}
                    </a>
                    <span *ngIf="!item.link || item.link === '#'">
                        {{ i18n.translate(item.labelKey || item.label) }}
                    </span>
                </h4>
                
                <ul class="space-y-2 text-sm text-slate-400" *ngIf="item.children?.length">
                   <li *ngFor="let child of item.children">
                      <a [routerLink]="getLocalizedLink(child.link)" class="hover:text-white transition-colors">
                         {{ i18n.translate(child.labelKey || child.label) }}
                      </a>
                   </li>
                </ul>
            </div>
          </ng-container>

        </div>
        
        <!-- Copyright -->
        <div class="border-t border-slate-800 mt-12 pt-8 text-center text-sm text-slate-500">
          {{ i18n.translate('FOOTER_COPYRIGHT') }}
        </div>
      </div>
    </footer>
  `
})
export class SiteFooterComponent implements OnInit {
  footerItems = signal<MenuItem[]>([]);
  socialLinks = signal<SocialLink[]>([]);
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
    private siteSettingsService: SiteSettingsService
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

    // Load site settings for logo
    this.siteSettingsService.loadSettings().subscribe(settings => {
      this.settings.set(settings);
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
    // No language prefix needed - language is determined by cookie/Accept-Language
    return link;
  }
}

