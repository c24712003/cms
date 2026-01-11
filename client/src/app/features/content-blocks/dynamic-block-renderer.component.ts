import { Component, Input, ViewChild, ViewContainerRef, OnChanges, SimpleChanges, ComponentRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlockRegistryService } from './block-registry.service';
import { BlockInstance } from './block.types';

@Component({
    selector: 'app-dynamic-block-renderer',
    standalone: true,
    imports: [CommonModule],
    template: `
    <ng-template #container></ng-template>
    <div *ngIf="!componentRef" class="p-4 border border-red-200 bg-red-50 text-red-700 rounded">
      Block type "{{block?.type}}" not found in registry.
    </div>
  `
})
export class DynamicBlockRendererComponent implements OnChanges {
    @Input() block: BlockInstance | undefined;
    @ViewChild('container', { read: ViewContainerRef, static: true }) container!: ViewContainerRef;

    componentRef: ComponentRef<any> | undefined;

    constructor(private registry: BlockRegistryService) { }

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
        }
    }

    private updateInputs(): void {
        if (!this.componentRef || !this.block || !this.block.data) return;

        const ref = this.componentRef;
        Object.keys(this.block.data).forEach(key => {
            // Check if block and data exist to satisfy TypeScript (though strictly checked above)
            if (this.block && this.block.data) {
                ref.setInput(key, this.block.data[key]);
            }
        });

        // Manually trigger change detection for the child component
        // This ensures OnPush components or detached views update immediately
        ref.changeDetectorRef.markForCheck();
    }

    private renderBlock(): void {
        this.container.clear();
        this.componentRef = undefined;

        if (!this.block) return;

        const componentClass = this.registry.getComponent(this.block.type);

        if (componentClass) {
            this.componentRef = this.container.createComponent(componentClass);
            this.updateInputs(); // Reuse input update logic
        }
    }
}
