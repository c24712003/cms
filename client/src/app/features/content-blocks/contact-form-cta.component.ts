import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContentBlockManifest } from './block.types';

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select';
  required?: boolean;
  options?: string[];
}

@Component({
  selector: 'app-contact-form-cta',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <div class="max-w-6xl mx-auto px-6">
        <div class="grid md:grid-cols-2 gap-12 items-center">
          <!-- Left: Info -->
          <div class="text-white">
            <h2 class="text-3xl md:text-4xl font-bold mb-6">{{ title }}</h2>
            <p class="text-lg text-slate-300 mb-8 leading-relaxed">{{ description }}</p>
            
            <!-- Contact Info Cards -->
            <div class="space-y-4" *ngIf="safeContactInfo.length > 0">
              <div *ngFor="let info of safeContactInfo" class="flex items-center gap-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                <span class="text-2xl" [ngSwitch]="info.icon">
                  <ng-container *ngSwitchCase="'email'">📧</ng-container>
                  <ng-container *ngSwitchCase="'phone'">📞</ng-container>
                  <ng-container *ngSwitchCase="'location'">📍</ng-container>
                  <ng-container *ngSwitchCase="'clock'">🕐</ng-container>
                  <ng-container *ngSwitchDefault>ℹ️</ng-container>
                </span>
                <div>
                  <div class="font-semibold">{{ info.label }}</div>
                  <div class="text-slate-300 text-sm">{{ info.value }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right: Form -->
          <div class="bg-white rounded-2xl p-8 shadow-2xl">
            <form (ngSubmit)="handleSubmit()" #contactForm="ngForm">
              <div class="space-y-5">
                <ng-container *ngFor="let field of safeFields; let i = index">
                  <!-- Text/Email/Tel Input -->
                  <div *ngIf="field.type !== 'textarea' && field.type !== 'select'">
                    <label class="block text-sm font-semibold text-slate-700 mb-2">
                      {{ field.label }}
                      <span *ngIf="field.required" class="text-red-500">*</span>
                    </label>
                    <input [type]="field.type" 
                           [name]="field.name || ('field_' + i)"
                           [(ngModel)]="formData[field.name || ('field_' + i)]"
                           [required]="!!field.required"
                           class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                           [placeholder]="'請輸入' + field.label" />
                  </div>

                  <!-- Textarea -->
                  <div *ngIf="field.type === 'textarea'">
                    <label class="block text-sm font-semibold text-slate-700 mb-2">
                      {{ field.label }}
                      <span *ngIf="field.required" class="text-red-500">*</span>
                    </label>
                    <textarea [name]="field.name || ('field_' + i)"
                              [(ngModel)]="formData[field.name || ('field_' + i)]"
                              [required]="!!field.required"
                              rows="4"
                              class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none"
                              [placeholder]="'請輸入' + field.label"></textarea>
                  </div>

                  <!-- Select -->
                  <div *ngIf="field.type === 'select'">
                    <label class="block text-sm font-semibold text-slate-700 mb-2">
                      {{ field.label }}
                      <span *ngIf="field.required" class="text-red-500">*</span>
                    </label>
                    <select [name]="field.name || ('field_' + i)"
                            [(ngModel)]="formData[field.name || ('field_' + i)]"
                            [required]="!!field.required"
                            class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-white">
                      <option value="">請選擇...</option>
                      <option *ngFor="let opt of field.options" [value]="opt">{{ opt }}</option>
                    </select>
                  </div>
                </ng-container>
              </div>

              <button type="submit" 
                      class="w-full mt-6 px-6 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
                {{ submitButton || '送出' }}
                <svg class="w-5 h-5 inline-block ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                </svg>
              </button>

              <p *ngIf="privacy" class="mt-4 text-xs text-slate-500 text-center">{{ privacy }}</p>
            </form>

            <!-- Success Message -->
            <div *ngIf="submitted" class="text-center py-8">
              <div class="text-5xl mb-4">✅</div>
              <h3 class="text-xl font-bold text-slate-900 mb-2">感謝您的訊息！</h3>
              <p class="text-slate-600">我們將盡快與您聯繫。</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class ContactFormCtaComponent {
  static manifest: ContentBlockManifest = {
    type: 'contact-form-cta',
    displayName: 'Contact Form',
    category: 'Call to Action',
    schema: {
      properties: {
        title: { type: 'string', title: 'Title' },
        description: { type: 'string', title: 'Description', ui: { widget: 'textarea' } },
        submitButton: { type: 'string', title: 'Button Text' },
        privacy: { type: 'string', title: 'Privacy Text' },
        fields: {
          type: 'array',
          title: 'Form Fields',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string', title: 'Field Name (e.g. email)' },
              label: { type: 'string', title: 'Label' },
              type: {
                type: 'string',
                title: 'Type',
                enum: ['text', 'email', 'tel', 'textarea', 'select'],
                ui: { widget: 'select' }
              },
              required: { type: 'boolean', title: 'Required', ui: { widget: 'toggle' } },
              options: { type: 'array', title: 'Options (Select only)', items: { type: 'string', title: 'Option' } }
            }
          }
        },
        contactInfo: {
          type: 'array',
          title: 'Contact Info',
          items: {
            type: 'object',
            properties: {
              icon: {
                type: 'string',
                title: 'Icon',
                enum: ['email', 'phone', 'location', 'clock', 'other'],
                ui: { widget: 'select' }
              },
              label: { type: 'string', title: 'Label' },
              value: { type: 'string', title: 'Value' }
            }
          }
        }
      },
      required: ['title']
    }
  };

  @Input() title: string = '';
  @Input() description: string = '';
  @Input() fields: FormField[] = [
    { name: 'name', label: '姓名', type: 'text', required: true },
    { name: 'email', label: '電子郵件', type: 'email', required: true },
    { name: 'message', label: '訊息內容', type: 'textarea', required: true }
  ];
  @Input() submitButton: string = '送出諮詢';
  @Input() privacy: string = '';
  @Input() contactInfo: { icon: string; label: string; value: string }[] = [];

  formData: { [key: string]: string } = {};
  submitted = false;

  get safeFields(): FormField[] {
    return Array.isArray(this.fields) ? this.fields : [];
  }

  get safeContactInfo(): any[] {
    return Array.isArray(this.contactInfo) ? this.contactInfo : [];
  }

  handleSubmit() {
    console.log('Form submitted:', this.formData);
    this.submitted = true;
    // In a real app, you would send this to an API
  }
}
