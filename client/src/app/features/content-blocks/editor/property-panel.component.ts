import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnDestroy, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormArray } from '@angular/forms';
import { SchemaFormBuilder } from './schema-form-builder.service';
import { BlockSchema } from '../block.types';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { ArrayEditorComponent } from './array-editor.component';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';

@Component({
  selector: 'app-property-panel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, forwardRef(() => ArrayEditorComponent), TranslatePipe],
  template: `
    <div class="h-full flex flex-col bg-slate-50 border-l border-slate-200">
      <div class="p-4 border-b border-slate-200 bg-white">
        <h3 class="font-bold text-slate-800">{{ 'BLOCK_PROP_PANEL_HEADER' | translate }}</h3>
      </div>
      
      <div class="flex-1 overflow-y-auto p-4" *ngIf="form">
        <form [formGroup]="form" class="space-y-6">
          <div *ngFor="let key of getKeys(schema?.properties)" class="form-control">
            <ng-container [ngSwitch]="schema?.properties?.[key]?.ui?.widget || schema?.properties?.[key]?.type">
              
              <!-- Textarea Widget -->
              <div *ngSwitchCase="'textarea'">
                 <label [for]="key" class="label">
                   <span class="label-text font-medium">{{ getLabel(key) | translate }}</span>
                 </label>
                 <textarea [id]="key" [formControlName]="key" class="textarea textarea-bordered w-full h-24"></textarea>
                 <p *ngIf="schema?.properties?.[key]?.description" class="text-xs text-slate-500 mt-1">{{ schema?.properties?.[key]?.description | translate }}</p>
              </div>

               <!-- Image Widget (Simplistic for now) -->
               <div *ngSwitchCase="'image'">
                 <label [for]="key" class="label">
                   <span class="label-text font-medium">{{ getLabel(key) | translate }}</span>
                 </label>
                 <div class="flex gap-2">
                    <input type="text" [id]="key" [formControlName]="key" class="input input-bordered w-full" [placeholder]="'BLOCK_PROP_IMAGE_URL' | translate">
                    <button type="button" class="btn btn-square btn-outline">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                          <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                        </svg>
                    </button>
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
              <div *ngSwitchCase="'object'" class="border border-slate-200 rounded-lg p-3 bg-slate-50/50">
                  <h4 class="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">{{ getLabel(key) | translate }}</h4>
                  <app-property-panel
                      [schema]="asSchema(schema?.properties?.[key]!)"
                      [group]="getAsFormGroup(key)">
                  </app-property-panel>
              </div>

              <!-- Default Text Input -->
              <div *ngSwitchDefault>
                <label [for]="key" class="label">
                  <span class="label-text font-medium">{{ getLabel(key) | translate }}</span>
                </label>
                <input type="text" [id]="key" [formControlName]="key" class="input input-bordered w-full" />
              </div>
              
            </ng-container>
          </div>
        </form>
      </div>
      
      <div class="p-4 border-t border-slate-200 bg-slate-50 sticky bottom-0 z-10" *ngIf="!group">
        <button type="button" class="btn btn-primary w-full" (click)="save()" [disabled]="form?.invalid || form?.pristine">
          {{ 'BLOCK_PROP_SAVE' | translate }}
        </button>
      </div>
      
      <div class="p-8 text-center text-slate-400" *ngIf="!form">
        <p>{{ 'BLOCK_PROP_NO_SELECTION' | translate }}</p>
      </div>
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

      // Automatic subscription removed per user request for manual save
    }
  }

  save() {
    if (this.form) {
      this.modelChange.emit(this.processFormValue(this.form.value));
      this.form.markAsPristine(); // Optional: indicate saved state
    }
  }

  private processFormValue(formValue: any): any {
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
  }

  getKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }

  getLabel(key: string): string {
    return this.schema?.properties[key]?.title || key;
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
