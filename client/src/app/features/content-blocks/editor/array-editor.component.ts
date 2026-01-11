
import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormArray, FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { BlockProperty, BlockSchema } from '../block.types';
import { SchemaFormBuilder } from './schema-form-builder.service';
import { PropertyPanelComponent } from './property-panel.component';

@Component({
  selector: 'app-array-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DragDropModule, forwardRef(() => PropertyPanelComponent)],
  template: `
    <div class="space-y-4">
       <!-- Header -->
       <div class="flex items-center justify-between">
         <label class="label-text font-medium">{{ label }}</label>
         <button type="button" (click)="addItem()" class="btn btn-xs btn-primary btn-outline gap-1">
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg>
           Add Item
         </button>
       </div>

       <!-- List -->
       <div cdkDropList (cdkDropListDropped)="drop($event)" class="space-y-3">
         <div *ngFor="let control of formArray.controls; let i = index" cdkDrag class="card bg-base-100 border border-slate-200 shadow-sm group">
            <!-- Item Header -->
            <div class="card-body p-4">
              <div class="flex items-center justify-between mb-3">
                 <div class="flex items-center gap-2 cursor-move text-slate-400 hover:text-slate-600" cdkDragHandle>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5"><path fill-rule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z" clip-rule="evenodd" /></svg>
                    <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Item {{ i + 1 }}</span>
                 </div>
                 <button type="button" (click)="removeItem(i)" class="btn btn-ghost btn-xs text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4"><path fill-rule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 001.5.06l.3-7.5z" clip-rule="evenodd" /></svg>
                 </button>
              </div>

              <!-- Nested Property Panel for Object Items -->
              <ng-container *ngIf="itemSchema.properties; else primitiveInput">
                 <app-property-panel 
                     [schema]="asSchema(itemSchema)"
                     [group]="asFormGroup(control)">
                 </app-property-panel>
              </ng-container>

              <ng-template #primitiveInput>
                 <input [formControl]="asFormControl(control)" class="input input-sm input-bordered w-full" placeholder="Value..." />
              </ng-template>

            </div>
         </div>
         
         <div *ngIf="formArray.controls.length === 0" class="text-center py-4 bg-slate-50 rounded-lg text-slate-400 text-sm border border-dashed border-slate-300">
            No items yet. Click Add Item to start.
         </div>
       </div>
    </div>
  `
})
export class ArrayEditorComponent {
  @Input() formArray!: FormArray;
  @Input() label: string = '';
  @Input() itemSchema!: BlockProperty;

  constructor(private sfb: SchemaFormBuilder) { }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.formArray.controls, event.previousIndex, event.currentIndex);
    this.formArray.updateValueAndValidity();
  }

  addItem() {
    if (!this.itemSchema) return;
    const control = this.sfb.createArrayItem(this.itemSchema);
    this.formArray.push(control);
  }

  removeItem(index: number) {
    this.formArray.removeAt(index);
  }

  asFormGroup(control: AbstractControl): FormGroup {
    return control as FormGroup;
  }

  asFormControl(control: AbstractControl): FormControl {
    return control as FormControl;
  }

  asSchema(prop: BlockProperty): BlockSchema {
    return {
      properties: prop.properties || {}
    };
  }
}
