import { Component, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Language } from '../../core/models/language.model';

@Component({
  selector: 'app-language-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <!-- Page Header -->
      <div class="admin-page-header">
        <h1 class="admin-page-title">Languages</h1>
        <div class="flex items-center gap-3">
          <input [(ngModel)]="newLang.code" placeholder="Code (e.g. fr)" class="input-field w-28" />
          <input [(ngModel)]="newLang.name" placeholder="Name (e.g. French)" class="input-field w-40" />
          <button class="btn btn-primary" (click)="add()">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            Add Language
          </button>
        </div>
      </div>

      <!-- Data Table Card -->
      <div class="card">
        <table class="data-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th class="text-center">Default</th>
              <th class="text-center">Status</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let lang of languages()">
              <td>
                <span class="font-mono text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">{{ lang.code }}</span>
              </td>
              <td>
                <input [(ngModel)]="lang.name" class="bg-transparent border-none focus:ring-0 p-0 text-slate-800 font-medium" />
              </td>
              <td class="text-center">
                <span *ngIf="lang.is_default" class="badge badge-info">Default</span>
              </td>
              <td class="text-center">
                <button (click)="toggleStatus(lang)" 
                    [class]="lang.enabled ? 'badge badge-success cursor-pointer' : 'badge badge-default cursor-pointer'">
                    {{ lang.enabled ? 'Active' : 'Disabled' }}
                </button>
              </td>
              <td class="text-right">
                <button class="btn btn-ghost btn-sm text-blue-600" (click)="update(lang)">Save</button>
                <button class="btn btn-ghost btn-sm text-red-600" (click)="delete(lang.code)" *ngIf="!lang.is_default">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div class="p-8 text-center text-slate-400" *ngIf="languages().length === 0">
          No languages configured. Add your first language above.
        </div>
      </div>
    </div>
  `
})
export class LanguageManagerComponent implements OnInit {
  languages = signal<Language[]>([]);
  newLang = { code: '', name: '' };

  constructor(private http: HttpClient) { }

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
    this.http.put(`/api/languages/${lang.code}`, lang).subscribe(() => alert('Saved!'));
  }

  toggleStatus(lang: Language) {
    lang.enabled = !lang.enabled;
    this.update(lang);
  }

  delete(code: string) {
    if (confirm('Delete this language?')) {
      this.http.delete(`/api/languages/${code}`).subscribe(() => this.load());
    }
  }
}
