import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { tap } from 'rxjs';

export interface MediaAsset {
    id?: number;
    type: 'image' | 'document' | 'video_url';
    provider: 'local' | 'youtube';
    filename: string;
    url: string;
    thumbnail_url?: string;
    size_bytes?: number;
    alt_text?: string;
    metadata?: any;
    created_at?: string;
    title?: string; // For external media preview
}

@Injectable({
    providedIn: 'root'
})
export class MediaService {
    readonly assets = signal<MediaAsset[]>([]);

    constructor(private http: HttpClient) { }

    loadAssets(typeFilter: string = 'all') {
        let params = new HttpParams();
        if (typeFilter !== 'all') {
            params = params.set('type', typeFilter);
        }

        this.http.get<any>('/api/media', { params }).subscribe(data => {
            const assets = Array.isArray(data) ? data : (data.data || []);
            this.assets.set(Array.isArray(assets) ? assets : []);
        });
    }

    upload(file: File) {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<MediaAsset>('/api/media/upload', formData).pipe(
            tap(newAsset => {
                this.assets.update(assets => [newAsset, ...assets]);
            })
        );
    }

    parseUrl(url: string) {
        return this.http.post<Partial<MediaAsset>>('/api/media/parse-url', { url });
    }

    saveExternal(asset: Partial<MediaAsset>) {
        return this.http.post<MediaAsset>('/api/media/external', asset).pipe(
            tap(newAsset => {
                // If the current list corresponds to the type or all, add it
                this.assets.update(assets => [newAsset, ...assets]);
            })
        );
    }

    delete(id: number) {
        return this.http.delete(`/api/media/${id}`).pipe(
            tap(() => {
                this.assets.update(assets => assets.filter(a => a.id !== id));
            })
        );
    }
}
