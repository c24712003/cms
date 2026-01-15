import { Component, input, ViewChild, ViewContainerRef, OnChanges, SimpleChanges, ComponentRef, OnDestroy, reflectComponentType } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlockRegistryService } from './block-registry.service';
import { StyleInjectorService } from './style-injector.service';
import { BlockInstance } from './block.types';

@Component({
    selector: 'app-dynamic-block-renderer',
    standalone: true,
    imports: [CommonModule],
    template: `
    <ng-template #container></ng-template>
    <div *ngIf="!componentRef" class="p-4 border border-red-200 bg-red-50 text-red-700 rounded">
      Block type "{{block()?.type}}" not found in registry.
    </div>
  `
})
export class DynamicBlockRendererComponent implements OnChanges, OnDestroy {
    readonly block = input<BlockInstance | undefined>();
    @ViewChild('container', { read: ViewContainerRef, static: true }) container!: ViewContainerRef;

    componentRef: ComponentRef<any> | undefined;
    private componentInputs: Set<string> = new Set();

    constructor(
        private registry: BlockRegistryService,
        private styleInjector: StyleInjectorService
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        const blockChange = changes['block'];
        if (blockChange && this.block()) {
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
        const currentBlock = this.block();
        if (currentBlock) {
            this.styleInjector.removeBlockStyles(currentBlock.id);
        }
    }

    /**
     * Resolve styles based on current viewport/window width.
     * Flattens the nested viewport structure (desktop/tablet/mobile) into a single object.
     */
    private getResolvedStyles(): any {
        const currentBlock = this.block();
        if (!currentBlock?.styles) return {};

        const width = typeof window !== 'undefined' ? window.innerWidth : 1024;
        let viewport: 'desktop' | 'tablet' | 'mobile' = 'desktop';
        if (width < 480) viewport = 'mobile';
        else if (width < 768) viewport = 'tablet';

        // Deep merge: desktop as base, then layer viewport-specific styles on top
        const base = currentBlock.styles.desktop || {};
        const specific = currentBlock.styles[viewport] || {};

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
        const currentBlock = this.block();
        if (!this.componentRef || !currentBlock || !currentBlock.data) return;

        const ref = this.componentRef;
        Object.keys(currentBlock.data).forEach(key => {
            this.safeSetInput(ref, key, currentBlock.data[key]);
        });

        // Pass resolved (flattened) styles if the component accepts it
        if (currentBlock.styles && this.componentInputs.has('styles')) {
            ref.setInput('styles', this.getResolvedStyles());
        }

        // Also pass blockId for data-block-id attribute binding
        if (this.componentInputs.has('blockId')) {
            ref.setInput('blockId', currentBlock.id);
        }

        // Manually trigger change detection for the child component
        ref.changeDetectorRef.markForCheck();
    }

    private renderBlock(): void {
        this.container.clear();
        this.componentRef = undefined;
        this.componentInputs.clear();

        const currentBlock = this.block();
        if (!currentBlock) return;

        const componentClass = this.registry.getComponent(currentBlock.type);

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
