import { Component, Inject, LOCALE_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { I18nService } from './core/services/i18n.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  template: `
    <router-outlet></router-outlet>
  `

})
export class App {
  constructor(public i18n: I18nService, @Inject(LOCALE_ID) public locale: string) { }
}
