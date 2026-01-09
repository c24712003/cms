import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Language } from '../../core/models/language.model';

@Component({
    selector: 'app-language-manager',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="page-header">
      <h1>Language Management</h1>
      <button class="btn-primary" (click)="isAdding.set(true)">+ Add Language</button>
    </div>

    <!-- Add Form -->
    <div *ngIf="isAdding()" class="card form-card">
        <h3>New Language</h3>
        <input [(ngModel)]="newLang.code" placeholder="Code (e.g., fr)" />
        <input [(ngModel)]="newLang.name" placeholder="Name (e.g., Français)" />
        <select [(ngModel)]="newLang.direction">
            <option value="ltr">LTR</option>
            <option value="rtl">RTL</option>
        </select>
        <div class="actions">
            <button (click)="isAdding.set(false)">Cancel</button>
            <button class="btn-primary" (click)="addLanguage()">Save</button>
        </div>
    </div>

    <!-- List -->
    <table class="data-table">
      <thead>
        <tr>
          <th>Code</th>
          <th>Name</th>
          <th>Direction</th>
          <th>Default</th>
          <th>Enabled</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let lang of languages()">
          <td>{{ lang.code }}</td>
          <td>{{ lang.name }}</td>
          <td>{{ lang.direction.toUpperCase() }}</td>
          <td><span *ngIf="lang.is_default" class="badge">Default</span></td>
          <td>
            <label class="switch">
              <input type="checkbox" [checked]="lang.enabled" (change)="toggleEnabled(lang)">
              <span class="slider"></span>
            </label>
          </td>
          <td>
            <button *ngIf="!lang.is_default" (click)="deleteLang(lang)">Delete</button>
            <button *ngIf="!lang.is_default" (click)="setAsDefault(lang)">Set Default</button>
          </td>
        </tr>
      </tbody>
    </table>
  `,
    styles: [`
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .data-table { width: 100%; border-collapse: collapse; background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .data-table th, .data-table td { padding: 12px 15px; text-align: left; border-bottom: 1px solid #ddd; }
    .data-table th { background: #f8f9fa; font-weight: 600; color: #555; }
    
    .card { background: white; padding: 20px; border: 1px solid #ddd; margin-bottom: 20px; }
    input, select { padding: 8px; margin-right: 10px; border: 1px solid #ccc; border-radius: 4px; }
    
    .btn-primary { background: #3498db; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; }
    button { cursor: pointer; }

    .badge { background: #2ecc71; color: white; padding: 4px 8px; border-radius: 12px; font-size: 0.8rem; }
  `]
})
export class LanguageManagerComponent {
    languages = signal<Language[]>([]);
    isAdding = signal(false);
    newLang: Partial<Language> = { direction: 'ltr' };

    constructor(private http: HttpClient) {
        this.fetchLanguages();
    }

    fetchLanguages() {
        this.http.get<Language[]>('http://localhost:3000/api/languages').subscribe(data => {
            this.languages.set(data);
        });
    }

    addLanguage() {
        this.http.post('http://localhost:3000/api/languages', this.newLang).subscribe(() => {
            this.newLang = { direction: 'ltr' };
            this.isAdding.set(false);
            this.fetchLanguages();
        });
    }

    toggleEnabled(lang: any) { // Using any for simplicity in rapid prototype, ideally proper type
        this.http.put(`http://localhost:3000/api/languages/${lang.code}`, { enabled: !lang.enabled }).subscribe(() => {
            this.fetchLanguages();
        });
    }

    setAsDefault(lang: any) {
        this.http.put(`http://localhost:3000/api/languages/${lang.code}`, { is_default: true, enabled: true }).subscribe(() => {
            this.fetchLanguages();
        });
    }

    deleteLang(lang: any) {
        if (confirm(`Delete ${lang.name}?`)) {
            this.http.delete(`http://localhost:3000/api/languages/${lang.code}`).subscribe(() => {
                this.fetchLanguages();
            });
        }
    }
}
