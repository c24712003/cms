import { Component, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Language } from '../../core/models/language.model';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { I18nService } from '../../core/services/i18n.service';

interface TranslationKey {
    key: string;
    namespace?: string;
}

@Component({
    selector: 'app-translation-editor',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslatePipe],
    template: `
    <div class="max-w-7xl mx-auto">
      <!-- Page Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 class="text-2xl font-bold text-slate-800 dark:text-white">{{ 'TRANSLATIONS_TITLE' | translate }}</h1>
        
        <!-- Add Key Control -->
        <div class="flex items-center gap-2 w-full md:w-auto bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm md:border-none md:shadow-none md:bg-transparent">
            <input [(ngModel)]="newKey" placeholder="new.key.name" 
                   class="input-field flex-grow text-sm md:w-64" />
            <button class="btn btn-primary whitespace-nowrap" (click)="addKey()">
                 <svg class="w-4 h-4 mr-1 md:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                 <span class="hidden md:inline">+ {{ 'BTN_ADD_KEY' | translate }}</span>
                 <span class="md:hidden">{{ 'BTN_ADD' | translate }}</span>
            </button>
            <button class="btn btn-secondary whitespace-nowrap ml-2" (click)="refresh()" [disabled]="isValidating()">
                 <svg class="w-4 h-4 mr-1" [class.animate-spin]="isValidating()" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                 <span>{{ isValidating() ? 'Updating...' : 'Update' }}</span>
            </button>
        </div>
      </div>

      <!-- Desktop Matrix Table -->
      <div class="hidden md:block bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden overflow-x-auto">
          <table class="w-full text-left text-sm">
              <thead class="bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 uppercase text-xs font-semibold">
                  <tr>
                      <th class="px-6 py-4 w-1/4 sticky left-0 bg-slate-50 dark:bg-slate-700 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">{{ 'TBL_KEY' | translate }}</th>
                      <th *ngFor="let lang of languages()" class="px-6 py-4 min-w-[200px]">{{ lang.name }} ({{ lang.code }})</th>
                  </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
                  <tr *ngFor="let k of keys()" class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                      <td class="px-6 py-4 font-mono text-xs font-bold text-slate-600 dark:text-slate-300 sticky left-0 bg-white dark:bg-slate-800 group-hover:bg-slate-50 dark:group-hover:bg-slate-700 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                          {{ k.key }}
                      </td>
                      <td *ngFor="let lang of languages()" class="px-6 py-4">
                          <input 
                              [ngModel]="getValue(k.key, lang.code)" 
                              (change)="updateValue(k.key, lang.code, $event)"
                              class="w-full bg-transparent border border-transparent hover:border-slate-200 dark:hover:border-slate-600 focus:border-blue-500 rounded px-2 py-1 transition-colors focus:ring-1 focus:ring-blue-200 focus:bg-white dark:focus:bg-slate-700 text-slate-900 dark:text-white"
                              placeholder="..."
                          />
                      </td>
                  </tr>
              </tbody>
          </table>
      </div>

      <!-- Mobile Card View -->
      <div class="md:hidden space-y-4">
        <div *ngFor="let k of keys()" class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4">
            <div class="mb-3 font-mono text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 inline-block px-2 py-1 rounded">
                {{ k.key }}
            </div>
            
            <div class="space-y-3">
                <div *ngFor="let lang of languages()" class="flex flex-col gap-1">
                    <label class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{{ lang.code }}</label>
                    <input 
                        [ngModel]="getValue(k.key, lang.code)" 
                        (change)="updateValue(k.key, lang.code, $event)"
                        class="input-field text-sm w-full"
                        [placeholder]="'Translation for ' + lang.code"
                    />
                </div>
            </div>
        </div>
      </div>
      
      <div class="p-8 text-center text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 border-dashed mt-4" *ngIf="keys().length === 0">
          {{ 'MSG_NO_KEYS' | translate }}
      </div>
    </div>
  `
})
export class TranslationEditorComponent {
    languages = signal<Language[]>([]);
    keys = signal<TranslationKey[]>([]);
    // Map<Key, Map<Lang, Value>>
    values = signal<Record<string, Record<string, string>>>({});
    newKey = '';
    isValidating = signal<boolean>(false);

    constructor(private http: HttpClient, private i18n: I18nService) {
        this.loadData();
    }

    loadData() {
        // 1. Get Languages
        this.http.get<Language[]>('/api/languages').subscribe(langs => {
            this.languages.set(langs);

            // 2. Get Keys
            this.http.get<TranslationKey[]>('/api/translations/keys').subscribe(keys => {
                this.keys.set(keys);
            });

            // 3. Get Values for each lang (Optimization: could be one big API call)
            langs.forEach(l => {
                this.http.get<Record<string, string>>(`/api/translations/${l.code}`).subscribe(map => {
                    this.values.update(current => {
                        const next = { ...current };
                        // Merge logic
                        Object.keys(map).forEach(k => {
                            if (!next[k]) next[k] = {};
                            next[k][l.code] = map[k];
                        });
                        return next;
                    });
                });
            });
        });
    }

    getValue(key: string, lang: string): string {
        return this.values()[key]?.[lang] || '';
    }

    updateValue(key: string, lang: string, event: Event) {
        const val = (event.target as HTMLInputElement).value;
        this.http.put('/api/translations', { key, lang, value: val }).subscribe();

        // Optimistic update
        this.values.update(current => {
            const next = { ...current };
            if (!next[key]) next[key] = {};
            next[key][lang] = val;
            return next;
        });
    }

    addKey() {
        if (!this.newKey) return;
        this.http.post('/api/translations/keys', { key: this.newKey }).subscribe(() => {
            this.keys.update(k => [...k, { key: this.newKey }]);
            this.newKey = '';
        });
    }

    refresh() {
        this.isValidating.set(true);
        this.loadData();
        this.i18n.refresh();

        // Fake delay to show spinner/feedback since loadData is async but we don't track its subscription here easily without refactoring
        // Improvements: make loadData return Observable
        setTimeout(() => {
            this.isValidating.set(false);
        }, 1000);
    }
}
