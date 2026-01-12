import { Component, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Language } from '../../core/models/language.model';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { I18nService } from '../../core/services/i18n.service';

@Component({
  selector: 'app-language-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  template: `
    <div class="max-w-7xl mx-auto">
      <!-- Page Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 class="text-2xl font-bold text-slate-800 dark:text-white">{{ 'LANGUAGES_TITLE' | translate }}</h1>
        
        <!-- Add New Form -->
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm md:bg-transparent md:border-none md:p-0 md:shadow-none">
          <input [(ngModel)]="newLang.code" [placeholder]="('TBL_CODE' | translate) + ' (fr)'" class="input-field w-full sm:w-28 text-sm" />
          <input [(ngModel)]="newLang.name" [placeholder]="('TBL_NAME' | translate) + ' (French)'" class="input-field w-full sm:w-40 text-sm" />
          <button class="btn btn-primary w-full sm:w-auto flex justify-center items-center" (click)="add()">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            {{ 'BTN_ADD' | translate }}
          </button>
        </div>
      </div>

      <!-- Desktop Table View -->
      <div class="hidden md:block bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <table class="w-full text-left text-sm">
          <thead class="bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 uppercase text-xs font-semibold">
            <tr>
              <th class="px-6 py-4">{{ 'TBL_CODE' | translate }}</th>
              <th class="px-6 py-4">{{ 'TBL_NAME' | translate }}</th>
              <th class="px-6 py-4 text-center">{{ 'TBL_DEFAULT' | translate }}</th>
              <th class="px-6 py-4 text-center">{{ 'TBL_STATUS' | translate }}</th>
              <th class="px-6 py-4 text-right">{{ 'TBL_ACTIONS' | translate }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
            <tr *ngFor="let lang of languages()" class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
              <td class="px-6 py-4">
                <span class="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded inline-block min-w-[3ch] text-center">{{ lang.code }}</span>
              </td>
              <td class="px-6 py-4">
                <input [(ngModel)]="lang.name" class="bg-transparent border-none focus:ring-0 p-0 text-slate-800 dark:text-white font-medium w-full" />
              </td>
              <td class="px-6 py-4 text-center">
                <span *ngIf="lang.is_default" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400">
                  {{ 'STATUS_DEFAULT' | translate }}
                </span>
                <span *ngIf="!lang.is_default" class="text-slate-300 dark:text-slate-600">-</span>
              </td>
              <td class="px-6 py-4 text-center">
                 <button (click)="toggleStatus(lang)" 
                    class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                    [class.bg-green-500]="lang.enabled"
                    [class.bg-slate-200]="!lang.enabled"
                    [class.dark:bg-slate-600]="!lang.enabled">
                    <span class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                          [class.translate-x-5]="lang.enabled"
                          [class.translate-x-0]="!lang.enabled"></span>
                  </button>
              </td>
              <td class="px-6 py-4 text-right space-x-2">
                <button class="text-blue-600 hover:text-blue-800 font-medium text-xs transition-colors" (click)="update(lang)">{{ 'BTN_SAVE' | translate }}</button>
                <button class="text-red-400 hover:text-red-600 font-medium text-xs transition-colors" (click)="delete(lang.code)" *ngIf="!lang.is_default">{{ 'BTN_DELETE' | translate }}</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile Card View -->
      <div class="md:hidden space-y-4">
        <div *ngFor="let lang of languages()" class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4">
            <div class="flex justify-between items-start mb-3">
                <div class="flex items-center gap-2">
                    <span class="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded uppercase">{{ lang.code }}</span>
                    <input [(ngModel)]="lang.name" class="font-bold text-slate-800 dark:text-white bg-transparent border-b border-transparent focus:border-blue-500 focus:ring-0 px-0 py-0 w-32" />
                </div>
                <div class="flex flex-col items-end gap-1">
                   <span *ngIf="lang.is_default" class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 uppercase tracking-wide">
                      {{ 'STATUS_DEFAULT' | translate }}
                    </span>
                </div>
            </div>

            <div class="flex items-center justify-between pt-3 border-t border-slate-50 dark:border-slate-700">
                <div class="flex items-center gap-2">
                    <span class="text-xs text-slate-500 dark:text-slate-400 font-medium">{{ (lang.enabled ? 'STATUS_ENABLED' : 'STATUS_DISABLED') | translate }}</span>
                    <button (click)="toggleStatus(lang)" 
                        class="relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                        [class.bg-green-500]="lang.enabled"
                        [class.bg-slate-200]="!lang.enabled"
                        [class.dark:bg-slate-600]="!lang.enabled">
                        <span class="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                              [class.translate-x-4]="lang.enabled"
                              [class.translate-x-0]="!lang.enabled"></span>
                    </button>
                </div>
                <div class="flex items-center gap-3">
                    <button class="text-xs font-bold text-slate-400 hover:text-red-500 uppercase tracking-wider" (click)="delete(lang.code)" *ngIf="!lang.is_default">{{ 'BTN_DELETE' | translate }}</button>
                    <button class="btn btn-xs btn-outline btn-primary" (click)="update(lang)">{{ 'BTN_SAVE' | translate }}</button>
                </div>
            </div>
        </div>
      </div>
        
      <div class="p-8 text-center text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 border-dashed mt-4" *ngIf="languages().length === 0">
          {{ 'MSG_NO_LANGS' | translate }}
      </div>
    </div>
  `
})
export class LanguageManagerComponent implements OnInit {
  languages = signal<Language[]>([]);
  newLang = { code: '', name: '' };

  constructor(private http: HttpClient, private i18n: I18nService) { }

  ngOnInit() { this.load(); }

  load() {
    this.http.get<Language[]>('/api/languages').subscribe(data => this.languages.set(data));
  }

  add() {
    if (!this.newLang.code || !this.newLang.name) return;
    this.http.post('/api/languages', this.newLang).subscribe(() => {
      this.newLang = { code: '', name: '' };
      this.load();
    });
  }

  update(lang: Language) {
    this.http.put(`/api/languages/${lang.code}`, lang).subscribe(() => alert(this.i18n.translate('MSG_SAVED_SUCCESS')));
  }

  toggleStatus(lang: Language) {
    lang.enabled = !lang.enabled;
    this.update(lang);
  }

  delete(code: string) {
    if (confirm(this.i18n.translate('MSG_CONFIRM_DELETE_LANG'))) {
      this.http.delete(`/api/languages/${code}`).subscribe(() => this.load());
    }
  }
}
