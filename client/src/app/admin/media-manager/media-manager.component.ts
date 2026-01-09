import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaService, MediaFile } from '../../core/services/media.service';

@Component({
  selector: 'app-media-manager',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-bold text-slate-800">Media Library</h2>
        <div class="relative">
            <input type="file" #fileInput (change)="upload($event)" class="hidden" />
            <button class="btn btn-primary flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all" (click)="fileInput.click()">
                <span class="text-xl mr-2">☁️</span> Upload File
            </button>
        </div>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          <div *ngFor="let file of mediaService.files()" class="group relative bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer">
              <div class="aspect-square bg-slate-100 relative overflow-hidden">
                  <img [src]="file.url" class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                      <p class="text-white text-xs truncate font-medium">{{ file.filename }}</p>
                      <p class="text-white/80 text-[10px]">{{ file.size | number }} bytes</p>
                  </div>
              </div>
              
              <!-- Quick Actions overlay -->
              <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button class="p-1.5 bg-white/90 rounded-full text-blue-600 hover:text-blue-700 shadow-sm" (click)="copyUrl(file.url); $event.stopPropagation()" title="Copy URL">
                      🔗
                  </button>
              </div>
          </div>
          
           <!-- Drop Zone / Empty State -->
           <div *ngIf="mediaService.files().length === 0" class="col-span-full py-20 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400 bg-slate-50">
               <div class="text-6xl mb-4">📂</div>
               <p class="text-lg font-medium">No files uploaded yet.</p>
               <p class="text-sm">Click "Upload File" to get started.</p>
           </div>
      </div>
    </div>
  `
})
export class MediaManagerComponent implements OnInit {
  constructor(public mediaService: MediaService) { }

  ngOnInit() {
    this.mediaService.loadFiles();
  }

  upload(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.mediaService.uploadFile(file).subscribe(() => {
        // Auto reload handled by service if implemented, or call loadFiles
        this.mediaService.loadFiles();
      });
    }
  }

  copyUrl(url: string) {
    navigator.clipboard.writeText(url).then(() => alert('URL Copied!'));
  }
}
