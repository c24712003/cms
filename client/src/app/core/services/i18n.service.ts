import { Injectable, signal, computed, PLATFORM_ID, Inject, makeStateKey, TransferState } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Language, TranslationMap } from '../models/language.model';
import { tap, catchError, of, Observable } from 'rxjs';

export const I18N_DATA_KEY = makeStateKey<TranslationMap>('I18N_DATA');
export const LANG_KEY = makeStateKey<string>('I18N_LANG');

const SUPPORTED_LANGS = ['en-US', 'zh-TW'];
const DEFAULT_LANG = 'en-US';

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

            // 2. Browser Detection
            const detected = this.detectBrowserLanguage();
            this.loadTranslations(detected).subscribe();
        } else {
            // Server-side default (could be improved with request headers if using SSR)
            this.loadTranslations(DEFAULT_LANG).subscribe();
        }
    }

    private detectBrowserLanguage(): string {
        const browserLang = navigator.language; // e.g., 'en-US', 'zh-TW', 'en-GB'

        // Exact match
        if (SUPPORTED_LANGS.includes(browserLang)) {
            return browserLang;
        }

        // Partial match (e.g., 'en-GB' -> 'en-US')
        const prefix = browserLang.split('-')[0];
        const partialMatch = SUPPORTED_LANGS.find(lang => lang.startsWith(prefix));

        return partialMatch || DEFAULT_LANG;
    }

    setServerState(lang: string, data: TranslationMap) {
        this.setLanguageState(lang, data);
        this.transferState.set(LANG_KEY, lang);
        this.transferState.set(I18N_DATA_KEY, data);
    }

    switchLanguage(lang: string) {
        if (lang === this.currentLang()) return;
        this.loadTranslations(lang).subscribe();
    }

    /**
     * @deprecated Use switchLanguage instead
     */
    setLanguage(lang: string) {
        this.switchLanguage(lang);
    }

    translate(key: string): string {
        const map = this.translations();
        // Simple nested key support (e.g., 'status.DRAFT')
        const detected = key.split('.').reduce((acc: any, part) => acc && acc[part], map);
        return (detected as string) || key;
    }

    private loadTranslations(lang: string): Observable<TranslationMap> {
        // Load from static assets in public/i18n
        return this.http.get<TranslationMap>(`/i18n/${lang}.json`).pipe(
            tap(data => this.setLanguageState(lang, data)),
            catchError(err => {
                console.error(`Failed to load translations for ${lang}`, err);
                // Fallback to default if loading fails and we aren't already on it
                if (lang !== DEFAULT_LANG) {
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
}
