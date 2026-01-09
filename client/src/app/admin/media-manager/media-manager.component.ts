import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaService, MediaFile } from '../../core/services/media.service';

@Component({
  selector: 'app-media-manager',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <!-- Page Header -->
      <div class="admin-page-header">
        <h1 class="admin-page-title">Media Library</h1>
        <div>
          <input type="file" #fileInput (change)="upload($event)" class="hidden" />
          <button class="btn btn-primary" (click)="fileInput.click()">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
            </svg>
            Upload File
          </button>
        </div>
      </div>

      <!-- Media Grid -->
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div *ngFor="let file of mediaService.files()" 
             class="group relative bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
          <div class="aspect-square bg-slate-100">
            <img [src]="file.url" class="w-full h-full object-cover" loading="lazy" />
          </div>
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
            <p class="text-white text-xs truncate font-medium">{{ file.filename }}</p>
          </div>
          <button (click)="copyUrl(file.url); $event.stopPropagation()" 
                  class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 p-1.5 rounded-full shadow text-blue-600 hover:bg-blue-600 hover:text-white">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/>
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Empty State -->
      <div *ngIf="mediaService.files().length === 0" class="card">
        <div class="card-body text-center py-16">
          <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-slate-600 mb-2">No files uploaded</h3>
          <p class="text-slate-400 mb-4">Click "Upload File" to add your first image</p>
        </div>
      </div>
    </div>
  `
})
export class MediaManagerComponent implements OnInit {
  constructor(public mediaService: MediaService) { }

  ngOnInit() { this.mediaService.loadFiles(); }

  upload(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.mediaService.upload(file).subscribe(() => this.mediaService.loadFiles());
    }
  }

  copyUrl(url: string) {
    navigator.clipboard.writeText(url).then(() => alert('URL Copied!'));
  }
}
