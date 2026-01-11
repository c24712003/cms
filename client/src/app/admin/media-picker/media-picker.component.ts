
import { Component, EventEmitter, Output, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaService, MediaAsset } from '../../core/services/media.service';

@Component({
  selector: 'app-media-picker',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" (click)="cancel()">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden" (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h3 class="text-lg font-semibold text-slate-800">Select Media</h3>
            <button class="btn btn-ghost btn-sm btn-icon" (click)="cancel()">×</button>
        </div>

        <!-- Toolbar -->
        <div class="px-6 py-3 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
            <div class="text-sm text-slate-500">
                {{ mediaService.assets().length }} assets found
            </div>
            <div>
                <input type="file" #fileInput (change)="upload($event)" class="hidden" accept="image/*" />
                <button class="btn btn-primary btn-sm" (click)="fileInput.click()">
                    + Upload New
                </button>
            </div>
        </div>

        <!-- Grid -->
        <div class="flex-1 overflow-y-auto p-6 bg-slate-50/50">
            <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <div *ngFor="let asset of mediaService.assets()" 
                     (click)="select(asset)"
                     class="group relative aspect-square bg-white rounded-lg border border-slate-200 overflow-hidden cursor-pointer hover:border-blue-400 hover:shadow-md transition-all">
                    
                    <ng-container [ngSwitch]="asset.type">
                        <!-- Video Placeholder -->
                        <div *ngSwitchCase="'video_url'" class="w-full h-full bg-black flex items-center justify-center">
                            <img [src]="asset.thumbnail_url" class="w-full h-full object-cover opacity-80" />
                            <div class="absolute inset-0 flex items-center justify-center">
                                <span class="bg-red-600 text-white text-[10px] px-1 py-0.5 rounded">Video</span>
                            </div>
                        </div>
                        
                        <!-- Image -->
                        <img *ngSwitchDefault [src]="asset.url" [alt]="asset.alt_text || asset.filename" class="w-full h-full object-cover" />
                    </ng-container>
                    
                    <!-- Hover Info -->
                    <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <p class="text-xs text-white truncate">{{ asset.filename }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 border-t border-slate-100 bg-white flex justify-end">
            <button class="btn btn-ghost mr-2" (click)="cancel()">Cancel</button>
        </div>
      </div>
    </div>
  `
})
export class MediaPickerComponent implements OnInit {
  @Output() onSelect = new EventEmitter<MediaAsset>();
  @Output() onCancel = new EventEmitter<void>();

  constructor(public mediaService: MediaService) { }

  ngOnInit() {
    this.mediaService.loadAssets('image');
  }

  select(asset: MediaAsset) {
    this.onSelect.emit(asset);
  }

  upload(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.mediaService.upload(file).subscribe();
    }
  }

  cancel() {
    this.onCancel.emit();
  }
}
