import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray, ValidatorFn } from '@angular/forms';
import { BlockSchema, BlockProperty } from '../block.types';

@Injectable({
    providedIn: 'root'
})
export class SchemaFormBuilder {

    constructor(private fb: FormBuilder) { }

    buildForm(schema: BlockSchema, data: Record<string, unknown> = {}): FormGroup {
        const group: Record<string, FormControl | FormGroup | FormArray> = {};
        const requiredFields = new Set(schema.required || []);

        if (schema.properties) {
            Object.keys(schema.properties).forEach(key => {
                const property = schema.properties[key];
                const value = data[key] !== undefined ? data[key] : property.default;
                const isRequired = requiredFields.has(key);

                group[key] = this.createControl(property, value, isRequired);
            });
        }

        return this.fb.group(group);
    }

    private createControl(property: BlockProperty, value: unknown, isRequired = false): FormControl | FormGroup | FormArray {
        const validators: ValidatorFn[] = [];

        // Add required validator if field is required
        if (isRequired) {
            validators.push(Validators.required);
        }

        const initialValue = value !== undefined ? value : property.default;

        // Visual JSON fallback for legacy schemas or explicit overrides
        if (property.ui?.widget === 'textarea' && (typeof initialValue === 'object' || Array.isArray(initialValue))) {
            return new FormControl(JSON.stringify(initialValue, null, 2), validators);
        }

        if (property.type === 'array') {
            const arrayValues = Array.isArray(initialValue) ? initialValue : [];
            if (property.items) {
                return this.fb.array(arrayValues.map((v: unknown) => this.createControl(property.items!, v)));
            }
            return this.fb.array(arrayValues.map((v: unknown) => new FormControl(v)));
        } else if (property.type === 'object') {
            if (property.properties) {
                const nestedGroup: Record<string, FormControl | FormGroup | FormArray> = {};
                Object.keys(property.properties).forEach(key => {
                    const prop = property.properties![key];
                    const val = initialValue ? (initialValue as Record<string, unknown>)[key] : undefined;
                    nestedGroup[key] = this.createControl(prop, val);
                });
                return this.fb.group(nestedGroup);
            }
            return new FormGroup({});
        }

        return new FormControl(initialValue, validators);
    }

    // Helper to add a new item to an array property (to be used by UI)
    createArrayItem(itemSchema: BlockProperty): FormControl | FormGroup | FormArray {
        // Pass undefined to trigger default values in createControl
        return this.createControl(itemSchema, undefined) as FormControl | FormGroup | FormArray;
    }

    /**
     * Check if a field is required based on schema
     */
    isFieldRequired(schema: BlockSchema, fieldName: string): boolean {
        return schema.required?.includes(fieldName) ?? false;
    }
}

