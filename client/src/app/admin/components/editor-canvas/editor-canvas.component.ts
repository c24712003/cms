import { Component, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';

import { BlockInstance, ContentBlockManifest } from '../../../features/content-blocks/block.types';
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
    `],
    template: `
        <!-- Center: Canvas -->
        <main class="flex-1 bg-slate-100 dark:bg-slate-900 overflow-y-auto p-8 flex justify-center" (click)="clearSelection($event)">
            <div class="transition-all duration-300 ease-in-out shadow-2xl bg-white min-h-[800px] relative"
                 [ngClass]="{
                    'w-full': viewport === 'desktop',
                    'w-[768px]': viewport === 'tablet',
                    'w-[375px]': viewport === 'mobile'
                 }"
                 (click)="$event.stopPropagation()">
                 
                 <div cdkDropList 
                      [cdkDropListData]="blocks" 
                      (cdkDropListDropped)="drop($event)"
                      class="min-h-full pb-32">
                      
                    <div *ngFor="let block of blocks; let i = index; trackBy: trackBlockId" 
                         cdkDrag
                         class="group relative hover:ring-2 hover:ring-blue-400/50 transition-all"
                         [class.ring-2]="selectedBlock?.id === block.id"
                         [class.ring-blue-500]="selectedBlock?.id === block.id"
                         [class.z-20]="selectedBlock?.id === block.id">
                         
                        <!-- Drag Handle (Left) -->
                        <div class="absolute left-0 top-0 bottom-0 w-8 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-move z-20 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-l-xl transition-all" cdkDragHandle>
                            <svg class="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="currentColor"><path d="M7 19h2v2H7zM7 15h2v2H7zM7 11h2v2H7zM7 7h2v2H7zM11 19h2v2h-2zM11 15h2v2h-2zM11 11h2v2h-2zM11 7h2v2h-2zM15 19h2v2h-2zM15 15h2v2h-2zM15 11h2v2h-2zM15 11h2v2h-2zM15 7h2v2h-2z"/></svg>
                        </div>
                        
                        <!-- Remove Button (Right) -->
                        <button (click)="removeBlock(block, $event)" class="absolute -right-3 -top-3 bg-white dark:bg-slate-700 text-slate-400 hover:text-red-500 shadow-sm border border-slate-200 dark:border-slate-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all z-30 hover:scale-110">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>

                        <!-- Rendered Block -->
                        <div (click)="selectBlock(block, $event)" class="cursor-pointer">
                            <app-dynamic-block-renderer [block]="block"></app-dynamic-block-renderer>
                        </div>
                    </div>

                    <!-- Empty State -->
                    <div *ngIf="blocks.length === 0" class="h-64 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 m-8 rounded-xl text-slate-400">
                        <svg class="w-12 h-12 mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                        <p>Drag blocks here or add one to start</p>
                    </div>

                 </div>
            </div>

            <!-- Floating Add Button (Mobile/Quick) -->
            <button class="fixed bottom-8 right-8 md:hidden btn btn-circle btn-primary shadow-xl z-40" (click)="showBlockPicker = true; $event.stopPropagation()">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            </button>
        </main>

        <!-- Right: Block Toolbar -->
        <aside class="absolute inset-y-0 right-0 z-30 w-full md:w-80 transition-transform duration-300 md:static md:z-auto h-full border-l border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
               [class.translate-x-0]="selectedBlock"
               [class.translate-x-full]="!selectedBlock"
               [class.hidden]="!selectedBlock && !isMobile()"> 
             
             <app-block-toolbar
                *ngIf="selectedBlock"
                [block]="selectedBlock"
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
    @Input() blocks: BlockInstance[] = [];
    @Output() blocksChange = new EventEmitter<BlockInstance[]>();

    @Input() selectedBlock: BlockInstance | null = null;
    @Output() selectedBlockChange = new EventEmitter<BlockInstance | null>();

    showBlockPicker = false;
    viewport: 'desktop' | 'tablet' | 'mobile' = 'desktop';

    constructor(private registry: BlockRegistryService) { }

    get availableBlocks(): ContentBlockManifest[] {
        // Quick list for now, same as PageEditor
        const types = [
            'page-hero', 'timeline-steps', 'case-study-showcase',
            'hero-carousel', 'feature-grid', 'card-carousel',
            'stats-counter', 'cta-banner', 'faq-accordion',
            'contact-form-cta', 'content-with-image',
            'parallax-hero', 'text-block'
        ];
        return types.map(t => this.registry.getDefinition(t)?.manifest).filter(Boolean) as ContentBlockManifest[];
    }

    isMobile(): boolean {
        return window.innerWidth < 768;
    }

    clearSelection(event?: Event) {
        if (this.selectedBlock) {
            this.selectedBlock = null;
            this.selectedBlockChange.emit(null);
        }
    }

    selectBlock(block: BlockInstance, event: MouseEvent) {
        event.stopPropagation();
        this.selectedBlock = block;
        this.selectedBlockChange.emit(block);
    }

    drop(event: CdkDragDrop<BlockInstance[]>) {
        moveItemInArray(this.blocks, event.previousIndex, event.currentIndex);
        this.blocksChange.emit(this.blocks);
    }

    trackBlockId(index: number, block: BlockInstance) {
        return block.id;
    }

    removeBlock(block: BlockInstance, event?: Event) {
        if (event) event.stopPropagation();
        const index = this.blocks.indexOf(block);
        if (index > -1) {
            this.blocks.splice(index, 1);
            if (this.selectedBlock === block) {
                this.selectedBlock = null;
                this.selectedBlockChange.emit(null);
            }
            this.blocksChange.emit(this.blocks);
        }
    }

    addBlock(type: string) {
        const newBlock: BlockInstance = {
            id: Math.random().toString(36).substr(2, 9),
            type: type,
            data: {}
        };
        this.blocks.push(newBlock);
        this.blocksChange.emit(this.blocks);

        this.selectedBlock = newBlock;
        this.selectedBlockChange.emit(newBlock);

        this.showBlockPicker = false;
    }

    updateBlock(updatedBlock: BlockInstance) {
        if (!this.selectedBlock) return;

        // Update in array
        const index = this.blocks.findIndex(b => b.id === updatedBlock.id);
        if (index > -1) {
            this.blocks[index] = updatedBlock;
            this.blocksChange.emit(this.blocks);
        }

        // Update active selection reference
        this.selectedBlock = updatedBlock;
        this.selectedBlockChange.emit(updatedBlock);
    }

    updateBlockData(newData: any) {
        if (this.selectedBlock) {
            // Create new immutable reference with updated data
            const updatedBlock = {
                ...this.selectedBlock,
                data: { ...newData }
            };

            // Update in array
            const index = this.blocks.findIndex(b => b.id === updatedBlock.id);
            if (index > -1) {
                this.blocks[index] = updatedBlock;
                this.blocksChange.emit(this.blocks);
            }

            // Update active selection reference
            this.selectedBlock = updatedBlock;
            this.selectedBlockChange.emit(updatedBlock);
        }
    }

    getBlockSchema(type: string) {
        return this.registry.getDefinition(type)?.manifest.schema;
    }
}
