import { Component, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Language } from '../../core/models/language.model';

interface TranslationKey {
    key: string;
    namespace?: string;
}

@Component({
    selector: 'app-translation-editor',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="page-header">
      <h1>Translations</h1>
      <div class="controls">
          <input [(ngModel)]="newKey" placeholder="Add new key name" />
          <button class="btn-primary" (click)="addKey()">+ Add Key</button>
      </div>
    </div>

    <!-- Edit Grid: Key | EN | ZHTW | ... -->
    <div class="table-container">
        <table class="data-table">
            <thead>
                <tr>
                    <th>Key</th>
                    <th *ngFor="let lang of languages()">{{ lang.code }}</th>
                </tr>
            </thead>
            <tbody>
                <tr *ngFor="let k of keys()">
                    <td class="key-col">{{ k.key }}</td>
                    <td *ngFor="let lang of languages()">
                        <input 
                            [ngModel]="getValue(k.key, lang.code)" 
                            (change)="updateValue(k.key, lang.code, $event)"
                            class="trans-input"
                        />
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
  `,
    styles: [`
    .page-header { display: flex; justify-content: space-between; margin-bottom: 2rem; }
    .table-container { overflow-x: auto; background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .data-table { width: 100%; border-collapse: collapse; }
    .data-table th, .data-table td { padding: 10px; border: 1px solid #eee; text-align: left; }
    .data-table th { background: #f8f9fa; position: sticky; top: 0; }
    .key-col { font-weight: bold; color: #555; background: #fafafa; }
    .trans-input { width: 100%; border: 1px solid transparent; padding: 4px; border-radius: 4px; }
    .trans-input:focus { border-color: #3498db; outline: none; background: #f0f8ff; }
    .trans-input:hover { border-color: #ddd; }
  `]
})
export class TranslationEditorComponent {
    languages = signal<Language[]>([]);
    keys = signal<TranslationKey[]>([]);
    // Map<Key, Map<Lang, Value>>
    values = signal<Record<string, Record<string, string>>>({});
    newKey = '';

    constructor(private http: HttpClient) {
        this.loadData();
    }

    loadData() {
        // 1. Get Languages
        this.http.get<Language[]>('http://localhost:3000/api/languages').subscribe(langs => {
            this.languages.set(langs);

            // 2. Get Keys
            this.http.get<TranslationKey[]>('http://localhost:3000/api/translations/keys').subscribe(keys => {
                this.keys.set(keys);
            });

            // 3. Get Values for each lang (Optimization: could be one big API call)
            langs.forEach(l => {
                this.http.get<Record<string, string>>(`http://localhost:3000/api/translations/${l.code}`).subscribe(map => {
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
        this.http.put('http://localhost:3000/api/translations', { key, lang, value: val }).subscribe();

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
        this.http.post('http://localhost:3000/api/translations/keys', { key: this.newKey }).subscribe(() => {
            this.keys.update(k => [...k, { key: this.newKey }]);
            this.newKey = '';
        });
    }
}
