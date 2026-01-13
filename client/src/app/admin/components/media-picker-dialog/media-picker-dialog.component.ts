import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';

interface MediaAsset {
    id: number;
    filename: string;
    url: string;
    type: string;
    size: number;
    created_at: string;
}

@Component({
    selector: 'app-media-picker-dialog',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslatePipe],
    template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" (click)="close()">
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col overflow-hidden" (click)="$event.stopPropagation()">
            <!-- Header -->
            <div class="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <h3 class="text-lg font-bold text-slate-800 dark:text-white">{{ 'MEDIA_PICKER_TITLE' | translate }}</h3>
                <button (click)="close()" class="btn btn-ghost btn-sm btn-circle">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </div>
            
            <!-- Search & Filter -->
            <div class="p-4 border-b border-slate-200 dark:border-slate-700 flex gap-3">
                <input 
                    type="text" 
                    [(ngModel)]="searchQuery"
                    (ngModelChange)="filterAssets()"
                    [placeholder]="'SEARCH_FILES' | translate"
                    class="input input-bordered flex-1 dark:bg-slate-700 dark:border-slate-600" />
                <select [(ngModel)]="filterType" (ngModelChange)="filterAssets()" class="select select-bordered dark:bg-slate-700 dark:border-slate-600">
                    <option value="all">{{ 'FILTER_ALL' | translate }}</option>
                    <option value="image">{{ 'FILTER_IMAGES' | translate }}</option>
                    <option value="video">{{ 'FILTER_VIDEOS' | translate }}</option>
                </select>
            </div>
            
            <!-- Gallery Grid -->
            <div class="flex-1 overflow-y-auto p-4">
                <div *ngIf="loading" class="flex justify-center py-12">
                    <span class="loading loading-spinner loading-lg text-primary"></span>
                </div>
                
                <div *ngIf="!loading && filteredAssets.length === 0" class="text-center py-12 text-slate-400">
                    <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    <p>{{ 'NO_MEDIA' | translate }}</p>
                </div>
                
                <div *ngIf="!loading && filteredAssets.length > 0" class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    <button 
                        *ngFor="let asset of filteredAssets"
                        (click)="selectAsset(asset)"
                        class="aspect-square rounded-lg overflow-hidden border-2 transition-all hover:shadow-lg focus:outline-none"
                        [class.border-primary]="selectedAsset?.id === asset.id"
                        [class.border-transparent]="selectedAsset?.id !== asset.id"
                        [class.ring-2]="selectedAsset?.id === asset.id"
                        [class.ring-primary/30]="selectedAsset?.id === asset.id">
                        
                        <!-- Image Preview -->
                        <div *ngIf="isImage(asset)" class="w-full h-full bg-cover bg-center" [style.background-image]="'url(' + asset.url + ')'"></div>
                        
                        <!-- Video/Other Preview -->
                        <div *ngIf="!isImage(asset)" class="w-full h-full bg-slate-100 dark:bg-slate-700 flex flex-col items-center justify-center p-2">
                            <svg class="w-8 h-8 text-slate-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                            </svg>
                            <span class="text-xs text-slate-500 truncate w-full text-center">{{ asset.filename }}</span>
                        </div>
                    </button>
                </div>
            </div>
            
            <!-- Footer -->
            <div class="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                <div class="text-sm text-slate-500">
                    <span *ngIf="selectedAsset">{{ selectedAsset.filename }}</span>
                </div>
                <div class="flex gap-2">
                    <button (click)="close()" class="btn btn-ghost">{{ 'CANCEL' | translate }}</button>
                    <button 
                        (click)="confirm()" 
                        [disabled]="!selectedAsset"
                        class="btn btn-primary">
                        {{ 'MEDIA_PICKER_SELECT' | translate }}
                    </button>
                </div>
            </div>
        </div>
    </div>
    `
})
export class MediaPickerDialogComponent implements OnInit {
    @Output() selected = new EventEmitter<string>();
    @Output() cancelled = new EventEmitter<void>();

    assets: MediaAsset[] = [];
    filteredAssets: MediaAsset[] = [];
    selectedAsset: MediaAsset | null = null;
    loading = true;
    searchQuery = '';
    filterType = 'all';

    constructor(private http: HttpClient) { }

    ngOnInit() {
        this.loadAssets();
    }

    loadAssets() {
        this.loading = true;
        this.http.get<MediaAsset[]>('/api/media').subscribe({
            next: (data) => {
                this.assets = data;
                this.filterAssets();
                this.loading = false;
            },
            error: () => {
                this.loading = false;
            }
        });
    }

    filterAssets() {
        let filtered = this.assets;

        // Filter by type
        if (this.filterType !== 'all') {
            filtered = filtered.filter(a => a.type.startsWith(this.filterType));
        }

        // Filter by search query
        if (this.searchQuery.trim()) {
            const query = this.searchQuery.toLowerCase();
            filtered = filtered.filter(a => a.filename.toLowerCase().includes(query));
        }

        this.filteredAssets = filtered;
    }

    selectAsset(asset: MediaAsset) {
        this.selectedAsset = asset;
    }

    isImage(asset: MediaAsset): boolean {
        return asset.type.startsWith('image/');
    }

    confirm() {
        if (this.selectedAsset) {
            this.selected.emit(this.selectedAsset.url);
        }
    }

    close() {
        this.cancelled.emit();
    }
}
