import { Component, Inject, LOCALE_ID, effect } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { I18nService } from './core/services/i18n.service';
import { CommonModule } from '@angular/common';

import { SiteHeaderComponent } from './layout/site-header/site-header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, SiteHeaderComponent],
  template: `
    <app-site-header></app-site-header>
    <main class="content">
      <h1>Angular v21 CMS - SSR I18n Demo</h1>
      
      <div class="card">
        <h2>Current State</h2>
        <p><strong>URL Language (LOCALE_ID):</strong> {{ locale }}</p>
        <p><strong>Service Signal Language:</strong> {{ i18n.currentLang() }}</p>
        <p><strong>Translation Test ('NAV_HOME'):</strong> {{ i18n.translate('NAV_HOME') }}</p>
      </div>
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .content { padding: 20px; }
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
