import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, shareReplay, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface SiteSettings {
    logo_url: string | null;
    logo_alt_text: string;
    site_name: string;
    header_logo_url: string | null;
    footer_logo_url: string | null;
    [key: string]: any;
}

@Injectable({
    providedIn: 'root'
})
export class SiteSettingsService {
    readonly settings = signal<SiteSettings>({
        logo_url: null,
        logo_alt_text: 'Site Logo',
        site_name: 'CMS.Demo',
        header_logo_url: null,
        footer_logo_url: null
    });

    private cachedSettings$: Observable<SiteSettings> | null = null;

    constructor(private http: HttpClient) { }

    /**
     * Load all site settings (cached)
     */
    loadSettings(forceRefresh = false): Observable<SiteSettings> {
        if (!forceRefresh && this.cachedSettings$) {
            return this.cachedSettings$;
        }

        this.cachedSettings$ = this.http.get<SiteSettings>('/api/site-settings').pipe(
            tap(settings => {
                this.settings.set({
                    ...this.settings(),
                    ...settings
                });
            }),
            shareReplay(1),
            catchError(err => {
                console.error('Failed to load site settings:', err);
                return of(this.settings());
            })
        );

        return this.cachedSettings$;
    }

    /**
     * Get a specific setting
     */
    getSetting(key: string): Observable<any> {
        return this.http.get<{ key: string; value: any }>(`/api/site-settings/${key}`).pipe(
            map(response => response.value)
        );
    }

    /**
     * Update settings (admin only)
     */
    updateSettings(settings: { key: string; value: any }[]): Observable<any> {
        // Invalidate cache
        this.cachedSettings$ = null;

        return this.http.post('/api/site-settings', { settings }).pipe(
            tap(() => {
                // Update local signal
                settings.forEach(s => {
                    this.settings.update(current => ({
                        ...current,
                        [s.key]: s.value
                    }));
                });
            })
        );
    }

    /**
     * Convenience method: Update just the logo
     */
    updateLogo(logoUrl: string | null, altText?: string): Observable<any> {
        const settings: { key: string; value: any }[] = [
            { key: 'logo_url', value: logoUrl }
        ];
        if (altText !== undefined) {
            settings.push({ key: 'logo_alt_text', value: altText });
        }
        return this.updateSettings(settings);
    }

    /**
     * Convenience method: Update footer logo
     */
    updateFooterLogo(logoUrl: string | null): Observable<any> {
        return this.updateSettings([
            { key: 'footer_logo_url', value: logoUrl }
        ]);
    }
}
