import { Pipe, PipeTransform } from '@angular/core';
import { I18nService } from '../services/i18n.service';

@Pipe({
    name: 'translate',
    standalone: true,
    pure: false // Impure to react to signal changes (language switch)
})
export class TranslatePipe implements PipeTransform {
    constructor(private i18n: I18nService) { }

    transform(key: string): string {
        return this.i18n.translate(key);
    }
}
