
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem, CdkDragEnter, CdkDragExit } from '@angular/cdk/drag-drop';
import { MenuService, MenuItem, SocialLink } from '../../core/services/menu.service';
import { MenuItemEditorComponent } from './menu-item-editor.component';
import { Subject, of, forkJoin, merge, concat } from 'rxjs';
import { takeUntil, switchMap, tap, catchError, map, finalize, timeout } from 'rxjs/operators';

@Component({
  selector: 'app-menu-builder',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule, MenuItemEditorComponent],
  template: `
    <div class="relative min-h-[calc(100vh-4rem)]">
      <!-- Page Header -->
      <div class="admin-page-header mb-6">
        <div>
           <h1 class="admin-page-title">{{ getTitle() }}</h1>
           <p class="text-slate-500 text-sm mt-1">Manage your website navigation and links</p>
        </div>
        <div class="flex gap-2 items-center">
            <span *ngIf="saveStatus" 
                  [class.text-green-600]="saveStatus.type === 'success'"
                  [class.text-red-600]="saveStatus.type === 'error'"
                  class="text-sm font-medium animate-fade-in-out">
                <i [class]="saveStatus.type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'"></i>
                {{ saveStatus.message }}
            </span>
          <button class="btn btn-secondary" (click)="reload()" [disabled]="loading">
             <i class="fas fa-sync-alt mr-2" [class.fa-spin]="loading"></i> Refresh
          </button>
          <button class="btn btn-primary" (click)="save()" [disabled]="loading || saving">
             {{ saving ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex border-b border-slate-200 mb-6">
        <button (click)="activeTab = 'structure'" 
                [class.border-blue-500]="activeTab === 'structure'" 
                [class.text-blue-600]="activeTab === 'structure'"
                class="px-6 py-3 border-b-2 border-transparent font-medium hover:text-blue-500 transition-colors">
            Menu Structure
        </button>
        <button (click)="activeTab = 'social'"
                [class.border-blue-500]="activeTab === 'social'" 
                [class.text-blue-600]="activeTab === 'social'"
                class="px-6 py-3 border-b-2 border-transparent font-medium hover:text-blue-500 transition-colors">
            Social Links
        </button>
      </div>
      
      <!-- TAB: Menu Structure -->
      <div *ngIf="activeTab === 'structure'" class="max-w-4xl relative">
         <!-- Loading Overlay -->
         <div *ngIf="loading" class="absolute inset-0 bg-white/80 z-10 flex items-center justify-center rounded-lg border border-slate-100 min-h-[400px]">
            <div class="flex flex-col items-center gap-3">
                <i class="fas fa-circle-notch fa-spin text-3xl text-blue-500"></i>
                <span class="text-slate-500 font-medium">Loading menu...</span>
            </div>
         </div>

         <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6 min-h-[400px]" [class.opacity-50]="loading" cdkDropListGroup>
            
            <!-- Recursive Template for Menu Tree -->
            <ng-template #nodeTemplate let-nodes="nodes" let-level="level">
                <div cdkDropList 
                     [cdkDropListData]="nodes"
                     (cdkDropListDropped)="drop($event)"
                     [id]="'list-' + level"
                     class="min-h-[10px] space-y-2">
                    
                    <div *ngFor="let node of nodes; let i = index; trackBy: trackByNode" cdkDrag [cdkDragData]="node"
                         class="bg-white border rounded-lg shadow-sm group">
                        
                        <!-- Drag Placeholder -->
                        <div *cdkDragPlaceholder class="min-h-[50px] bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg"></div>

                        <!-- Node Heading -->
                        <div class="p-3 flex items-center gap-3 bg-white hover:bg-slate-50 transition-colors rounded-lg">
                            <span cdkDragHandle class="text-slate-400 cursor-grab active:cursor-grabbing p-2 hover:bg-slate-100 rounded"><i class="fas fa-grip-vertical"></i></span>
                            
                            <!-- Icon -->
                            <span *ngIf="node.icon" class="text-slate-500 w-6 text-center"><i [class]="node.icon"></i></span>
                            
                            <!-- Content -->
                            <div class="flex-1">
                                <span class="font-medium text-slate-800">{{ node.label || 'Untitled' }}</span>
                                <span class="text-xs text-slate-400 ml-2 font-mono" *ngIf="node.link">
                                    {{ node.link }} 
                                    <i *ngIf="node.link_type === 'external'" class="fas fa-external-link-alt ml-1 text-[10px]"></i>
                                </span>
                            </div>

                            <!-- Controls -->
                            <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button (click)="editItem(node)" class="p-1.5 text-blue-500 hover:bg-blue-50 rounded" title="Edit">
                                    <i class="fas fa-pencil-alt"></i>
                                </button>
                                <button (click)="remove(nodes, i, $event)" class="p-1.5 text-red-500 hover:bg-red-50 rounded" title="Delete">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>

                        <!-- Children (Nested) - Only if level < 3 -->
                        <div class="pl-8 pr-3 pb-3" *ngIf="level < 3">
                            <ng-container *ngTemplateOutlet="nodeTemplate; context: { nodes: node.children, level: level + 1 }"></ng-container>
                        </div>
                    </div>
                </div>
            </ng-template>

            <!-- Root List -->
            <ng-container *ngTemplateOutlet="nodeTemplate; context: { nodes: items, level: 1 }"></ng-container>

            <!-- Add Button -->
            <button (click)="add()" class="mt-4 w-full py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-blue-400 hover:text-blue-500 transition-colors font-medium flex items-center justify-center gap-2">
                <i class="fas fa-plus"></i> Add Top Level Item
            </button>
         </div>
         
         <div class="mt-4 bg-blue-50 border border-blue-200 rounded-md p-4 text-sm text-blue-700">
            <p><i class="fas fa-info-circle mr-2"></i> <strong>Tip:</strong> You can nest items up to 3 levels deep. Drag items to reorder.</p>
         </div>
      </div>

      <!-- TAB: Social Links -->
      <div *ngIf="activeTab === 'social'" class="max-w-4xl">
         <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Active Links -->
            <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <h3 class="font-bold text-lg mb-4 text-slate-800">Active Social Links</h3>
                <div cdkDropList (cdkDropListDropped)="dropSocial($event)" class="space-y-3">
                    <div *ngFor="let link of socialLinks; let i = index; trackBy: trackByLink" cdkDrag class="flex items-center gap-3 p-3 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <span class="text-slate-400 cursor-grab"><i class="fas fa-grip-vertical"></i></span>
                        <div class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 text-lg">
                            <img *ngIf="link.icon_path" [src]="link.icon_path" class="w-6 h-6 object-contain">
                            <i *ngIf="!link.icon_path" [class]="getIconClass(link.platform)"></i>
                        </div>
                        <div class="flex-1">
                             <input [(ngModel)]="link.url" placeholder="https://..." class="w-full text-sm border-0 border-b border-transparent focus:border-blue-500 focus:ring-0 px-0 py-1 bg-transparent transition-colors" />
                             <span class="text-xs text-slate-400 uppercase font-bold tracking-wider">{{ link.platform }}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" [(ngModel)]="link.is_active" class="sr-only peer">
                                <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                            <button (click)="removeSocial(i, $event)" class="text-red-400 hover:text-red-500 p-1"><i class="fas fa-times"></i></button>
                        </div>
                    </div>
                </div>
                
                <div class="mt-4 pt-4 border-t border-slate-100">
                    <button (click)="addSocial()" class="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-2">
                        <i class="fas fa-plus-circle"></i> Add Another Link
                    </button>
                </div>
            </div>

            <!-- Preview / Instructions -->
            <div class="space-y-6">
                <div class="bg-indigo-50 border border-indigo-100 rounded-lg p-6">
                    <h4 class="font-bold text-indigo-900 mb-2">Supported Platforms</h4>
                    <div class="flex flex-wrap gap-2">
                        <span class="px-2 py-1 bg-white rounded text-xs text-slate-600 border" *ngFor="let p of ['facebook','twitter','instagram','linkedin','youtube','github']">{{p}}</span>
                    </div>
                    <p class="text-sm text-indigo-700 mt-3">Simply add a link and select the platform. Icons are automatically assigned for standard platforms.</p>
                </div>
            </div>
         </div>
      </div>

      <!-- Edit Side Drawer -->
      <app-menu-item-editor 
        [item]="editingItem" 
        [isOpen]="!!editingItem" 
        (closeEvent)="closeEditor()">
      </app-menu-item-editor>

      <!-- Custom Confirmation Modal -->
      <div *ngIf="deleteState" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
        <div class="bg-white rounded-lg shadow-xl max-w-sm w-full p-6 animate-scale-in">
          <div class="flex items-center gap-3 text-red-600 mb-4">
             <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
               <i class="fas fa-exclamation-triangle"></i>
             </div>
             <h3 class="text-lg font-bold text-slate-800">Confirm Deletion</h3>
          </div>
          
          <p class="text-slate-600 mb-6 text-sm">
            Are you sure you want to delete this item? 
            <span *ngIf="deleteState.type === 'item'">This action will also remove all nested children.</span>
             This action cannot be undone.
          </p>

          <div class="flex gap-2 justify-end">
            <button (click)="cancelDelete()" class="px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md font-medium transition-colors">
              Cancel
            </button>
            <button (click)="confirmDelete()" class="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md font-medium transition-colors shadow-sm">
              Delete
            </button>
          </div>
        </div>
      </div>

    </div>
  `
})
export class MenuBuilderComponent implements OnInit, OnDestroy {
  items: MenuItem[] = [];
  socialLinks: SocialLink[] = [];

  menuCode: string = 'main';
  activeTab: 'structure' | 'social' = 'structure';

  editingItem: MenuItem | null = null;
  loading = false;
  saving = false;

  // Custom Delete State
  deleteState: { type: 'item' | 'social', list: any[], index: number } | null = null;


  private refresh$ = new Subject<void>();
  private destroy$ = new Subject<void>();

  constructor(
    private menuService: MenuService,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    const paramsStream$ = this.route.params.pipe(
      map(params => params['code'] || 'main'),
      tap(code => {
        this.menuCode = code;
        this.cd.markForCheck();
      })
    );

    const refreshStream$ = this.refresh$.pipe(
      map(() => this.menuCode)
    );

    merge(paramsStream$, refreshStream$).pipe(
      takeUntil(this.destroy$),
      tap(() => {
        this.loading = true;
        this.editingItem = null;
        this.cd.markForCheck();
      }),
      switchMap(code => {
        return forkJoin({
          menu: this.menuService.getMenu(code).pipe(catchError(error => {
            console.error('Error loading menu:', error);
            return of({ items: [] });
          })),
          social: this.menuService.getSocialLinks().pipe(catchError(error => {
            console.error('Error loading social links:', error);
            return of([]);
          }))
        });
      })
    ).subscribe({
      next: (data) => {
        this.items = data.menu.items || [];
        this.socialLinks = data.social as SocialLink[];
        this.loading = false;
        this.cd.markForCheck();
      },
      error: (err) => {
        console.error('Unexpected error in menu loading stream:', err);
        this.loading = false;
        this.cd.markForCheck();
      }
    });

  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getTitle(): string {
    return this.menuCode === 'main' ? 'Header Navigation' :
      this.menuCode === 'footer' ? 'Footer Navigation' :
        'Menu Editor';
  }

  reload() {
    this.refresh$.next();
  }

  // --- Tree Logic ---

  add() {
    this.items.push({ label: 'New Item', link: '/', children: [], is_visible: true, link_type: 'internal' });
  }

  addSocial() {
    this.socialLinks.push({ platform: 'custom', name: 'Link', url: '', is_active: true });
  }

  remove(list: MenuItem[], index: number, event: Event) {
    event.stopPropagation();
    event.preventDefault();
    this.deleteState = { type: 'item', list, index };
  }

  removeSocial(index: number, event: Event) {
    event.stopPropagation();
    event.preventDefault();
    this.deleteState = { type: 'social', list: this.socialLinks, index };
  }

  confirmDelete() {
    if (this.deleteState) {
      this.deleteState.list.splice(this.deleteState.index, 1);
      this.deleteState = null;
      this.cd.markForCheck();
    }
  }

  cancelDelete() {
    this.deleteState = null;
  }

  editItem(item: MenuItem) {
    this.editingItem = item;
  }

  closeEditor() {
    this.editingItem = null;
  }

  // Drag & Drop
  // Note: For simple nested lists without connectedTo IDs fully managed, 
  // CDK allows reordering within same list easily. 
  // Moving between lists requires connectedTo which is circular in recursive templates.
  // A simple hack for 3 levels is just to allow reorder within same parent.
  // If user wants to "move to other parent", they might need explicit Move action if drag is limited.
  // BUT, we can try to enable cross-level dragging by grouping IDs.
  // For now, let's implement standard drop which works for reordering safely.
  // Supporting full nested DnD recursively is slightly involved.
  drop(event: CdkDragDrop<MenuItem[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  dropSocial(event: CdkDragDrop<SocialLink[]>) {
    moveItemInArray(this.socialLinks, event.previousIndex, event.currentIndex);
  }

  // --- Utils ---

  getIconClass(platform: string): string {
    const map: Record<string, string> = {
      facebook: 'fab fa-facebook',
      twitter: 'fab fa-twitter',
      x: 'fab fa-x-twitter',
      instagram: 'fab fa-instagram',
      linkedin: 'fab fa-linkedin',
      youtube: 'fab fa-youtube',
      github: 'fab fa-github'
    };
    return map[platform.toLowerCase()] || 'fas fa-link';
  }

  trackByNode(index: number, node: MenuItem): any {
    return node.id || index;
  }

  trackByLink(index: number, link: SocialLink): any {
    return link.id || index;
  }

  saveStatus: { type: 'success' | 'error', message: string } | null = null;

  save() {
    this.saving = true;
    this.saveStatus = null;
    this.cd.markForCheck();

    // Use concat to run requests sequentially to avoid SQLite locking (SQLITE_BUSY)
    concat(
      this.menuService.saveMenu(this.menuCode, this.items),
      this.menuService.saveSocialLinks(this.socialLinks)
    ).pipe(
      // We collect all results but really just want to know when both are done or if one failed.
      // concat emits twice.
      timeout(10000),
      finalize(() => {
        this.saving = false;
        this.cd.detectChanges();
      })
    ).subscribe({
      next: () => {
        // This runs for each completion. We only want to show success once?
        // Or we can just wait for complete.
        // Actually, forkJoin is better IF we can handle concurrency. 
        // But concat emits for each.
      },
      complete: () => {
        this.saveStatus = { type: 'success', message: 'Saved successfully!' };
        this.cd.detectChanges();
        setTimeout(() => {
          this.saveStatus = null;
          this.cd.detectChanges();
        }, 3000);
      },
      error: (err) => {
        console.error('Failed to save:', err);
        this.saveStatus = { type: 'error', message: 'Error saving changes. Please try again.' };
        this.cd.detectChanges();
      }
    });
  }
}
