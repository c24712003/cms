import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

export interface MediaFile {
    id: number;
    filename: string;
    url: string;
    size?: number;
    alt_text?: string;
}

@Injectable({
    providedIn: 'root'
})
export class MediaService {
    readonly files = signal<MediaFile[]>([]);

    constructor(private http: HttpClient) { }

    loadFiles() {
        this.http.get<MediaFile[]>('/api/media').subscribe(data => {
            this.files.set(data);
        });
    }

    upload(file: File) {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<MediaFile>('/api/media/upload', formData).pipe(
            tap(newFile => {
                this.files.update(files => [newFile, ...files]);
            })
        );
    }

    updateMetadata(id: number, metadata: { alt_text?: string, original_name?: string }) {
        return this.http.put(`/api/media/${id}`, metadata).pipe(
            tap(() => {
                this.files.update(files => files.map(f =>
                    f.id === id ? { ...f, ...metadata } : f
                ));
            })
        );
    }

    delete(id: number) {
        return this.http.delete(`/api/media/${id}`).pipe(
            tap(() => {
                this.files.update(files => files.filter(f => f.id !== id));
            })
        );
    }
}
