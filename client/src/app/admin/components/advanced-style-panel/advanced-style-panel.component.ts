import {
    Component,
    input,
    output,
    signal,
    computed,
    effect,
    inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';
import { StyleValidatorService } from '../../../features/content-blocks/style-validator.service';
import { AdvancedStyleOutput, CssValidationResult } from '../../../features/content-blocks/block.types';

/**
 * Advanced Style Panel Component
 * Provides free-form CSS customization with real-time validation and security checks.
 * Uses Angular Signals for fine-grained reactivity.
 */
@Component({
    selector: 'app-advanced-style-panel',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslatePipe],
    template: `
    <div class="h-full flex flex-col bg-slate-50 dark:bg-slate-900">
      <div class="flex-1 overflow-y-auto p-4 space-y-6">

        <!-- CSS Classes Section -->
        <section class="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          <h4 class="font-bold text-slate-700 dark:text-white text-sm mb-3 flex items-center gap-2">
            <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
            </svg>
            {{ 'ADVANCED_CSS_CLASSES' | translate }}
          </h4>
          
          <div class="form-control">
            <input 
              type="text"
              [ngModel]="localClasses()"
              (ngModelChange)="onClassesChange($event)"
              placeholder="class-1 class-2 animate-fade"
              class="input input-bordered w-full font-mono text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
              [class.input-error]="!classValidation().isValid" />
            <p class="text-xs text-slate-400 dark:text-slate-500 mt-2">
              {{ 'ADVANCED_CSS_CLASSES_HINT' | translate }}
            </p>
          </div>

          <!-- Classes Validation Errors -->
          @if (classValidation().errors.length > 0) {
            <div class="mt-3 space-y-1">
              @for (error of classValidation().errors; track error.message) {
                <div class="flex items-center gap-2 text-xs" 
                     [class.text-red-500]="error.severity === 'error'"
                     [class.text-amber-500]="error.severity === 'warning'">
                  <svg class="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    @if (error.severity === 'error') {
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                    } @else {
                      <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                    }
                  </svg>
                  <span>{{ error.message | translate }}</span>
                </div>
              }
            </div>
          }
        </section>

        <!-- Inline Styles Section -->
        <section class="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          <h4 class="font-bold text-slate-700 dark:text-white text-sm mb-3 flex items-center gap-2">
            <svg class="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"/>
            </svg>
            {{ 'ADVANCED_INLINE_STYLES' | translate }}
          </h4>
          
          <div class="form-control">
            <textarea 
              [ngModel]="localInlineStyles()"
              (ngModelChange)="onInlineStylesChange($event)"
              placeholder="background: linear-gradient(135deg, #667eea, #764ba2);
border-radius: 16px;
box-shadow: 0 10px 40px rgba(0,0,0,0.2);"
              rows="4"
              class="textarea textarea-bordered w-full font-mono text-sm leading-relaxed dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 resize-y"
              [class.textarea-error]="!inlineValidation().isValid">
            </textarea>
            <p class="text-xs text-slate-400 dark:text-slate-500 mt-2">
              {{ 'ADVANCED_INLINE_STYLES_HINT' | translate }}
            </p>
          </div>

          <!-- Inline Styles Validation Errors -->
          @if (inlineValidation().errors.length > 0) {
            <div class="mt-3 space-y-1">
              @for (error of inlineValidation().errors; track error.message) {
                <div class="flex items-center gap-2 text-xs" 
                     [class.text-red-500]="error.severity === 'error'"
                     [class.text-amber-500]="error.severity === 'warning'">
                  <svg class="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    @if (error.severity === 'error') {
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                    } @else {
                      <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                    }
                  </svg>
                  <span>{{ error.message | translate }}</span>
                </div>
              }
            </div>
          }
        </section>

        <!-- Custom CSS Section -->
        <section class="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          <h4 class="font-bold text-slate-700 dark:text-white text-sm mb-3 flex items-center gap-2">
            <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
            </svg>
            {{ 'ADVANCED_CUSTOM_CSS' | translate }}
            <span class="badge badge-sm badge-outline text-slate-400">Scoped</span>
          </h4>
          
          <div class="form-control">
            <textarea 
              [ngModel]="localCustomCss()"
              (ngModelChange)="onCustomCssChange($event)"
              placeholder=".my-class {
  transition: transform 0.3s ease;
}
.my-class:hover {
  transform: scale(1.05);
}"
              rows="6"
              class="textarea textarea-bordered w-full font-mono text-sm leading-relaxed dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 resize-y"
              [class.textarea-error]="!cssValidation().isValid">
            </textarea>
            <p class="text-xs text-slate-400 dark:text-slate-500 mt-2">
              {{ 'ADVANCED_CUSTOM_CSS_HINT' | translate }}
            </p>
          </div>

          <!-- Custom CSS Validation Errors -->
          @if (cssValidation().errors.length > 0) {
            <div class="mt-3 space-y-1">
              @for (error of cssValidation().errors; track error.message) {
                <div class="flex items-center gap-2 text-xs" 
                     [class.text-red-500]="error.severity === 'error'"
                     [class.text-amber-500]="error.severity === 'warning'">
                  <svg class="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    @if (error.severity === 'error') {
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                    } @else {
                      <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                    }
                  </svg>
                  <span>{{ error.message | translate }}</span>
                </div>
              }
            </div>
          }
        </section>

        <!-- Security Warning Banner -->
        @if (hasSecurityWarnings()) {
          <div class="alert alert-warning shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <h3 class="font-bold">{{ 'STYLE_VALIDATION_WARNING' | translate }}</h3>
              <div class="text-xs">{{ 'STYLE_VALIDATION_DANGEROUS' | translate }}</div>
            </div>
          </div>
        }

      </div>
    </div>
  `
})
export class AdvancedStylePanelComponent {
    // Dependency injection
    private styleValidator = inject(StyleValidatorService);

    // Signal-based inputs (Angular 17.1+)
    readonly customClasses = input<string>('');
    readonly inlineStyles = input<string>('');
    readonly customCss = input<string>('');

    // Output
    readonly stylesChange = output<AdvancedStyleOutput>();

    // Local editing state (signals)
    readonly localClasses = signal('');
    readonly localInlineStyles = signal('');
    readonly localCustomCss = signal('');

    // Track if initial sync has happened
    private initialized = false;

    constructor() {
        // Effect: sync input values to local state when inputs change externally
        effect(() => {
            const inputClasses = this.customClasses();
            const inputInline = this.inlineStyles();
            const inputCss = this.customCss();

            // Only update local state if we haven't initialized yet
            // or if the input genuinely changed (not from our own emit)
            if (!this.initialized) {
                this.localClasses.set(inputClasses);
                this.localInlineStyles.set(inputInline);
                this.localCustomCss.set(inputCss);
                this.initialized = true;
            }
        });
    }

    // Computed: validation results
    readonly classValidation = computed<CssValidationResult>(() =>
        this.styleValidator.validateClasses(this.localClasses())
    );

    readonly inlineValidation = computed<CssValidationResult>(() =>
        this.styleValidator.validateInlineStyles(this.localInlineStyles())
    );

    readonly cssValidation = computed<CssValidationResult>(() =>
        this.styleValidator.validateCustomCss(this.localCustomCss())
    );

    // Computed: combined output
    readonly combinedOutput = computed<AdvancedStyleOutput>(() => ({
        customClasses: this.classValidation().sanitizedValue,
        inlineStyles: this.inlineValidation().sanitizedValue,
        customCss: this.cssValidation().sanitizedValue,
        hasErrors: !this.classValidation().isValid ||
            !this.inlineValidation().isValid ||
            !this.cssValidation().isValid
    }));

    // Computed: check for security warnings
    readonly hasSecurityWarnings = computed(() => {
        const allErrors = [
            ...this.classValidation().errors,
            ...this.inlineValidation().errors,
            ...this.cssValidation().errors
        ];
        return allErrors.some(e => e.severity === 'error');
    });

    // Event handlers
    onClassesChange(value: string): void {
        this.localClasses.set(value);
        this.emitChanges();
    }

    onInlineStylesChange(value: string): void {
        this.localInlineStyles.set(value);
        this.emitChanges();
    }

    onCustomCssChange(value: string): void {
        this.localCustomCss.set(value);
        this.emitChanges();
    }

    private emitChanges(): void {
        this.stylesChange.emit(this.combinedOutput());
    }
}
