import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaService, MediaFile } from '../../core/services/media.service';

@Component({
    selector: 'app-media-manager',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="media-container">
      <h2>Media Manager</h2>
      
      <div class="upload-area">
        <input type="file" #fileInput (change)="onFileSelected($event)" style="display: none" />
        <button (click)="fileInput.click()">+ Upload New Image</button>
      </div>

      <div class="media-grid">
        <div class="media-item" *ngFor="let file of mediaService.files()">
            <img [src]="file.url" [alt]="file.filename" (click)="copyUrl(file.url)" />
            <div class="caption">{{ file.filename }}</div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .media-container { padding: 20px; }
    .upload-area { margin-bottom: 20px; }
    button { padding: 10px 20px; background: #2ecc71; color: white; border: none; border-radius: 4px; cursor: pointer; }
    .media-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 15px; }
    .media-item { border: 1px solid #ddd; border-radius: 4px; overflow: hidden; text-align: center; cursor: pointer; transition: transform 0.2s; }
    .media-item:hover { transform: scale(1.05); box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
    img { width: 100%; height: 120px; object-fit: cover; }
    .caption { font-size: 0.8rem; padding: 5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  `]
})
export class MediaManagerComponent implements OnInit {

    constructor(public mediaService: MediaService) { }

    ngOnInit() {
        this.mediaService.loadFiles();
    }

    onFileSelected(event: any) {
        const file = event.target.files[0];
        if (file) {
            this.mediaService.upload(file).subscribe({
                next: () => alert('Upload Successful'),
                error: () => alert('Upload Failed')
            });
        }
    }

    copyUrl(url: string) {
        // In a real app this might open a preview or select it
        // For now, just copy full URL to clipboard
        const fullUrl = window.location.origin + url;
        navigator.clipboard.writeText(fullUrl).then(() => {
            alert('Image URL copied to clipboard!');
        });
    }
}
