import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';


interface Theme {
    id: number;
    name: string;
    template_id: string;
    is_active: number; // 0 or 1
    created_at: string;
    page_count: number;
    pages: { slug: string, title: string }[];
}

@Component({
    selector: 'app-theme-manager',
    standalone: true,
    imports: [CommonModule, DatePipe],
    template: `
    <div class="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 class="text-3xl font-bold font-display text-slate-900 dark:text-white mb-2">Theme Management</h1>
           <p class="text-slate-500 dark:text-slate-400">Manage your site's installed themes and switch between them.</p>
        </div>
      </div>

      <!-- Themes Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (theme of themes(); track theme.id) {
          <div class="group relative bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border transition-all duration-300"
               [ngClass]="theme.is_active ? 'border-blue-500 shadow-lg shadow-blue-500/10 ring-2 ring-blue-500/20' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'">
            
            <!-- Active Badge -->
            @if (theme.is_active) {
                <div class="absolute top-4 right-4 z-10 bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                    Active
                </div>
            }

            <div class="p-6">
                <!-- Icon/Avatar -->
                <div class="w-12 h-12 rounded-xl mb-4 flex items-center justify-center text-xl font-bold"
                     [ngClass]="theme.is_active ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'">
                    {{ theme.name.charAt(0).toUpperCase() }}
                </div>

                <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-1">{{ theme.name }}</h3>
                <p class="text-sm text-slate-500 dark:text-slate-400 mb-4">Template: {{ theme.template_id }}</p>

                <div class="flex items-center gap-4 text-xs font-medium text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-700 pt-4 mb-4">
                    <span class="flex items-center gap-1">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                        {{ theme.page_count }} Pages
                    </span>
                    <span class="flex items-center gap-1">
                         <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        {{ theme.created_at | date:'mediumDate' }}
                    </span>
                </div>

                <!-- Page List Preview -->
                <div class="flex flex-wrap gap-2 mb-6">
                    @for (page of theme.pages; track page.slug) {
                        <span class="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300">
                            /{{ page.slug }}
                        </span>
                    }
                </div>

                <!-- Actions -->
                <div class="flex gap-3">
                    @if (!theme.is_active) {
                        <button (click)="activateTheme(theme)" 
                            [disabled]="isLoading()"
                            class="flex-1 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50">
                            {{ isLoading() ? 'Activating...' : 'Activate' }}
                        </button>
                         <button (click)="deleteTheme(theme)"
                            [disabled]="isLoading()" 
                            class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50">
                             <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                         </button>
                    } @else {
                        <button disabled class="flex-1 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold text-sm cursor-default border border-blue-100 dark:border-blue-800">
                            Currently Active
                        </button>
                    }
                </div>
            </div>
          </div>
        } @empty {
             <div class="col-span-full py-20 text-center bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
                <p class="text-slate-500 dark:text-slate-400 mb-4">No themes installed yet.</p>
                <div class="text-sm text-slate-400">Create a new theme from the Dashboard to get started.</div>
            </div>
        }
      </div>
    </div>
  `,
    styles: [`
    .animate-fade-in { animation: fadeIn 0.4s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class ThemeManagerComponent implements OnInit {
    themes = signal<Theme[]>([]);
    isLoading = signal(false);

    constructor(private http: HttpClient) { }

    ngOnInit() {
        this.loadThemes();
    }

    loadThemes() {
        this.http.get<Theme[]>('/api/themes').subscribe({
            next: (data) => this.themes.set(data),
            error: (err) => console.error('Failed to load themes', err)
        });
    }

    activateTheme(theme: Theme) {
        if (!confirm(`Switch to "${theme.name}"? This will hide all pages from the current theme.`)) return;

        this.isLoading.set(true);
        this.http.patch(`/api/themes/${theme.id}/activate`, {}).subscribe({
            next: () => {
                this.isLoading.set(false);
                this.loadThemes(); // Refresh list to update active state
            },
            error: (err) => {
                this.isLoading.set(false);
                alert('Failed to activate theme: ' + err.error?.error);
            }
        });
    }

    deleteTheme(theme: Theme) {
        if (!confirm(`Are you sure you want to delete "${theme.name}"? This will PERMANENTLY DELETE all ${theme.page_count} pages in this theme.`)) return;

        this.isLoading.set(true);
        this.http.delete(`/api/themes/${theme.id}`).subscribe({
            next: () => {
                this.isLoading.set(false);
                this.loadThemes();
            },
            error: (err) => {
                this.isLoading.set(false);
                alert('Failed to delete theme: ' + err.error?.error);
            }
        });
    }
}
