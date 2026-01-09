import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

export interface MediaFile {
    filename: string;
    url: string;
    size?: number;
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
                this.files.update(files => [...files, newFile]);
            })
        );
    }
}
