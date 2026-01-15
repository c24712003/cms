import { Injectable, signal, PLATFORM_ID, Inject, makeStateKey, TransferState } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { TranslationMap } from '../models/language.model';
import { tap, catchError, of, Observable } from 'rxjs';

export const I18N_DATA_KEY = makeStateKey<TranslationMap>('I18N_DATA');
export const LANG_KEY = makeStateKey<string>('I18N_LANG');

const SUPPORTED_LANGS = ['en-US', 'zh-TW', 'ja', 'ko'];
const DEFAULT_LANG = 'en-US';
const LANG_COOKIE_NAME = 'preferred_lang';

@Injectable({
    providedIn: 'root'
})
export class I18nService {
    readonly currentLang = signal<string>(DEFAULT_LANG);
    readonly translations = signal<TranslationMap>({});

    constructor(
        private http: HttpClient,
        private transferState: TransferState,
        @Inject(PLATFORM_ID) private platformId: Object,
        @Inject(DOCUMENT) private document: Document
    ) {
        // Initialization is now explicit via initLanguage() called from App or APP_INITIALIZER
    }

    initLanguage() {
        if (isPlatformBrowser(this.platformId)) {
            // 1. Try TransferState (SSR hydration)
            const serverLang = this.transferState.get(LANG_KEY, '');
            const serverData = this.transferState.get(I18N_DATA_KEY, null);

            if (serverLang && serverData) {
                this.setLanguageState(serverLang, serverData);
                return;
            }

            // 2. Check cookie for user preference
            const cookieLang = this.getCookie(LANG_COOKIE_NAME);
            if (cookieLang && SUPPORTED_LANGS.includes(cookieLang)) {
                this.loadTranslations(cookieLang).subscribe();
                return;
            }

            // 3. Browser Detection
            const detected = this.detectBrowserLanguage();
            const normalized = this.normalizeLanguage(detected);
            this.loadTranslations(normalized).subscribe();
        } else {
            // Server-side default
            this.loadTranslations(DEFAULT_LANG).subscribe();
        }
    }

    private detectBrowserLanguage(): string {
        const browserLang = navigator.language; // e.g., 'en-US', 'zh-TW', 'en-GB'
        return this.normalizeLanguage(browserLang);
    }

    private normalizeLanguage(lang: string): string {
        // 1. Exact match Check
        if (SUPPORTED_LANGS.includes(lang)) {
            return lang;
        }

        // 2. Normalize input (lowercase, handle variants)
        const lower = lang.toLowerCase();

        // Map common variants to our supported formats
        if (lower.startsWith('en')) return 'en-US';
        if (lower === 'zh-tw' || lower === 'zh-hant') return 'zh-TW';
        if (lower.startsWith('zh')) return 'zh-TW'; // Default zh to TW for now

        // 3. Partial/Prefix match from supported list
        // This handles cases where we might support 'fr-FR' and user has 'fr'
        const prefix = lang.split('-')[0];
        const partialMatch = SUPPORTED_LANGS.find(l => l.startsWith(prefix));
        if (partialMatch) return partialMatch;

        return DEFAULT_LANG;
    }

    setServerState(lang: string, data: TranslationMap) {
        const normalized = this.normalizeLanguage(lang);
        this.setLanguageState(normalized, data);
        this.transferState.set(LANG_KEY, normalized);
        this.transferState.set(I18N_DATA_KEY, data);
    }

    switchLanguage(lang: string) {
        const normalized = this.normalizeLanguage(lang);
        if (normalized === this.currentLang()) return;

        // Save preference to cookie
        this.setCookie(LANG_COOKIE_NAME, normalized, 365);

        // Load translations and reload content
        this.loadTranslations(normalized).subscribe(() => {
            // Trigger page content reload by refreshing the current view
            if (isPlatformBrowser(this.platformId)) {
                window.location.reload();
            }
        });
    }

    /**
     * @deprecated Use switchLanguage instead
     */
    setLanguage(lang: string) {
        this.switchLanguage(lang);
    }

    refresh() {
        this.loadTranslations(this.currentLang()).subscribe();
    }

    translate(key: string): string {
        const map = this.translations();
        // Simple nested key support (e.g., 'status.DRAFT')
        const detected = key.split('.').reduce((acc: any, part) => acc && acc[part], map);
        return (detected as string) || key;
    }

    private loadTranslations(lang: string): Observable<TranslationMap> {
        // Ensure we are loading a supported language
        const targetLang = this.normalizeLanguage(lang);

        // Load from static assets in public/i18n
        // Since Admin now writes directly to these files, they are the single source of truth.
        return this.http.get<TranslationMap>(`/i18n/${targetLang}.json`).pipe(
            tap(data => this.setLanguageState(targetLang, data)),
            catchError(err => {
                console.error(`Failed to load translations for ${targetLang}`, err);
                // Fallback to default if loading fails and we aren't already on it
                if (targetLang !== DEFAULT_LANG) {
                    return this.loadTranslations(DEFAULT_LANG);
                }
                return of({});
            })
        );
    }

    private setLanguageState(lang: string, data: TranslationMap) {
        this.currentLang.set(lang);
        this.translations.set(data);
        this.document.documentElement.lang = lang;
    }

    // Cookie utilities
    private setCookie(name: string, value: string, days: number): void {
        if (!isPlatformBrowser(this.platformId)) return;
        const expires = new Date();
        expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
        this.document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
    }

    private getCookie(name: string): string | null {
        if (!isPlatformBrowser(this.platformId)) return null;
        const match = this.document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? match[2] : null;
    }
}

