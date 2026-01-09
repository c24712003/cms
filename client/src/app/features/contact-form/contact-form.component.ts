import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { I18nService } from '../../core/services/i18n.service';

@Component({
    selector: 'app-contact-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <h3>{{ i18n.translate('CONTACT_TITLE') }}</h3>
      
      <div class="form-group">
        <label>{{ i18n.translate('LBL_NAME') }}</label>
        <input formControlName="name" />
        <div class="error" *ngIf="form.get('name')?.invalid && form.get('name')?.touched">
            {{ i18n.translate('ERR_REQUIRED') }}
        </div>
      </div>

      <div class="form-group">
        <label>{{ i18n.translate('LBL_EMAIL') }}</label>
        <input formControlName="email" type="email" />
        <div class="error" *ngIf="form.get('email')?.hasError('email') && form.get('email')?.touched">
             {{ i18n.translate('ERR_EMAIL') }}
        </div>
      </div>

      <div class="form-group">
        <label>{{ i18n.translate('LBL_MESSAGE') }}</label>
        <textarea formControlName="message"></textarea>
      </div>

      <button type="submit" [disabled]="form.invalid">{{ i18n.translate('BTN_SEND') }}</button>
    </form>
  `,
    styles: [`
    form { max-width: 500px; padding: 20px; border: 1px solid #ccc; border-radius: 8px; }
    .form-group { margin-bottom: 15px; }
    label { display: block; margin-bottom: 5px; font-weight: bold; }
    input, textarea { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
    .error { color: red; font-size: 0.8rem; margin-top: 4px; }
    button { background: #3498db; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; }
    button:disabled { background: #ccc; cursor: not-allowed; }
  `]
})
export class ContactFormComponent {
    form: FormGroup;

    constructor(
        private fb: FormBuilder,
        public i18n: I18nService
    ) {
        this.form = this.fb.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            message: ['', Validators.required]
        });
    }

    submit() {
        if (this.form.valid) {
            alert(this.i18n.translate('MSG_SENT'));
            this.form.reset();
        }
    }
}
