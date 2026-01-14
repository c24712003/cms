import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnDestroy, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormArray } from '@angular/forms';
import { SchemaFormBuilder } from './schema-form-builder.service';
import { BlockSchema } from '../block.types';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { ArrayEditorComponent } from './array-editor.component';
import { MediaPickerDialogComponent } from '../../../admin/components/media-picker-dialog/media-picker-dialog.component';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';

@Component({
  selector: 'app-property-panel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, forwardRef(() => ArrayEditorComponent), MediaPickerDialogComponent, TranslatePipe],
  template: `
    <div class="h-full flex flex-col bg-slate-50 dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700 transition-colors duration-200">
      <div class="p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 transition-colors duration-200" *ngIf="!group">
        <h3 class="font-bold text-slate-800 dark:text-slate-100">{{ 'BLOCK_PROP_PANEL_HEADER' | translate }}</h3>
      </div>
      
      <div class="flex-1 overflow-y-auto p-4" *ngIf="form">
        <form [formGroup]="form" class="space-y-6">
          <div *ngFor="let key of getKeys(schema?.properties)" class="form-control">
            <ng-container [ngSwitch]="schema?.properties?.[key]?.ui?.widget || schema?.properties?.[key]?.type">
              
              <!-- Textarea Widget -->
              <div *ngSwitchCase="'textarea'">
                 <label [for]="key" class="label">
                   <span class="label-text font-medium dark:text-slate-300">{{ getLabel(key) | translate }}<span *ngIf="isRequired(key)" class="text-red-500 ml-1">*</span></span>
                 </label>
                 <textarea [id]="key" [formControlName]="key" 
                   class="textarea textarea-bordered w-full h-24 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                   [class.textarea-error]="hasError(key)"></textarea>
                 <p *ngIf="hasError(key)" class="text-xs text-red-500 mt-1">{{ 'VALIDATION_REQUIRED' | translate }}</p>
                 <p *ngIf="!hasError(key) && schema?.properties?.[key]?.description" class="text-xs text-slate-500 mt-1">{{ (schema?.properties?.[key]?.description || '') | translate }}</p>
              </div>


               <!-- Image Widget (Simplistic for now) -->
               <div *ngSwitchCase="'image'">
                 <label [for]="key" class="label">
                   <span class="label-text font-medium dark:text-slate-300">{{ getLabel(key) | translate }}</span>
                 </label>
                 <div class="flex gap-2">
                    <input type="text" [id]="key" [formControlName]="key" class="input input-bordered w-full dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100" [placeholder]="'BLOCK_PROP_IMAGE_URL' | translate">
                    <button type="button" (click)="openMediaPicker(key)" class="btn btn-square btn-outline dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-800">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                          <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                        </svg>
                    </button>
                 </div>
                 <div *ngIf="form.get(key)?.value" class="mt-2 relative w-full h-32 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                    <img [src]="form.get(key)?.value" class="w-full h-full object-cover">
                 </div>
              </div>
              
              <!-- Array (Simplistic JSON editor for complex arrays for now) -->
              <!-- Array Editor -->
              <div *ngSwitchCase="'array'">
                  <app-array-editor
                     *ngIf="schema?.properties?.[key]?.items"
                     [label]="getLabel(key) | translate"
                     [formArray]="getAsFormArray(key)"
                     [itemSchema]="schema?.properties?.[key]?.items!">
                  </app-array-editor>
                  
                  <div *ngIf="!schema?.properties?.[key]?.items" class="alert alert-warning text-xs">
                     Array defined without 'items' schema. Cannot render editor.
                  </div>
              </div>
              
              <!-- Nested Object -->
              <div *ngSwitchCase="'object'" class="border border-slate-200 dark:border-slate-700 rounded-lg p-3 bg-slate-50/50 dark:bg-slate-800/50">
                  <h4 class="font-bold text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">{{ getLabel(key) | translate }}</h4>
                  <app-property-panel
                      [schema]="asSchema(schema?.properties?.[key]!)"
                      [group]="getAsFormGroup(key)">
                  </app-property-panel>
              </div>

              <!-- Default Text Input -->
              <div *ngSwitchDefault>
                <label [for]="key" class="label">
                  <span class="label-text font-medium dark:text-slate-300">{{ getLabel(key) | translate }}<span *ngIf="isRequired(key)" class="text-red-500 ml-1">*</span></span>
                </label>
                <input type="text" [id]="key" [formControlName]="key" 
                  class="input input-bordered w-full dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100" 
                  [class.input-error]="hasError(key)" />
                <p *ngIf="hasError(key)" class="text-xs text-red-500 mt-1">{{ 'VALIDATION_REQUIRED' | translate }}</p>
              </div>
              
              <!-- Color Widget -->
              <div *ngSwitchCase="'color'">
                 <label [for]="key" class="label">
                   <span class="label-text font-medium">{{ getLabel(key) | translate }}</span>
                 </label>
                 <div class="flex items-center gap-3">
                   <input type="color" [id]="key" [formControlName]="key" class="h-10 w-10 p-1 rounded cursor-pointer bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
                   <input type="text" [formControlName]="key" class="input input-bordered flex-1 h-10 font-mono text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100" placeholder="#000000">
                 </div>
              </div>

               <!-- Select Widget -->
               <div *ngSwitchCase="'select'">
                 <label [for]="key" class="label">
                   <span class="label-text font-medium dark:text-slate-300">{{ getLabel(key) | translate }}</span>
                 </label>
                 <select [id]="key" [formControlName]="key" class="select select-bordered w-full dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100">
                     <option [ngValue]="null">Select...</option>
                     <option *ngFor="let opt of schema?.properties?.[key]?.enum" [value]="opt">{{ opt }}</option>
                 </select>
               </div>

                <!-- Range Widget -->
               <div *ngSwitchCase="'range'">
                 <label [for]="key" class="label">
                   <span class="label-text font-medium dark:text-slate-300">{{ getLabel(key) | translate }}</span>
                   <span class="label-text-alt dark:text-slate-400">{{ form!.get(key)?.value }}</span>
                 </label>
                 <input type="range" [id]="key" [formControlName]="key" class="range range-primary range-sm" min="0" max="100" step="1">
               </div>

               <!-- Rich Text Widget (Basic for now) -->
               <div *ngSwitchCase="'rich-text'">
                 <label [for]="key" class="label">
                   <span class="label-text font-medium dark:text-slate-300">{{ getLabel(key) | translate }}</span>
                 </label>
                 <textarea [id]="key" [formControlName]="key" class="textarea textarea-bordered w-full h-32 font-serif text-lg leading-relaxed dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100" placeholder="Type your content here..."></textarea>
               </div>

              </ng-container>
          </div>
        </form>
      </div>
      
      <div class="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 sticky bottom-0 z-10" *ngIf="!group">
        <button type="button" class="btn btn-primary w-full" (click)="save()" [disabled]="form?.invalid || form?.pristine">
          {{ 'BLOCK_PROP_SAVE' | translate }}
        </button>
      </div>
      
      <div class="p-8 text-center text-slate-400 dark:text-slate-500" *ngIf="!form">
        <p>{{ 'BLOCK_PROP_NO_SELECTION' | translate }}</p>
      </div>

       <!-- Media Picker Dialog -->
       <app-media-picker-dialog *ngIf="showMediaPicker" 
            (selected)="onMediaSelected($event)" 
            (cancelled)="showMediaPicker = false">
       </app-media-picker-dialog>
    </div>
  `
})
export class PropertyPanelComponent implements OnChanges, OnDestroy {
  @Input() schema: BlockSchema | undefined;
  @Input() model: any = {};
  @Input() group: FormGroup | undefined; // Input for nested usage
  @Output() modelChange = new EventEmitter<any>();

  form: FormGroup | undefined;
  private sub: Subscription | undefined;
  hasUnsavedChanges = false;
  autoSaveEnabled = true;

  // Media Picker State
  showMediaPicker = false;
  activeImageKey: string | null = null;

  constructor(private sfb: SchemaFormBuilder) { }

  ngOnChanges(changes: SimpleChanges): void {
    // If group is provided, use it.
    if (this.group) {
      this.form = this.group;
      return;
    }

    if ((changes['schema'] || changes['model']) && this.schema) {
      // If we already have a form and the schema hasn't changed, 
      // just update the values to preserve focus/state.
      if (this.form && !changes['schema']) {
        this.form.patchValue(this.model, { emitEvent: false });
        return;
      }

      // Full rebuild required (first load or schema change)
      this.form = this.sfb.buildForm(this.schema, this.model);
      this.hasUnsavedChanges = false;

      // Setup auto-save subscription
      if (this.sub) {
        this.sub.unsubscribe();
      }

      if (this.autoSaveEnabled) {
        this.sub = this.form.valueChanges.pipe(
          debounceTime(300)  // Reduced to 300ms for better responsiveness
        ).subscribe(() => {
          if (this.form?.dirty && this.form?.valid) {
            this.save();
          }
        });
      }

      // Track unsaved changes
      this.form.valueChanges.subscribe(() => {
        this.hasUnsavedChanges = this.form?.dirty ?? false;
      });
    }
  }

  save() {
    if (this.form) {
      this.modelChange.emit(this.processFormValue(this.form.value));
      this.form.markAsPristine(); // Optional: indicate saved state
      this.hasUnsavedChanges = false;
    }
  }

  // ... (media picker methods)
  openMediaPicker(key: string) {
    this.activeImageKey = key;
    this.showMediaPicker = true;
  }

  onMediaSelected(url: string) {
    if (this.activeImageKey && this.form) {
      this.form.patchValue({
        [this.activeImageKey]: url
      });
      this.form.markAsDirty();
      this.hasUnsavedChanges = true;
    }
    this.showMediaPicker = false;
    this.activeImageKey = null;
  }


  private processFormValue(formValue: any): any {
    // ... (existing implementation)
    const result = { ...formValue };
    if (this.schema && this.schema.properties) {
      Object.keys(this.schema.properties).forEach(key => {
        const prop = this.schema!.properties[key];
        // If we forced it to be a JSON string in textarea, try to parse it back
        if (prop.ui?.widget === 'textarea' && typeof result[key] === 'string') {
          try {
            // Only parse if it looks like an object or array to avoid parsing simple strings
            const trimmed = result[key].trim();
            if ((trimmed.startsWith('{') && trimmed.endsWith('}')) ||
              (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
              result[key] = JSON.parse(result[key]);
            }
          } catch (e) {
            console.warn('Invalid JSON in editor:', key);
          }
        }
      });
    }
    return result;
  }

  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();

    // Auto-save any pending changes on destroy
    if (this.autoSaveEnabled && this.form?.dirty && this.form?.valid) {
      // Emit immediately without debounce
      this.modelChange.emit(this.processFormValue(this.form.value));
    }
  }

  getKeys(obj: Record<string, unknown> | undefined): string[] {
    return obj ? Object.keys(obj) : [];
  }

  getLabel(key: string): string {
    return this.schema?.properties[key]?.title || key;
  }

  isRequired(key: string): boolean {
    return this.sfb.isFieldRequired(this.schema!, key);
  }

  hasError(key: string): boolean {
    const control = this.form?.get(key);
    return !!(control?.invalid && control?.touched);
  }

  getAsFormArray(key: string): FormArray {
    return this.form?.get(key) as FormArray;
  }

  getAsFormGroup(key: string): FormGroup {
    return this.form?.get(key) as FormGroup;
  }

  // Helper to convert a property definition (which might have nested properties) into a schema
  // so we can recurse.
  asSchema(prop: any): BlockSchema {
    return {
      properties: prop.properties || {}
    };
  }
}
