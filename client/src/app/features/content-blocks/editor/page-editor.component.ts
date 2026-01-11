import { Component, Inject, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { BlockInstance } from '../block.types';
import { BlockRegistryService } from '../block-registry.service';
import { DynamicBlockRendererComponent } from '../dynamic-block-renderer.component';
import { PropertyPanelComponent } from './property-panel.component';

@Component({
    selector: 'app-page-editor',
    standalone: true,
    imports: [CommonModule, DragDropModule, DynamicBlockRendererComponent, PropertyPanelComponent],
    template: `
    <div class="flex h-screen bg-slate-100 overflow-hidden">
      <!-- Main Canvas (Left/Center) -->
      <div class="flex-1 flex flex-col h-full overflow-hidden">
        <!-- Toolbar (Header) -->
        <header class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm z-10">
          <div class="flex items-center gap-3">
             <h1 class="font-bold text-slate-800 text-lg">Page Editor</h1>
             <span class="badge badge-primary badge-outline text-xs">Beta</span>
          </div>
          <div class="flex gap-2">
            <button class="btn btn-sm btn-ghost" (click)="addBlock('page-hero')">+ Hero</button>
            <button class="btn btn-sm btn-ghost" (click)="addBlock('feature-grid')">+ Features</button>
            <button class="btn btn-sm btn-primary" (click)="savePage()">Save Changes</button>
          </div>
        </header>

        <!-- Canvas Area -->
        <main class="flex-1 overflow-y-auto p-8 relative">
           <div 
             cdkDropList 
             class="max-w-5xl mx-auto space-y-4 min-h-[500px] pb-20"
             (cdkDropListDropped)="drop($event)">
             
             <div *ngFor="let block of blocks; let i = index" 
                  cdkDrag
                  class="group relative border-2 border-transparent hover:border-blue-400 rounded-lg transition-all cursor-pointer bg-white shadow-sm"
                  [class.ring-2]="selectedBlock === block"
                  [class.ring-blue-600]="selectedBlock === block"
                  (click)="selectBlock(block, $event)">
                  
                <!-- Drag Handle -->
                <div class="absolute left-0 top-0 bottom-0 w-6 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-move bg-slate-50 transition-opacity z-20" cdkDragHandle>
                    <span class="text-slate-400">⋮⋮</span>
                </div>

                <!-- Block Renderer -->
                <div class="pointer-events-none group-hover:pointer-events-none"> 
                   <!-- Pointer events disabled to prevent internal interactions while editing layout (optional strategy) -->
                   <app-dynamic-block-renderer [block]="block"></app-dynamic-block-renderer>
                </div>
                
                <!-- Overlay for selection (transparent) -->
                <div class="absolute inset-0 z-10" [class.bg-blue-500/5]="selectedBlock === block"></div>

             </div>

             <div *ngIf="blocks.length === 0" class="text-center py-20 border-2 border-dashed border-slate-300 rounded-xl">
                <p class="text-slate-500">Drag blocks here or add from toolbar</p>
             </div>
           </div>
        </main>
      </div>

      <!-- Property Panel (Right Sidebar) -->
      <aside class="w-80 h-full bg-white shadow-xl z-20 transform transition-transform" 
             [class.translate-x-full]="!selectedBlock" 
             [class.translate-x-0]="selectedBlock">
        
        <app-property-panel 
            *ngIf="selectedBlock"
            [schema]="getBlockSchema(selectedBlock.type)"
            [model]="selectedBlock.data"
            (modelChange)="updateBlockData($event)">
        </app-property-panel>

        <div *ngIf="!selectedBlock" class="h-full flex items-center justify-center text-slate-400 p-6 text-center">
            Select a block to edit properties
        </div>
      </aside>
    </div>
  `,
    styles: [`
    /* CDK Drag Styling */
    .cdk-drag-preview {
      box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
      border-radius: 0.5rem;
      opacity: 0.8;
    }
    .cdk-drag-placeholder {
      opacity: 0.3;
      border: 2px dashed #94a3b8;
      background: #f1f5f9;
    }
    .cdk-drag-animating {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }
  `]
})
export class PageEditorComponent {
    blocks: BlockInstance[] = [
        // Initial sample data
        {
            id: '1',
            type: 'page-hero',
            data: {
                title: 'Welcome to our New System',
                subtitle: 'Modular, fast, and easy to use.',
                image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop'
            }
        },
        {
            id: '2',
            type: 'feature-grid',
            data: {
                title: 'Core Features',
                items: [
                    { icon: 'icon-certified', title: 'Modular', description: 'Built with flexibility in mind.' },
                    { icon: 'icon-experience', title: 'Fast', description: 'Optimized for performance.' },
                    { icon: 'icon-support', title: 'Secure', description: 'Enterprise grade security.' }
                ]
            }
        }
    ];

    selectedBlock: BlockInstance | null = null;

    constructor(private registry: BlockRegistryService) { }

    drop(event: CdkDragDrop<BlockInstance[]>) {
        moveItemInArray(this.blocks, event.previousIndex, event.currentIndex);
    }

    selectBlock(block: BlockInstance, event: MouseEvent) {
        event.stopPropagation();
        this.selectedBlock = block;
    }

    getBlockSchema(type: string) {
        const def = this.registry.getDefinition(type);
        return def?.manifest.schema;
    }

    updateBlockData(newData: any) {
        if (this.selectedBlock) {
            // Identify trigger: create new object reference to trigger OnChanges in components if needed
            this.selectedBlock.data = { ...newData };
            // In a real app with OnPush, we might need to recreate the block instance wrapper too
            // For now, this mutation along with generic change detection should work for the recursive components
        }
    }

    addBlock(type: string) {
        const newBlock: BlockInstance = {
            id: Math.random().toString(36).substring(7),
            type: type,
            data: {} // In real app, initialize with schema defaults
        };
        this.blocks.push(newBlock);
        this.selectedBlock = newBlock;
    }

    savePage() {
        console.log('Saving Page Configuration:', JSON.stringify(this.blocks, null, 2));
        alert('Page configuration saved to console!');
    }
}
