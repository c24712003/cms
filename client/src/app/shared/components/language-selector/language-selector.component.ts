import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../../../core/services/i18n.service';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';

@Component({
    selector: 'app-language-selector',
    standalone: true,
    imports: [CommonModule, TranslatePipe],
    template: `
    <div class="flex items-center gap-2 p-4 bg-gray-800 text-white rounded-lg">
      <span class="font-bold">{{ 'CMS_TITLE' | translate }}</span>
      <div class="flex gap-2 ml-auto">
        <button 
          (click)="switchLang('en-US')"
          [class.text-blue-400]="isCurrent('en-US')"
          class="px-2 py-1 text-sm hover:text-blue-300 transition-colors">
          EN
        </button>
        <span class="text-gray-500">|</span>
        <button 
          (click)="switchLang('zh-TW')"
          [class.text-blue-400]="isCurrent('zh-TW')"
          class="px-2 py-1 text-sm hover:text-blue-300 transition-colors">
          中文
        </button>
      </div>
    </div>
  `
})
export class LanguageSelectorComponent {
    constructor(public i18n: I18nService) { }

    switchLang(lang: string) {
        this.i18n.switchLanguage(lang);
    }

    isCurrent(lang: string): boolean {
        return this.i18n.currentLang() === lang;
    }
}
