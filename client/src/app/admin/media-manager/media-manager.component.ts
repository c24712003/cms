
import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MediaService, MediaAsset } from '../../core/services/media.service';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { I18nService } from '../../core/services/i18n.service';

@Component({
  selector: 'app-media-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  template: `
    <div class="max-w-7xl mx-auto" (dragover)="onDragOver($event)" (drop)="onDrop($event)">
      <!-- Page Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 class="text-2xl font-bold text-slate-900 dark:text-white">{{ 'MEDIA_LIBRARY' | translate }}</h1>
          <p class="text-slate-500 dark:text-slate-400">{{ 'MEDIA_DESC' | translate }}</p>
        </div>
        
        <div class="flex gap-2">
          <!-- Add Video URL Button -->
          <button (click)="openVideoDialog()" 
                  class="inline-flex items-center px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            <svg class="w-4 h-4 mr-2 text-red-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
            </svg>
            {{ 'BTN_ADD_VIDEO' | translate }}
          </button>
          
          <!-- Upload Button -->
          <input type="file" #fileInput (change)="upload($event)" class="hidden" multiple />
          <button (click)="fileInput.click()" 
                  class="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition-colors">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
            </svg>
            {{ 'BTN_UPLOAD' | translate }}
          </button>
        </div>
      </div>

      <!-- Toolbar: Filters, Search, View Toggle -->
      <div class="flex flex-col md:flex-row gap-4 mb-6 justify-between items-center bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
        
        <!-- Tabs -->
        <div class="flex items-center gap-1 bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
          <button *ngFor="let filter of filters" 
                  (click)="setFilter(filter.id)"
                  [class.bg-white]="currentFilter === filter.id"
                  [class.dark:bg-slate-600]="currentFilter === filter.id"
                  [class.shadow-sm]="currentFilter === filter.id"
                  [class.text-slate-900]="currentFilter === filter.id"
                  [class.dark:text-white]="currentFilter === filter.id"
                  [class.text-slate-500]="currentFilter !== filter.id"
                  [class.dark:text-slate-400]="currentFilter !== filter.id"
                  class="px-3 py-1.5 text-sm font-medium rounded-md transition-all">
            {{ filter.label | translate }}
          </button>
        </div>

        <div class="flex gap-4 w-full md:w-auto">
            <!-- Search -->
            <div class="relative flex-1 md:w-64">
                <input type="text" [(ngModel)]="searchQuery" name="searchQuery" [placeholder]="'SEARCH_FILES' | translate" 
                       class="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all">
                <svg class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
            </div>

            <!-- View Toggle -->
            <div class="flex items-center bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
                <button (click)="viewMode = 'grid'" 
                        [class.bg-white]="viewMode === 'grid'" [class.dark:bg-slate-600]="viewMode === 'grid'" [class.shadow-sm]="viewMode === 'grid'"
                        class="p-1.5 rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all" [title]="'VIEW_GRID' | translate">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
                </button>
                <button (click)="viewMode = 'list'"
                        [class.bg-white]="viewMode === 'list'" [class.dark:bg-slate-600]="viewMode === 'list'" [class.shadow-sm]="viewMode === 'list'"
                        class="p-1.5 rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all" [title]="'VIEW_LIST' | translate">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
                </button>
            </div>
        </div>
      </div>

      <!-- Drag Drop Overlay -->
      <div *ngIf="isDragging" 
           class="fixed inset-0 z-50 bg-blue-500/10 border-4 border-blue-500 border-dashed rounded-lg flex items-center justify-center pointer-events-none">
        <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-xl flex flex-col items-center">
          <svg class="w-12 h-12 text-blue-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
          </svg>
          <span class="text-blue-600 dark:text-blue-400 font-medium">{{ 'DROP_FILES' | translate }}</span>
        </div>
      </div>

      <!-- Content Area -->
      <ng-container *ngIf="filteredAssets().length > 0; else emptyState">
        
        <!-- GRID VIEW -->
        <div *ngIf="viewMode === 'grid'" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            <div *ngFor="let asset of filteredAssets()" 
                 class="group relative bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-all cursor-pointer aspect-square">
                
                <!-- Thumbnail -->
                <div class="w-full h-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center relative">
                    <ng-container [ngSwitch]="asset.type">
                        <div *ngSwitchCase="'video_url'" class="w-full h-full relative">
                            <img [src]="asset.thumbnail_url || 'assets/placeholder-video.png'" class="w-full h-full object-cover" />
                            <div class="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                            <div class="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                                <svg class="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                            </div>
                            </div>
                        </div>
                        <div *ngSwitchCase="'document'" class="flex flex-col items-center justify-center p-4">
                            <svg class="w-12 h-12 text-slate-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                            </svg>
                            <span class="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">{{ getExtension(asset.filename) }}</span>
                        </div>
                        <img *ngSwitchDefault [src]="asset.url" class="w-full h-full object-cover" loading="lazy" />
                    </ng-container>

                    <!-- Badges -->
                    <div class="absolute top-2 left-2 flex gap-1">
                        <span *ngIf="asset.type === 'video_url'" class="bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded backdrop-blur-sm">YouTube</span>
                    </div>
                </div>

                <!-- Hover Overlay -->
                <div class="absolute inset-x-0 bottom-0 bg-white/95 dark:bg-slate-800/95 border-t border-slate-100 dark:border-slate-700 p-3 translate-y-full group-hover:translate-y-0 transition-transform">
                    <p class="text-slate-900 dark:text-white text-sm truncate font-medium mb-1" title="{{ asset.filename }}">{{ asset.filename }}</p>
                    <div class="flex items-center justify-between">
                        <span class="text-xs text-slate-400 dark:text-slate-500">{{ formatSize(asset.size_bytes) }}</span>
                        <div class="flex gap-1">
                            <button (click)="copyUrl($event, asset.url)" class="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors" [title]="'ACTION_COPY_URL' | translate">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                            </button>
                            <button (click)="deleteAsset($event, asset.id!)" class="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors" [title]="'ACTION_DELETE' | translate">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- LIST VIEW -->
        <div *ngIf="viewMode === 'list'" class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <table class="w-full text-left text-sm">
                <thead>
                    <tr class="bg-slate-50 dark:bg-slate-700 border-b border-slate-100 dark:border-slate-600 text-slate-500 dark:text-slate-400">
                        <th class="px-6 py-4 font-medium w-20">{{ 'TBL_PREVIEW' | translate }}</th>
                        <th class="px-6 py-4 font-medium">{{ 'TBL_FILENAME' | translate }}</th>
                        <th class="px-6 py-4 font-medium w-32">{{ 'TBL_TYPE' | translate }}</th>
                        <th class="px-6 py-4 font-medium w-32">{{ 'TBL_SIZE' | translate }}</th>
                        <th class="px-6 py-4 font-medium w-40">{{ 'TBL_DATE' | translate }}</th>
                        <th class="px-6 py-4 font-medium w-24 text-right">{{ 'TBL_ACTIONS' | translate }}</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
                    <tr *ngFor="let asset of filteredAssets()" class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
                        <td class="px-6 py-3">
                            <div class="h-10 w-10 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700 flex items-center justify-center border border-slate-200 dark:border-slate-600">
                                <img *ngIf="asset.type === 'image' || asset.type === 'video_url'" 
                                     [src]="asset.thumbnail_url || asset.url" 
                                     class="h-full w-full object-cover">
                                <svg *ngIf="asset.type === 'document'" class="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                </svg>
                            </div>
                        </td>
                        <td class="px-6 py-3">
                            <p class="font-medium text-slate-900 dark:text-white truncate max-w-[200px]">{{ asset.filename }}</p>
                            <a [href]="asset.url" target="_blank" class="text-xs text-blue-500 hover:text-blue-700 hover:underline">{{ 'ACTION_OPEN_FILE' | translate }}</a>
                        </td>
                        <td class="px-6 py-3">
                            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                                  [ngClass]="{
                                    'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400': asset.type === 'image',
                                    'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400': asset.type === 'video_url',
                                    'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300': asset.type === 'document'
                                  }">
                                {{ (asset.type === 'video_url' ? 'FILTER_VIDEOS' : (asset.type === 'image' ? 'FILTER_IMAGES' : 'FILTER_DOCS')) | translate }}
                            </span>
                        </td>
                        <td class="px-6 py-3 text-slate-500 dark:text-slate-400">{{ formatSize(asset.size_bytes) }}</td>
                        <td class="px-6 py-3 text-slate-500 dark:text-slate-400">{{ asset.created_at | date:'mediumDate' }}</td>
                        <td class="px-6 py-3 text-right">
                            <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button (click)="copyUrl($event, asset.url)" class="p-1.5 text-slate-400 hover:text-blue-600 rounded" title="Copy URL">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                                </button>
                                <button (click)="deleteAsset($event, asset.id!)" class="p-1.5 text-slate-400 hover:text-red-600 rounded" title="Delete">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

      </ng-container>

      <ng-template #emptyState>
        <div class="flex flex-col items-center justify-center py-24 bg-slate-50 dark:bg-slate-800/50 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700">
            <div class="w-16 h-16 bg-white dark:bg-slate-800 rounded-full shadow-sm flex items-center justify-center mb-4">
                <svg class="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
            </div>
            <h3 class="text-lg font-medium text-slate-600 dark:text-slate-300">{{ 'NO_MEDIA' | translate }}</h3>
            <p class="text-slate-500 dark:text-slate-400 mt-1 max-w-sm text-center">
                {{ searchQuery ? ('Adjustment_Tip' | translate) : ('NO_MEDIA_DESC' | translate) }}
            </p>
            <button *ngIf="searchQuery" (click)="searchQuery = ''" class="mt-4 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">{{ 'BTN_CLEAR_SEARCH' | translate }}</button>
        </div>
      </ng-template>

      <!-- Add Video Modal -->
      <div *ngIf="showVideoDialog" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
          <div class="p-6">
            <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-4">{{ 'DIALOG_ADD_VIDEO' | translate }}</h3>
            
            <div class="mb-4">
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{{ 'LABEL_YOUTUBE_URL' | translate }}</label>
              <div class="flex gap-2">
                <input type="text" [(ngModel)]="videoUrl" name="videoUrl" placeholder="https://youtube.com/watch?v=..." 
                       class="flex-1 rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                       (input)="parseVideoUrl()" />
              </div>
            </div>

            <!-- Preview -->
            <div *ngIf="videoPreview" class="mb-6 bg-slate-50 dark:bg-slate-700 rounded-lg p-3 border border-slate-200 dark:border-slate-600">
                <div class="relative aspect-video rounded-md overflow-hidden mb-2">
                    <img [src]="videoPreview.thumbnail_url" class="w-full h-full object-cover">
                </div>
                <h4 class="font-medium text-slate-900 dark:text-white text-sm line-clamp-2">{{ videoPreview.title }}</h4>
            </div>

            <div *ngIf="isParsing" class="flex items-center justify-center py-4 text-slate-500 dark:text-slate-400">
                <svg class="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                {{ 'PROCESSING' | translate }}
            </div>
            
            <div class="flex justify-end gap-2">
              <button (click)="showVideoDialog = false; resetVideoDialog()" class="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white">{{ 'CANCEL' | translate }}</button>
              <button (click)="saveVideo()" [disabled]="!videoPreview" 
                      class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
                {{ 'BTN_ADD_VIDEO' | translate }}
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  `
})
export class MediaManagerComponent implements OnInit {
  currentFilter = 'all';
  viewMode: 'grid' | 'list' = 'grid';
  searchQuery = '';

  filters = [
    { id: 'all', label: 'FILTER_ALL' },
    { id: 'image', label: 'FILTER_IMAGES' },
    { id: 'video_url', label: 'FILTER_VIDEOS' },
    { id: 'document', label: 'FILTER_DOCS' }
  ];

  isDragging = false;
  showVideoDialog = false;
  videoUrl = '';
  videoPreview: Partial<MediaAsset> | null = null;
  isParsing = false;

  filteredAssets = computed(() => {
    const assets = this.mediaService.assets();
    const query = this.searchQuery.toLowerCase();

    return assets.filter(asset => {
      const matchesSearch = !query || asset.filename.toLowerCase().includes(query) || (asset.title && asset.title.toLowerCase().includes(query));
      return matchesSearch;
    });
  });

  constructor(public mediaService: MediaService, private i18n: I18nService) { }

  ngOnInit() {
    this.mediaService.loadAssets();
  }

  setFilter(filter: string) {
    this.currentFilter = filter;
    this.mediaService.loadAssets(filter);
  }

  upload(event: any) {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        this.mediaService.upload(files[i]).subscribe();
      }
    }
  }

  // Drag & Drop
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    if (event.dataTransfer?.files) {
      const files = event.dataTransfer.files;
      for (let i = 0; i < files.length; i++) {
        this.mediaService.upload(files[i]).subscribe();
      }
    }
  }

  // Video Handling
  openVideoDialog() {
    this.showVideoDialog = true;
    this.resetVideoDialog();
  }

  resetVideoDialog() {
    this.videoUrl = '';
    this.videoPreview = null;
  }

  parseVideoUrl() {
    if (!this.videoUrl.includes('youtube.com') && !this.videoUrl.includes('youtu.be')) return;

    this.isParsing = true;
    this.mediaService.parseUrl(this.videoUrl).subscribe({
      next: (data) => {
        this.videoPreview = data;
        this.isParsing = false;
      },
      error: () => this.isParsing = false
    });
  }

  saveVideo() {
    if (this.videoPreview) {
      this.mediaService.saveExternal(this.videoPreview).subscribe(() => {
        this.showVideoDialog = false;
        this.resetVideoDialog();
      });
    }
  }

  deleteAsset(event: Event, id: number) {
    event.stopPropagation();
    event.preventDefault();

    if (confirm(this.i18n.translate('MSG_CONFIRM_DELETE'))) {
      this.mediaService.delete(id).subscribe();
    }
  }

  copyUrl(event: Event, url: string) {
    event.stopPropagation();
    event.preventDefault();
    navigator.clipboard.writeText(url).then(() => alert(this.i18n.translate('MSG_URL_COPIED')));
  }

  formatSize(bytes?: number): string {
    if (typeof bytes !== 'number' || bytes === 0) return '-';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + ['B', 'KB', 'MB', 'GB'][i];
  }

  getExtension(filename: string): string {
    return filename.split('.').pop() || '';
  }
}
