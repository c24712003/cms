import { Component, Inject, LOCALE_ID, effect } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { I18nService } from './core/services/i18n.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  template: `
    <div style="text-align:center; padding: 2rem;">
      <h1>Angular v21 CMS - SSR I18n Demo</h1>
      
      <div class="card">
        <h2>Current State</h2>
        <p><strong>URL Language (LOCALE_ID):</strong> {{ locale }}</p>
        <p><strong>Service Signal Language:</strong> {{ i18n.currentLang() }}</p>
        <p><strong>Translation Test ('NAV_HOME'):</strong> {{ i18n.translate('NAV_HOME') }}</p>
      </div>

      <div class="actions">
        <h3>Switch Language (Hydration Test)</h3>
        <button (click)="switchLang('en')">English (/en)</button>
        <button (click)="switchLang('zh-tw')">繁體中文 (/zh-tw)</button>
        <button (click)="switchLang('jp')">Business (/jp)</button>
      </div>
    </div>
  `,
  styles: [`
    .card { background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px auto; max-width: 400px; }
    button { padding: 10px 20px; margin: 0 10px; cursor: pointer; }
    h1 { color: #333; }
  `]
})
export class App {
  constructor(
    public i18n: I18nService,
    @Inject(LOCALE_ID) public locale: string
  ) {
    // Effect to log changes
    effect(() => {
      console.log('Current Lang Signal:', this.i18n.currentLang());
    });
  }

  switchLang(lang: string) {
    this.i18n.switchLanguage(lang);
  }
}
