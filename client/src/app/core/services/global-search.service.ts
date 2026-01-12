import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { I18nService } from './i18n.service';

export interface SearchResults {
    pages: { id: number; slug_key: string; title: string, lang_code: string, slug_localized?: string, seo_desc?: string }[];
    users: { id: number; username: string; role: string }[];
    media: { id: number; filename: string; original_name: string; type: string; url: string; thumbnail_url?: string }[];
}

@Injectable({
    providedIn: 'root'
})
export class GlobalSearchService {
    private readonly ADMIN_API = '/api/search';
    private readonly PUBLIC_API = '/api/search/public';

    constructor(private http: HttpClient, private i18n: I18nService) { }

    search(query: string, mode: 'admin' | 'public' = 'admin'): Observable<SearchResults> {
        // console.log(`GlobalSearchService.search (${mode}) called with:`, query);
        if (!query || query.length < 2) {
            return of({ pages: [], users: [], media: [] });
        }

        const api = mode === 'admin' ? this.ADMIN_API : this.PUBLIC_API;
        const params: any = { q: query };

        if (mode === 'public') {
            params.lang = this.i18n.currentLang();
        }

        return this.http.get<SearchResults>(api, { params }).pipe(
            map(res => {
                // console.log(`Search response (${mode}):`, res);
                return {
                    pages: res.pages || [],
                    users: res.users || [],
                    media: res.media || []
                };
            }),
            catchError(err => {
                console.error('Search error', err);
                return of({ pages: [], users: [], media: [] });
            })
        );
    }
}
