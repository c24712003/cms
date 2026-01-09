import { Component, EventEmitter, Output, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaService, MediaFile } from '../../core/services/media.service';

@Component({
    selector: 'app-media-picker',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="picker-overlay">
      <div class="picker-modal">
        <h3>Select Image</h3>
        <div class="grid">
            <div class="item" *ngFor="let file of mediaService.files()" (click)="select(file)">
                <img [src]="file.url" />
                <div class="name">{{ file.filename }}</div>
            </div>
        </div>
        <div class="actions">
            <button (click)="cancel()">Cancel</button>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .picker-overlay { position: fixed; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; }
    .picker-modal { background: white; padding: 20px; border-radius: 8px; width: 80%; max-width: 600px; max-height: 80vh; overflow-y: auto; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 10px; margin: 15px 0; }
    .item { border: 1px solid #ddd; cursor: pointer; text-align: center; }
    .item:hover { border-color: #3498db; background: #f0f8ff; }
    img { width: 100%; height: 80px; object-fit: cover; }
    .name { font-size: 0.7rem; padding: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .actions { text-align: right; }
    button { padding: 5px 15px; cursor: pointer; }
  `]
})
export class MediaPickerComponent implements OnInit {
    @Output() onSelect = new EventEmitter<MediaFile>();
    @Output() onCancel = new EventEmitter<void>();

    constructor(public mediaService: MediaService) { }

    ngOnInit() {
        this.mediaService.loadFiles();
    }

    select(file: MediaFile) {
        this.onSelect.emit(file);
    }

    cancel() {
        this.onCancel.emit();
    }
}
