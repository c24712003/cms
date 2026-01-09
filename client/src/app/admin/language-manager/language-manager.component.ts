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
    <div class="space-y-6">
       <div class="flex justify-between items-center">
         <h2 class="text-2xl font-bold text-slate-800">Languages</h2>
         <div class="flex gap-2">
             <input [(ngModel)]="newLang.code" placeholder="Code (e.g. fr)" class="input-field w-32" />
             <input [(ngModel)]="newLang.name" placeholder="Name (e.g. French)" class="input-field w-40" />
             <button class="btn btn-primary" (click)="add()">+ Add</button>
         </div>
       </div>

       <div class="bg-white rounded-lg shadow overflow-hidden">
         <table class="w-full text-left border-collapse">
            <thead>
                <tr class="bg-slate-50 text-slate-600 uppercase text-xs tracking-wider border-b border-gray-200">
                    <th class="p-4 font-semibold">Code</th>
                    <th class="p-4 font-semibold">Name</th>
                    <th class="p-4 font-semibold text-center">Default</th>
                    <th class="p-4 font-semibold text-center">Status</th>
                    <th class="p-4 font-semibold text-right">Actions</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
                <tr *ngFor="let lang of languages()" class="hover:bg-gray-50 transition-colors">
                    <td class="p-4 font-mono font-medium text-blue-600">{{ lang.code }}</td>
                    <td class="p-4 text-slate-700">
                        <input [(ngModel)]="lang.name" class="bg-transparent border-none focus:ring-0 p-0 w-full" />
                    </td>
                    <td class="p-4 text-center">
                        <span *ngIf="lang.is_default" class="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">DEFAULT</span>
                    </td>
                    <td class="p-4 text-center">
                        <button (click)="toggleStatus(lang)" 
                            [class]="lang.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'" 
                            class="px-2 py-1 rounded-full text-xs font-bold cursor-pointer hover:opacity-80">
                            {{ lang.enabled ? 'ACTIVE' : 'DISABLED' }}
                        </button>
                    </td>
                    <td class="p-4 text-right">
                        <button class="text-blue-600 hover:text-blue-800 mr-3 text-sm font-medium" (click)="update(lang)">Save</button>
                        <button class="text-red-500 hover:text-red-700 text-sm font-medium" (click)="delete(lang.code)" *ngIf="!lang.is_default">Delete</button>
                    </td>
                </tr>
            </tbody>
         </table>
         <div class="p-4 text-center text-slate-400 text-sm" *ngIf="languages().length === 0">
            No languages found.
         </div>
       </div>
    </div>
  `
})
export class LanguageManagerComponent implements OnInit {
  languages = signal<Language[]>([]);
  newLang = { code: '', name: '' };

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.load();
  }

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
    this.http.put(`/api/languages/${lang.code}`, lang).subscribe(() => {
      alert('Updated');
    });
  }

  toggleStatus(lang: Language) {
    lang.enabled = !lang.enabled;
    this.update(lang);
  }

  delete(code: string) {
    if (confirm('Delete language?')) {
      this.http.delete(`/api/languages/${code}`).subscribe(() => this.load());
    }
  }
}
