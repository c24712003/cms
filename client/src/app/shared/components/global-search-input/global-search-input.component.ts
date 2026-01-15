import { Component, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { GlobalSearchService, SearchResults } from '../../../core/services/global-search.service';
import { I18nService } from '../../../core/services/i18n.service';

@Component({
    selector: 'app-global-search-input',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    template: `
    <div class="relative group">
      <!-- Search Icon & Input Container -->
      <div class="relative flex items-center">
        <!-- Input -->
        <input 
          type="text" 
          [(ngModel)]="searchQuery"
          name="searchQuery"
          (ngModelChange)="onSearchInput($event)"
          [placeholder]="placeholder()"
          class="w-full pl-10 pr-4 py-2 rounded-lg border text-sm transition-all outline-none"
          [ngClass]="{
            'bg-slate-50 text-slate-900 border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white': mode() === 'admin',
            'bg-slate-100 text-slate-900 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500': mode() === 'public'
          }"
        >
        <!-- Icon -->
        <svg class="w-4 h-4 absolute left-3 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>

        <!-- Clear Button (Optional) -->
        <button *ngIf="searchQuery" (click)="clearSearch()" class="absolute right-2 text-slate-400 hover:text-slate-600">
           <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <!-- Results Dropdown -->
      <div *ngIf="showResults && hasResults()" 
           class="absolute top-full left-0 w-80 mt-2 bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden z-50 max-h-96 overflow-y-auto"
           [ngClass]="{'right-0 left-auto': mode() === 'public'}"
           >
        
        <!-- Public Mode Pages -->
        <ng-container *ngIf="mode() === 'public'">
            <div *ngIf="searchResults.pages.length" class="p-2">
                <a *ngFor="let page of searchResults.pages" 
                   [routerLink]="getPublicLink(page)"
                   (click)="closeSearch()"
                   class="block px-3 py-2 hover:bg-slate-50 rounded-md cursor-pointer transition-colors group">
                  <div class="text-sm font-medium text-slate-800 group-hover:text-blue-600">{{page.title}}</div>
                  <div *ngIf="page.seo_desc" class="text-xs text-slate-500 truncate mt-0.5">{{page.seo_desc}}</div>
                </a>
            </div>
            <div *ngIf="!searchResults.pages.length" class="p-4 text-center text-sm text-slate-500">
                No results found.
            </div>
        </ng-container>

        <!-- Admin Mode Results -->
        <ng-container *ngIf="mode() === 'admin'">
            <!-- Pages -->
            <div *ngIf="searchResults.pages.length" class="p-2">
                <div class="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2 mb-1">Pages</div>
                <a *ngFor="let page of searchResults.pages" 
                    [routerLink]="['/admin/pages/edit', page.id]"
                    (click)="closeSearch()"
                    class="block px-2 py-2 hover:bg-slate-50 rounded-md cursor-pointer transition-colors">
                <div class="text-sm font-medium text-slate-800">{{page.title || page.slug_key}}</div>
                <div class="text-xs text-slate-500">{{page.slug_key}} ({{page.lang_code}})</div>
                </a>
            </div>

            <!-- Users -->
            <div *ngIf="searchResults.users.length" class="p-2 border-t border-slate-100">
                <div class="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2 mb-1">Users</div>
                <a *ngFor="let user of searchResults.users"
                    [routerLink]="['/admin/users']" 
                    (click)="closeSearch()"
                    class="block px-2 py-2 hover:bg-slate-50 rounded-md cursor-pointer transition-colors">
                <div class="text-sm font-medium text-slate-800">{{user.username}}</div>
                <div class="text-xs text-slate-500">{{user.role}}</div>
                </a>
            </div>

            <!-- Media -->
            <div *ngIf="searchResults.media.length" class="p-2 border-t border-slate-100">
                <div class="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2 mb-1">Media</div>
                <a *ngFor="let file of searchResults.media"
                    [routerLink]="['/admin/media']"
                    (click)="closeSearch()"
                    class="block px-2 py-2 hover:bg-slate-50 rounded-md cursor-pointer transition-colors flex items-center gap-2">
                    <img *ngIf="file.thumbnail_url" [src]="file.thumbnail_url" class="w-8 h-8 rounded object-cover">
                    <div class="overflow-hidden min-w-0">
                    <div class="text-sm font-medium text-slate-800 truncate">{{file.original_name}}</div>
                    <div class="text-xs text-slate-500 truncate">{{file.filename}}</div>
                    </div>
                </a>
            </div>
        </ng-container>
      </div>
      
      <!-- Backdrop to close -->
      <div *ngIf="showResults" (click)="closeSearch()" class="fixed inset-0 z-40" style="cursor: default;"></div>
    </div>
  `
})
export class GlobalSearchInputComponent {
    readonly mode = input<'admin' | 'public'>('admin');
    readonly placeholder = input<string>('Search...');

    searchQuery = '';
    searchResults: SearchResults = { pages: [], users: [], media: [] };
    showResults = false;
    private searchSubject = new Subject<string>();

    constructor(
        private searchService: GlobalSearchService,
        private i18n: I18nService,
        private router: Router
    ) {
        this.searchSubject.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            switchMap(query => this.searchService.search(query, this.mode()))
        ).subscribe(results => {
            this.searchResults = results;
            this.showResults = true;
        });
    }

    onSearchInput(query: string) {
        this.searchSubject.next(query);
    }

    clearSearch() {
        this.searchQuery = '';
        this.showResults = false;
    }

    closeSearch() {
        setTimeout(() => {
            this.showResults = false;
        }, 100);
    }

    hasResults(): boolean {
        if (this.mode() === 'public') {
            // Public mode returns pages even if empty array? No, checking length
            return this.searchResults.pages.length >= 0; // Always show dropdown if searched? Or only if results? Let's show "No results" if searched
        }
        return this.searchResults.pages.length > 0 || this.searchResults.users.length > 0 || this.searchResults.media.length > 0;
    }

    getPublicLink(page: any): any[] {
        // No language prefix needed - language is determined by cookie/Accept-Language
        let slug = page.slug_localized || page.slug_key;
        if (slug === 'home') return ['/'];
        return ['/', slug];
    }
}
