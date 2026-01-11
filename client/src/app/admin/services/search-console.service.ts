import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

/**
 * Search Console Performance Data
 */
export interface SearchAnalyticsRow {
    keys: string[]; // [query, page, country, device, date] depending on dimensions
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
}

export interface SearchAnalyticsResponse {
    rows: SearchAnalyticsRow[];
    responseAggregationType: string;
}

/**
 * Indexed Page Status
 */
export interface PageIndexStatus {
    url: string;
    verdict: 'PASS' | 'NEUTRAL' | 'FAIL';
    coverageState: string;
    robotsTxtState: string;
    indexingState: string;
    lastCrawlTime?: string;
}

/**
 * Search Console Service (Architecture)
 * Note: This requires OAuth2 setup with Google Cloud Console
 * The actual API calls would need a backend proxy for security
 */
@Injectable({
    providedIn: 'root'
})
export class SearchConsoleService {
    private readonly API_BASE = '/api/search-console'; // Proxy through backend

    constructor(private http: HttpClient) { }

    /**
     * Check if Search Console is configured
     */
    isConfigured(): Observable<boolean> {
        return this.http.get<{ configured: boolean }>(`${this.API_BASE}/status`).pipe(
            map(res => res.configured),
            catchError(() => of(false))
        );
    }

    /**
     * Get search performance data
     * @param siteUrl The site URL in Search Console (e.g., 'https://example.com/')
     * @param startDate Start date (YYYY-MM-DD)
     * @param endDate End date (YYYY-MM-DD)
     * @param dimensions Array of dimensions: 'query', 'page', 'country', 'device', 'date'
     */
    getSearchAnalytics(config: {
        siteUrl: string;
        startDate: string;
        endDate: string;
        dimensions?: string[];
        rowLimit?: number;
        startRow?: number;
    }): Observable<SearchAnalyticsResponse> {
        return this.http.post<SearchAnalyticsResponse>(`${this.API_BASE}/analytics`, {
            siteUrl: config.siteUrl,
            startDate: config.startDate,
            endDate: config.endDate,
            dimensions: config.dimensions || ['query'],
            rowLimit: config.rowLimit || 100,
            startRow: config.startRow || 0
        }).pipe(
            catchError(err => {
                console.error('Search Console analytics error:', err);
                return of({ rows: [], responseAggregationType: 'auto' });
            })
        );
    }

    /**
     * Get top queries for a specific page
     */
    getTopQueriesForPage(siteUrl: string, pageUrl: string, days: number = 28): Observable<SearchAnalyticsRow[]> {
        const endDate = new Date().toISOString().split('T')[0];
        const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        return this.http.post<SearchAnalyticsResponse>(`${this.API_BASE}/analytics`, {
            siteUrl,
            startDate,
            endDate,
            dimensions: ['query'],
            dimensionFilterGroups: [{
                filters: [{
                    dimension: 'page',
                    expression: pageUrl
                }]
            }],
            rowLimit: 20
        }).pipe(
            map(res => res.rows || []),
            catchError(() => of([]))
        );
    }

    /**
     * Get page index status
     */
    getPageIndexStatus(siteUrl: string, pageUrl: string): Observable<PageIndexStatus | null> {
        return this.http.get<PageIndexStatus>(`${this.API_BASE}/inspect`, {
            params: { siteUrl, pageUrl }
        }).pipe(
            catchError(() => of(null))
        );
    }

    /**
     * Submit URL for indexing
     */
    submitUrlForIndexing(siteUrl: string, url: string): Observable<{ success: boolean; message?: string }> {
        return this.http.post<{ success: boolean; message?: string }>(`${this.API_BASE}/index`, {
            siteUrl,
            url,
            type: 'URL_UPDATED'
        }).pipe(
            catchError(err => of({ success: false, message: err.error?.message || 'Failed to submit' }))
        );
    }

    /**
     * Notify Search Console about sitemap update
     */
    notifySitemapUpdate(siteUrl: string): Observable<{ success: boolean }> {
        return this.http.post<{ success: boolean }>(`${this.API_BASE}/sitemap/notify`, {
            siteUrl,
            sitemapUrl: `${siteUrl.replace(/\/$/, '')}/sitemap.xml`
        }).pipe(
            catchError(() => of({ success: false }))
        );
    }

    /**
     * Get coverage summary (how many pages indexed, errors, etc.)
     */
    getCoverageSummary(siteUrl: string): Observable<{
        valid: number;
        warning: number;
        error: number;
        excluded: number;
    }> {
        return this.http.get<any>(`${this.API_BASE}/coverage`, {
            params: { siteUrl }
        }).pipe(
            map(res => ({
                valid: res.valid || 0,
                warning: res.warning || 0,
                error: res.error || 0,
                excluded: res.excluded || 0
            })),
            catchError(() => of({ valid: 0, warning: 0, error: 0, excluded: 0 }))
        );
    }
}

/**
 * Backend Route Stub (for reference)
 * This would be implemented in server/src/routes/search-console.ts
 * 
 * Requirements:
 * 1. Set up Google Cloud Console project
 * 2. Enable Search Console API
 * 3. Create OAuth2 credentials
 * 4. Store tokens securely
 * 5. Implement token refresh
 * 
 * Example backend structure:
 * 
 * import { google } from 'googleapis';
 * 
 * const searchConsole = google.searchconsole('v1');
 * 
 * router.post('/analytics', async (req, res) => {
 *     const auth = getOAuth2Client(); // Get authenticated client
 *     const { siteUrl, startDate, endDate, dimensions, rowLimit } = req.body;
 *     
 *     const response = await searchConsole.searchanalytics.query({
 *         auth,
 *         siteUrl,
 *         requestBody: {
 *             startDate,
 *             endDate,
 *             dimensions,
 *             rowLimit
 *         }
 *     });
 *     
 *     res.json(response.data);
 * });
 */
