import { Component, Input, ViewChild, ViewContainerRef, OnChanges, SimpleChanges, ComponentRef, OnDestroy, reflectComponentType, inject, signal, computed, ChangeDetectorRef, DoCheck } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { BlockRegistryService } from './block-registry.service';
import { StyleInjectorService } from './style-injector.service';
import { StyleValidatorService } from './style-validator.service';
import { BlockInstance } from './block.types';

@Component({
    selector: 'app-dynamic-block-renderer',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div 
      [attr.data-block-id]="block?.id"
      [class]="combinedClasses()"
      [style]="safeInlineStyle()">
      <ng-template #container></ng-template>
    </div>
    <div *ngIf="!componentRef && block" class="p-4 border border-red-200 bg-red-50 text-red-700 rounded">
      Block type "{{block.type}}" not found in registry.
    </div>
  `
})
export class DynamicBlockRendererComponent implements OnChanges, OnDestroy, DoCheck {
    @Input() block: BlockInstance | undefined;
    @ViewChild('container', { read: ViewContainerRef, static: true }) container!: ViewContainerRef;

    componentRef: ComponentRef<any> | undefined;
    private componentInputs: Set<string> = new Set();

    // Track previous style values for change detection
    private previousCustomClasses: string | undefined;
    private previousInlineStyles: string | undefined;
    private previousCustomCss: string | undefined;

    // Dependency injection
    private registry = inject(BlockRegistryService);
    private styleInjector = inject(StyleInjectorService);
    private styleValidator = inject(StyleValidatorService);
    private sanitizer = inject(DomSanitizer);
    private cdr = inject(ChangeDetectorRef);

    /**
     * Combine custom classes from settings and styles
     */
    combinedClasses(): string {
        if (!this.block) return '';

        const parts: string[] = [];

        // From settings (legacy customClass field)
        if (this.block.settings?.customClass) {
            parts.push(this.block.settings.customClass);
        }

        // From styles.customClasses (new field)
        if (this.block.styles?.customClasses) {
            const validation = this.styleValidator.validateClasses(this.block.styles.customClasses);
            parts.push(validation.sanitizedValue);
        }

        return parts.join(' ').trim();
    }

    /**
     * Create safe inline style from styles.inlineStyles
     */
    safeInlineStyle(): SafeStyle | null {
        if (!this.block?.styles?.inlineStyles) return null;

        const validation = this.styleValidator.validateInlineStyles(this.block.styles.inlineStyles);
        if (!validation.sanitizedValue) return null;

        return this.sanitizer.bypassSecurityTrustStyle(validation.sanitizedValue);
    }

    /**
     * DoCheck: detect style changes even when object reference doesn't change
     */
    ngDoCheck(): void {
        if (!this.block) return;

        const currentClasses = this.block.styles?.customClasses;
        const currentInline = this.block.styles?.inlineStyles;
        const currentCss = this.block.styles?.customCss;

        // Check if any style values changed
        if (currentClasses !== this.previousCustomClasses ||
            currentInline !== this.previousInlineStyles ||
            currentCss !== this.previousCustomCss) {

            // Update tracked values
            this.previousCustomClasses = currentClasses;
            this.previousInlineStyles = currentInline;
            this.previousCustomCss = currentCss;

            // Re-inject custom CSS
            if (this.block.styles) {
                this.styleInjector.injectBlockStyles(this.block);
            }

            // Force view update
            this.cdr.markForCheck();
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        const blockChange = changes['block'];
        if (blockChange && this.block) {
            const prev = blockChange.previousValue as BlockInstance;
            const curr = blockChange.currentValue as BlockInstance;

            // If it's the first time, or type changed, or no component reference: Full Render
            if (!prev || prev.type !== curr.type || !this.componentRef) {
                this.renderBlock();
            } else {
                // Same component type, just update data inputs
                this.updateInputs();
            }

            // Inject Styles via CSS
            if (curr.styles) {
                this.styleInjector.injectBlockStyles(curr);
            }
        }
    }

    ngOnDestroy(): void {
        if (this.block) {
            this.styleInjector.removeBlockStyles(this.block.id);
        }
    }

    /**
     * Resolve styles based on current viewport/window width.
     * Flattens the nested viewport structure (desktop/tablet/mobile) into a single object.
     */
    private getResolvedStyles(): any {
        if (!this.block?.styles) return {};

        const width = typeof window !== 'undefined' ? window.innerWidth : 1024;
        let viewport: 'desktop' | 'tablet' | 'mobile' = 'desktop';
        if (width < 480) viewport = 'mobile';
        else if (width < 768) viewport = 'tablet';

        // Deep merge: desktop as base, then layer viewport-specific styles on top
        const base = this.block.styles.desktop || {};
        const specific = this.block.styles[viewport] || {};

        return this.deepMerge(base, specific);
    }

    private deepMerge(target: any, source: any): any {
        const result = { ...target };
        for (const key of Object.keys(source)) {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                result[key] = this.deepMerge(result[key] || {}, source[key]);
            } else {
                result[key] = source[key];
            }
        }
        return result;
    }

    /**
     * Safely set an input only if the component has declared it.
     * This prevents NG0303 errors for legacy data with mismatched property names.
     */
    private safeSetInput(ref: ComponentRef<any>, key: string, value: any): void {
        if (this.componentInputs.has(key)) {
            ref.setInput(key, value);
        }
        // Silently ignore unknown properties - they may be legacy data
    }

    private updateInputs(): void {
        if (!this.componentRef || !this.block || !this.block.data) return;

        const ref = this.componentRef;
        Object.keys(this.block.data).forEach(key => {
            if (this.block && this.block.data) {
                this.safeSetInput(ref, key, this.block.data[key]);
            }
        });

        // Pass resolved (flattened) styles if the component accepts it
        if (this.block.styles && this.componentInputs.has('styles')) {
            ref.setInput('styles', this.getResolvedStyles());
        }

        // Also pass blockId for data-block-id attribute binding
        if (this.componentInputs.has('blockId')) {
            ref.setInput('blockId', this.block.id);
        }

        // Manually trigger change detection for the child component
        ref.changeDetectorRef.markForCheck();
    }

    private renderBlock(): void {
        this.container.clear();
        this.componentRef = undefined;
        this.componentInputs.clear();

        if (!this.block) return;

        const componentClass = this.registry.getComponent(this.block.type);

        if (componentClass) {
            // Cache the component's declared inputs using Angular's reflection API
            const mirror = reflectComponentType(componentClass);
            if (mirror) {
                mirror.inputs.forEach(input => {
                    this.componentInputs.add(input.propName);
                });
            }

            this.componentRef = this.container.createComponent(componentClass);
            this.updateInputs();
        }
    }
}
