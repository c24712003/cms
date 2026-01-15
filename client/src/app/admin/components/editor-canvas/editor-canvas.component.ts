import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';

import { BlockInstance, BlockProperty, BlockSchema, ContentBlockManifest } from '../../../features/content-blocks/block.types';
import { BlockRegistryService } from '../../../features/content-blocks/block-registry.service';
import { DynamicBlockRendererComponent } from '../../../features/content-blocks/dynamic-block-renderer.component';
import { BlockToolbarComponent } from '../block-toolbar/block-toolbar.component';

@Component({
    selector: 'app-editor-canvas',
    standalone: true,
    imports: [
        CommonModule,
        DragDropModule,
        TranslatePipe,
        DynamicBlockRendererComponent,
        BlockToolbarComponent
    ],
    styles: [`
        :host { 
            display: flex; 
            flex: 1; 
            overflow: hidden; 
            position: relative; 
            height: 100%; 
            width: 100%;
        }
        /* Hidden blocks in editor should still be visible but faded */
        .editor-hidden-block {
            opacity: 0.3;
            pointer-events: none;
            filter: grayscale(50%);
        }
    `],
    template: `
        <!-- Center: Canvas -->
        <main class="flex-1 bg-slate-100 dark:bg-slate-900 overflow-y-auto p-3 flex justify-center" (click)="clearSelection($event)">
            <div class="transition-all duration-300 ease-in-out shadow-2xl bg-white min-h-[800px] relative"
                 [ngClass]="{
                    'w-full': viewport === 'desktop',
                    'w-[768px]': viewport === 'tablet',
                    'w-[375px]': viewport === 'mobile'
                 }"
                 (click)="$event.stopPropagation()">
                 
                  <div cdkDropList 
                       [cdkDropListData]="blocks()" 
                       (cdkDropListDropped)="drop($event)"
                       class="min-h-full pb-32">
                       
                     <div *ngFor="let block of blocks(); let i = index; trackBy: trackBlockId" 
                          cdkDrag
                          class="group relative transition-all">
                          
                         <!-- Drag Handle (Left) -->
                         <div class="absolute left-0 top-0 bottom-0 w-8 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-move z-20 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-l-xl transition-all" cdkDragHandle>
                             <svg class="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="currentColor"><path d="M7 19h2v2H7zM7 15h2v2H7zM7 11h2v2H7zM7 7h2v2H7zM11 19h2v2h-2zM11 15h2v2h-2zM11 11h2v2h-2zM11 7h2v2h-2zM15 19h2v2h-2zM15 15h2v2h-2zM15 11h2v2h-2zM15 11h2v2h-2zM15 7h2v2h-2z"/></svg>
                         </div>
                         
                         <!-- Remove Button (Right) -->
                         <button (click)="removeBlock(block, $event)" class="absolute -right-3 -top-3 bg-white dark:bg-slate-700 text-slate-400 hover:text-red-500 shadow-sm border border-slate-200 dark:border-slate-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all z-30 hover:scale-110">
                             <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                         </button>

                         <!-- Rendered Block -->
                         <div (click)="selectBlock(block, $event)" 
                              class="cursor-pointer hover:ring-2 hover:ring-blue-400/50 rounded-lg transition-all"
                              [class.ring-2]="selectedBlock()?.id === block.id"
                              [class.ring-blue-500]="selectedBlock()?.id === block.id"
                              [class.z-20]="selectedBlock()?.id === block.id">
                              
                             <!-- Hidden Block Placeholder (shown when block has display:none) -->
                             <div *ngIf="isBlockHidden(block)" 
                                  class="p-6 bg-slate-100 dark:bg-slate-700 border-2 border-dashed border-slate-300 dark:border-slate-500 rounded-lg flex items-center gap-3">
                                 <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                                 </svg>
                                 <div class="flex-1">
                                     <p class="text-sm font-medium text-slate-500 dark:text-slate-400">{{ getBlockDisplayName(block) }}</p>
                                     <p class="text-xs text-slate-400 dark:text-slate-500">已設定為隱藏 (display: none)</p>
                                 </div>
                             </div>
                             
                             <!-- Actual Block Renderer (always rendered for editor preview) -->
                             <div [class.editor-hidden-block]="isBlockHidden(block)">
                                <app-dynamic-block-renderer [block]="block"></app-dynamic-block-renderer>
                             </div>
                         </div>

                         <!-- Insert Between Zone (Bottom of each block) -->
                         <div class="h-4 -mb-2 relative group/insert z-10 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <div class="absolute inset-x-0 h-px bg-blue-500"></div>
                            <button (click)="openBlockPicker(i + 1)" class="relative btn btn-circle btn-xs btn-primary transform scale-0 group-hover/insert:scale-100 transition-transform shadow-sm">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                            </button>
                         </div>
                     </div>

                     <!-- Empty State -->
                     <button *ngIf="blocks().length === 0" 
                             (click)="openBlockPicker(0)"
                             class="w-full h-64 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 m-0 rounded-xl text-slate-400 hover:text-blue-500 transition-all cursor-pointer">
                         <div class="p-4 bg-slate-100 dark:bg-slate-800 rounded-full mb-4">
                            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                         </div>
                         <h3 class="font-bold text-lg mb-1">{{ 'ADD_FIRST_BLOCK' | translate }}</h3>
                         <p class="text-sm opacity-80">Click to add your first content block</p>
                     </button>

                     <!-- Bottom Add Button (Always visible if not empty) -->
                     <button *ngIf="blocks().length > 0"
                             (click)="openBlockPicker(blocks().length)"
                             class="w-full mt-8 py-8 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-slate-400 hover:text-blue-500 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all flex flex-col items-center justify-center gap-2">
                         <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                         <span class="font-bold">{{ 'ADD_BLOCK_BTN' | translate }}</span>
                     </button>

                  </div>
             </div>

             <!-- Floating Add Button (Mobile/Quick) -->
             <button class="fixed bottom-8 right-8 md:hidden btn btn-circle btn-primary shadow-xl z-40" (click)="openBlockPicker(blocks().length); $event.stopPropagation()">
                 <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
             </button>
        </main>

        <!-- Right: Block Toolbar -->
        <aside class="absolute inset-y-0 right-0 z-30 w-full md:w-80 transition-transform duration-300 md:static md:z-auto h-full border-l border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
               [class.translate-x-0]="selectedBlock()"
               [class.translate-x-full]="!selectedBlock()"
               [class.hidden]="!selectedBlock() && !isMobile()"> 
             
             <app-block-toolbar
                *ngIf="selectedBlock()"
                [block]="selectedBlock()"
                (blockChange)="updateBlock($event)"
                (close)="clearSelection()"
                (viewportChange)="viewport = $event">
             </app-block-toolbar>
        </aside>

        <!-- Block Picker Modal -->
        <div *ngIf="showBlockPicker" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" (click)="showBlockPicker = false">
            <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-[800px] max-w-full max-h-[90vh] flex flex-col overflow-hidden" (click)="$event.stopPropagation()">
                <div class="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                    <div>
                        <h3 class="text-xl font-bold text-slate-800 dark:text-white">{{ 'ADD_BLOCK_TITLE' | translate }}</h3>
                        <p class="text-sm text-slate-500 dark:text-slate-400">{{ 'ADD_BLOCK_DESC' | translate }}</p>
                    </div>
                    <button (click)="showBlockPicker = false" class="btn btn-circle btn-ghost btn-sm text-slate-400">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                </div>
                
                <div class="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-900">
                    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <button *ngFor="let def of availableBlocks" 
                                (click)="addBlock(def.type)"
                                class="group relative bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:shadow-lg transition-all text-left flex flex-col">
                            <div class="mb-3 w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                 <span class="text-lg font-bold">{{ def.displayName.charAt(0) }}</span>
                            </div>
                            <h4 class="font-bold text-slate-800 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{{ def.displayName }}</h4>
                            <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">Category: {{ def.category || 'General' }}</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class EditorCanvasComponent {
    readonly blocks = input<BlockInstance[]>([]);
    readonly blocksChange = output<BlockInstance[]>();

    readonly selectedBlock = input<BlockInstance | null>(null);
    readonly selectedBlockChange = output<BlockInstance | null>();

    showBlockPicker = false;
    viewport: 'desktop' | 'tablet' | 'mobile' = 'desktop';

    constructor(private registry: BlockRegistryService) { }

    get availableBlocks(): ContentBlockManifest[] {
        // Dynamic block registration: get all registered manifests from registry
        return this.registry.getAllManifests();
    }

    isMobile(): boolean {
        return window.innerWidth < 768;
    }

    clearSelection(event?: Event) {
        if (this.selectedBlock()) {
            this.selectedBlockChange.emit(null);
        }
    }

    selectBlock(block: BlockInstance, event: MouseEvent) {
        event.stopPropagation();
        this.selectedBlockChange.emit(block);
    }

    drop(event: CdkDragDrop<BlockInstance[]>) {
        const updated = [...this.blocks()];
        moveItemInArray(updated, event.previousIndex, event.currentIndex);
        this.blocksChange.emit(updated);
    }

    trackBlockId(index: number, block: BlockInstance) {
        return block.id;
    }

    removeBlock(block: BlockInstance, event?: Event) {
        if (event) event.stopPropagation();
        const updated = [...this.blocks()];
        const index = updated.indexOf(block);
        if (index > -1) {
            updated.splice(index, 1);
            if (this.selectedBlock() === block) {
                this.selectedBlockChange.emit(null);
            }
            this.blocksChange.emit(updated);
        }
    }

    // State for tracking where to insert a new block
    pendingInsertIndex: number | null = null;

    openBlockPicker(index?: number) {
        this.pendingInsertIndex = index !== undefined ? index : null;
        this.showBlockPicker = true;
    }

    addBlock(type: string) {
        const manifest = this.registry.getManifest(type);
        const defaultData = this.buildDefaultsFromSchema(manifest?.schema);

        const newBlock: BlockInstance = {
            id: crypto.randomUUID(),
            type: type,
            data: defaultData
        };

        const updated = [...this.blocks()];
        if (this.pendingInsertIndex !== null && this.pendingInsertIndex >= 0 && this.pendingInsertIndex <= updated.length) {
            updated.splice(this.pendingInsertIndex, 0, newBlock);
        } else {
            updated.push(newBlock);
        }

        this.blocksChange.emit(updated);
        this.selectedBlockChange.emit(newBlock);

        this.showBlockPicker = false;
        this.pendingInsertIndex = null;
    }

    /**
     * Build default data object from block schema
     * Recursively handles nested objects and arrays with default values
     */
    private buildDefaultsFromSchema(schema: BlockSchema | undefined): Record<string, unknown> {
        if (!schema?.properties) return {};

        const defaults: Record<string, unknown> = {};

        Object.entries(schema.properties).forEach(([key, prop]) => {
            if (prop.default !== undefined) {
                defaults[key] = prop.default;
            } else if (prop.type === 'object' && prop.properties) {
                // Recurse into nested objects
                defaults[key] = this.buildDefaultsFromProperty(prop);
            } else if (prop.type === 'array' && prop.items) {
                // Initialize arrays with empty array or one default item
                defaults[key] = [];
            } else if (prop.type === 'string') {
                defaults[key] = '';
            } else if (prop.type === 'number') {
                defaults[key] = 0;
            } else if (prop.type === 'boolean') {
                defaults[key] = false;
            }
        });

        return defaults;
    }

    private buildDefaultsFromProperty(prop: BlockProperty): Record<string, unknown> {
        if (!prop.properties) return {};

        const defaults: Record<string, unknown> = {};
        Object.entries(prop.properties).forEach(([key, subProp]) => {
            if (subProp.default !== undefined) {
                defaults[key] = subProp.default;
            } else if (subProp.type === 'object' && subProp.properties) {
                defaults[key] = this.buildDefaultsFromProperty(subProp);
            }
        });
        return defaults;
    }

    updateBlock(updatedBlock: BlockInstance) {
        if (!this.selectedBlock()) return;

        const updated = [...this.blocks()];
        const index = updated.findIndex(b => b.id === updatedBlock.id);
        if (index > -1) {
            updated[index] = updatedBlock;
            this.blocksChange.emit(updated);
        }

        this.selectedBlockChange.emit(updatedBlock);
    }

    updateBlockData(newData: any) {
        if (this.selectedBlock()) {
            const updatedBlock = {
                ...this.selectedBlock()!,
                data: { ...newData }
            };

            const updated = [...this.blocks()];
            const index = updated.findIndex(b => b.id === updatedBlock.id);
            if (index > -1) {
                updated[index] = updatedBlock;
                this.blocksChange.emit(updated);
            }

            this.selectedBlockChange.emit(updatedBlock);
        }
    }

    getBlockSchema(type: string) {
        return this.registry.getDefinition(type)?.manifest.schema;
    }

    /**
     * Check if a block has display:none styling applied
     */
    isBlockHidden(block: BlockInstance): boolean {
        if (!block.styles) return false;

        // Check inline styles for display: none
        const inlineStyles = block.styles.inlineStyles || '';
        if (/display\s*:\s*none/i.test(inlineStyles)) {
            return true;
        }

        // Check custom CSS for display: none patterns
        const customCss = block.styles.customCss || '';
        if (/display\s*:\s*none/i.test(customCss)) {
            return true;
        }

        return false;
    }

    /**
     * Get display name for a block
     */
    getBlockDisplayName(block: BlockInstance): string {
        const manifest = this.registry.getManifest(block.type);
        return manifest?.displayName || block.type || 'Block';
    }
}
