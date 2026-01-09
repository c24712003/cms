import { Injectable, Inject, PLATFORM_ID, TransferState, makeStateKey } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of, tap } from 'rxjs';
import { PageContent } from '../models/language.model';

@Injectable({
    providedIn: 'root'
})
export class PageService {
    constructor(
        private http: HttpClient,
        private transferState: TransferState,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    getPage(slug: string, lang: string): Observable<PageContent> {
        const KEY = makeStateKey<PageContent>(`PAGE_${slug}_${lang}`);

        if (this.transferState.hasKey(KEY)) {
            const stored = this.transferState.get(KEY, null);
            this.transferState.remove(KEY); // Clear after use if needed, or keep for cache
            return of(stored as PageContent);
        } // else fetch

        return this.http.get<PageContent>(`http://localhost:3000/api/pages/${slug}/content?lang=${lang}`).pipe(
            tap(data => {
                if (!isPlatformBrowser(this.platformId)) {
                    this.transferState.set(KEY, data);
                }
            })
        );
    }
}
