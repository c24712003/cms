import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

/**
 * SEO Data Interface
 */
export interface SeoData {
    title: string;
    description: string;
    canonical_url: string;
    og_image?: string;
    schema_type?: string;
    noindex?: boolean;
    nofollow?: boolean;
    updated_at?: string;
    site_name?: string;
    organization_name?: string;
    organization_logo?: string;
    twitter_handle?: string;
    lang_code?: string;
    slug?: string;
    template?: string;
}

/**
 * SEO Service
 * Manages all SEO-related meta tags including:
 * - Title tag
 * - Meta description
 * - Canonical URL
 * - Open Graph tags
 * - Twitter Cards
 * - Robots directives
 */
@Injectable({
    providedIn: 'root'
})
export class SeoService {
    private baseUrl = '/api/seo';
    private siteSettings: Record<string, string> = {};
    private settingsLoaded = false;

    constructor(
        private meta: Meta,
        private titleService: Title,
        private http: HttpClient,
        @Inject(DOCUMENT) private document: Document,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    /**
     * Load site-wide SEO settings
     */
    loadSettings(): Observable<Record<string, string>> {
        if (this.settingsLoaded) {
            return of(this.siteSettings);
        }

        return this.http.get<Record<string, string>>(`${this.baseUrl}/settings`).pipe(
            tap(settings => {
                this.siteSettings = settings;
                this.settingsLoaded = true;
            }),
            catchError(() => of({}))
        );
    }

    /**
     * Get SEO data for a specific page from API
     */
    getPageSeoData(slug: string, lang: string): Observable<SeoData> {
        return this.http.get<SeoData>(`${this.baseUrl}/page/${slug}?lang=${lang}`).pipe(
            catchError(() => of({
                title: this.siteSettings['site_name'] || 'CMS Demo',
                description: this.siteSettings['site_description'] || '',
                canonical_url: ''
            }))
        );
    }

    /**
     * Set page title
     */
    setTitle(title: string): void {
        this.titleService.setTitle(title);
    }

    /**
     * Set meta description
     */
    setDescription(description: string): void {
        this.meta.updateTag({ name: 'description', content: description });
    }

    /**
     * Set canonical URL
     */
    setCanonicalUrl(url: string): void {
        // Remove existing canonical
        const existingCanonical = this.document.querySelector('link[rel="canonical"]');
        if (existingCanonical) {
            existingCanonical.remove();
        }

        // Add new canonical
        const link = this.document.createElement('link');
        link.setAttribute('rel', 'canonical');
        link.setAttribute('href', url);
        this.document.head.appendChild(link);
    }

    /**
     * Set robots meta tag (noindex, nofollow)
     */
    setRobots(noindex: boolean = false, nofollow: boolean = false): void {
        const directives: string[] = [];

        if (noindex) {
            directives.push('noindex');
        } else {
            directives.push('index');
        }

        if (nofollow) {
            directives.push('nofollow');
        } else {
            directives.push('follow');
        }

        this.meta.updateTag({ name: 'robots', content: directives.join(', ') });
    }

    /**
     * Set Open Graph tags
     */
    setOpenGraph(config: {
        title: string;
        description: string;
        url: string;
        image?: string;
        type?: string;
        siteName?: string;
        locale?: string;
    }): void {
        this.meta.updateTag({ property: 'og:title', content: config.title });
        this.meta.updateTag({ property: 'og:description', content: config.description });
        this.meta.updateTag({ property: 'og:url', content: config.url });
        this.meta.updateTag({ property: 'og:type', content: config.type || 'website' });

        if (config.image) {
            this.meta.updateTag({ property: 'og:image', content: config.image });
            // Recommended image dimensions
            this.meta.updateTag({ property: 'og:image:width', content: '1200' });
            this.meta.updateTag({ property: 'og:image:height', content: '630' });
        }

        if (config.siteName) {
            this.meta.updateTag({ property: 'og:site_name', content: config.siteName });
        }

        if (config.locale) {
            this.meta.updateTag({ property: 'og:locale', content: config.locale });
        }
    }

    /**
     * Set Twitter Card tags
     */
    setTwitterCard(config: {
        title: string;
        description: string;
        image?: string;
        card?: 'summary' | 'summary_large_image' | 'app' | 'player';
        site?: string;
        creator?: string;
    }): void {
        this.meta.updateTag({ name: 'twitter:card', content: config.card || 'summary_large_image' });
        this.meta.updateTag({ name: 'twitter:title', content: config.title });
        this.meta.updateTag({ name: 'twitter:description', content: config.description });

        if (config.image) {
            this.meta.updateTag({ name: 'twitter:image', content: config.image });
        }

        if (config.site) {
            this.meta.updateTag({ name: 'twitter:site', content: config.site });
        }

        if (config.creator) {
            this.meta.updateTag({ name: 'twitter:creator', content: config.creator });
        }
    }

    /**
     * Set alternate language links (hreflang)
     */
    setAlternateLanguages(alternates: Array<{ lang: string; url: string }>): void {
        // Remove existing alternates
        this.document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(el => el.remove());

        alternates.forEach(alt => {
            const link = this.document.createElement('link');
            link.setAttribute('rel', 'alternate');
            link.setAttribute('hreflang', alt.lang);
            link.setAttribute('href', alt.url);
            this.document.head.appendChild(link);
        });
    }

    /**
     * Apply full SEO configuration from API data
     */
    applySeoData(data: SeoData): void {
        // Title
        this.setTitle(data.title);

        // Description
        if (data.description) {
            this.setDescription(data.description);
        }

        // Canonical
        if (data.canonical_url) {
            this.setCanonicalUrl(data.canonical_url);
        }

        // Robots
        this.setRobots(data.noindex, data.nofollow);

        // Open Graph
        this.setOpenGraph({
            title: data.title,
            description: data.description || '',
            url: data.canonical_url || '',
            image: data.og_image,
            siteName: data.site_name,
            locale: this.langToLocale(data.lang_code || 'en')
        });

        // Twitter Card
        this.setTwitterCard({
            title: data.title,
            description: data.description || '',
            image: data.og_image,
            site: data.twitter_handle
        });
    }

    /**
     * Convert language code to locale format
     */
    private langToLocale(lang: string): string {
        const localeMap: Record<string, string> = {
            'en': 'en_US',
            'zh-TW': 'zh_TW',
            'ja': 'ja_JP',
            'ko': 'ko_KR'
        };
        return localeMap[lang] || 'en_US';
    }

    /**
     * Clear all SEO tags (useful when leaving a page)
     */
    clearSeoTags(): void {
        this.meta.removeTag('name="description"');
        this.meta.removeTag('name="robots"');
        this.meta.removeTag('property="og:title"');
        this.meta.removeTag('property="og:description"');
        this.meta.removeTag('property="og:url"');
        this.meta.removeTag('property="og:image"');
        this.meta.removeTag('property="og:type"');
        this.meta.removeTag('property="og:site_name"');
        this.meta.removeTag('name="twitter:card"');
        this.meta.removeTag('name="twitter:title"');
        this.meta.removeTag('name="twitter:description"');
        this.meta.removeTag('name="twitter:image"');

        // Remove canonical
        const canonical = this.document.querySelector('link[rel="canonical"]');
        if (canonical) {
            canonical.remove();
        }
    }
}
