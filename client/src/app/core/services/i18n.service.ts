import { Injectable, signal, computed, PLATFORM_ID, Inject, makeStateKey, TransferState } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Language, TranslationMap } from '../models/language.model';
import { tap } from 'rxjs';

export const I18N_DATA_KEY = makeStateKey<TranslationMap>('I18N_DATA');
export const LANG_KEY = makeStateKey<string>('I18N_LANG');

@Injectable({
    providedIn: 'root'
})
export class I18nService {
    readonly currentLang = signal<string>('en');
    readonly translations = signal<TranslationMap>({});

    constructor(
        private http: HttpClient,
        private transferState: TransferState,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        this.init();
    }

    private init() {
        if (isPlatformBrowser(this.platformId)) {
            // Hydration: Check TransferState first
            const serverLang = this.transferState.get(LANG_KEY, 'en');
            const serverData = this.transferState.get(I18N_DATA_KEY, {});

            this.currentLang.set(serverLang);
            this.translations.set(serverData);
        }
    }

    /**
     * Called by Server Logic to seed data into TransferState
     */
    setServerState(lang: string, data: TranslationMap) {
        this.currentLang.set(lang);
        this.translations.set(data);
        this.transferState.set(LANG_KEY, lang);
        this.transferState.set(I18N_DATA_KEY, data);
    }

    /**
     * Client-side language switch (Hot-swap or Navigate)
     * Ideally, this should trigger a navigation to /:newLang/...
     */
    switchLanguage(lang: string) {
        // For a true SEO friendly CMS, we usually just redirect window.location
        // But for hot-swapping demo:
        const newUrl = window.location.pathname.replace(/^\/[a-z]{2}(-[a-z]{2})?/, `/${lang}`);
        window.location.href = newUrl;
    }

    translate(key: string): string {
        return this.translations()[key] || key;
    }
}
