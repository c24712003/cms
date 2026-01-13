import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem, CdkDragEnter, CdkDragExit } from '@angular/cdk/drag-drop';
import { MenuService, MenuItem, SocialLink } from '../../core/services/menu.service';
import { MenuItemEditorComponent } from './menu-item-editor.component';
import { Subject, of, forkJoin, merge, concat } from 'rxjs';
import { takeUntil, switchMap, tap, catchError, map, finalize, timeout } from 'rxjs/operators';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { I18nService } from '../../core/services/i18n.service';

@Component({
  selector: 'app-menu-builder',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule, MenuItemEditorComponent, TranslatePipe],
  template: `
    <div class="relative min-h-[calc(100vh-4rem)] max-w-7xl mx-auto">
      <!-- Page Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
           <h1 class="text-2xl font-bold text-slate-800 dark:text-white">{{ getTitle() | translate }}</h1>
           <p class="text-slate-500 dark:text-slate-400 text-sm mt-1">{{ 'MENU_SUBTITLE' | translate }}</p>
        </div>
        <div class="flex flex-wrap gap-2 items-center w-full md:w-auto">
            <span *ngIf="saveStatus" 
                  [class.text-green-600]="saveStatus.type === 'success'"
                  [class.text-red-600]="saveStatus.type === 'error'"
                  class="text-sm font-medium animate-fade-in-out mr-2 hidden sm:inline">
                <i [class]="saveStatus.type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'"></i>
                {{ saveStatus.message | translate }}
            </span>
          <button class="btn btn-secondary flex-1 md:flex-none justify-center" (click)="reload()" [disabled]="loading">
             <i class="fas fa-sync-alt mr-2" [class.fa-spin]="loading"></i> {{ 'BTN_REFRESH' | translate }}
          </button>
          <button class="btn btn-primary flex-1 md:flex-none justify-center" (click)="save()" [disabled]="loading || saving">
             {{ (saving ? 'BTN_SAVING' : 'BTN_SAVE_CHANGES') | translate }}
          </button>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex border-b border-slate-200 dark:border-slate-700 mb-6 overflow-x-auto no-scrollbar">
        <button (click)="activeTab = 'structure'" 
                [class.border-blue-500]="activeTab === 'structure'" 
                [class.text-blue-600]="activeTab === 'structure'"
                class="px-4 sm:px-6 py-3 border-b-2 border-transparent font-medium hover:text-blue-500 transition-colors whitespace-nowrap text-slate-600 dark:text-slate-300">
            {{ 'TAB_STRUCTURE' | translate }}
        </button>
        <button (click)="activeTab = 'social'"
                [class.border-blue-500]="activeTab === 'social'" 
                [class.text-blue-600]="activeTab === 'social'"
                class="px-4 sm:px-6 py-3 border-b-2 border-transparent font-medium hover:text-blue-500 transition-colors whitespace-nowrap text-slate-600 dark:text-slate-300">
            {{ 'TAB_SOCIAL' | translate }}
        </button>
      </div>
      
       <!-- Main Content Area -->
       <div class="relative">
         <!-- Loading Overlay -->
         <div *ngIf="loading" class="absolute inset-0 bg-white/80 dark:bg-slate-900/80 z-20 flex items-center justify-center rounded-lg backdrop-blur-sm min-h-[400px]">
            <div class="flex flex-col items-center gap-3">
                <i class="fas fa-circle-notch fa-spin text-3xl text-blue-500"></i>
                <span class="text-slate-500 dark:text-slate-400 font-medium">{{ 'LOADING_DATA' | translate }}</span>
            </div>
         </div>

         <!-- === VIEW A: Standard Vertical Tree (Non-Footer) === -->
         <ng-container *ngIf="menuCode !== 'footer'">
             <div class="max-w-4xl bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4 sm:p-6 min-h-[400px]" cdkDropListGroup>
                
                <!-- Recursive Template (Legacy Tree) -->
                <ng-template #nodeTemplate let-nodes="nodes" let-level="level">
                    <div cdkDropList 
                         [cdkDropListData]="nodes"
                         (cdkDropListDropped)="drop($event)"
                         [id]="'list-' + level"
                         class="min-h-[10px] space-y-2">
                        
                        <div *ngFor="let node of nodes; let i = index; trackBy: trackByNode" cdkDrag [cdkDragData]="node"
                             class="bg-white dark:bg-slate-700 border dark:border-slate-600 rounded-lg shadow-sm group touch-manipulation">
                            
                            <div *cdkDragPlaceholder class="min-h-[50px] bg-slate-100 dark:bg-slate-700 border-2 border-dashed border-slate-300 dark:border-slate-500 rounded-lg"></div>

                            <div class="p-3 flex flex-wrap sm:flex-nowrap items-center gap-3 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors rounded-lg">
                                <span cdkDragHandle class="text-slate-400 dark:text-slate-500 cursor-grab active:cursor-grabbing p-2 hover:bg-slate-100 dark:hover:bg-slate-600 rounded touch-none"><i class="fas fa-grip-vertical text-lg"></i></span>
                                <span *ngIf="node.icon" class="text-slate-500 dark:text-slate-400 w-6 text-center hidden sm:block"><i [class]="node.icon"></i></span>
                                <div class="flex-1 min-w-[150px]">
                                    <span class="font-medium text-slate-800 dark:text-white block sm:inline">
                                        {{ (node.labelKey ? (node.labelKey | translate) : node.label) || 'Untitled' }}
                                        <span *ngIf="node.link_type && node.link_type.includes('widget')" class="ml-2 px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 text-xs font-bold uppercase tracking-wider">
                                            {{ node.link_type?.replace('-widget', '') }}
                                        </span>
                                    </span>
                                    
                                    <span class="text-xs text-slate-400 sm:ml-2 font-mono block sm:inline" *ngIf="node.link && !node.link_type?.includes('widget')">
                                        {{ node.link }} 
                                        <i *ngIf="node.link_type === 'external'" class="fas fa-external-link-alt ml-1 text-[10px]"></i>
                                    </span>
                                </div>
                                <div class="flex gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity ml-auto sm:ml-0">
                                    <button (click)="editItem(node)" class="p-2 text-blue-500 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded" title="Edit"><i class="fas fa-pencil-alt"></i></button>
                                    <button (click)="remove(nodes, i, $event)" class="p-2 text-red-500 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 rounded" title="Delete"><i class="fas fa-trash"></i></button>
                                </div>
                            </div>

                            <div class="pl-4 sm:pl-8 pr-2 sm:pr-3 pb-3" *ngIf="level < 3">
                                <ng-container *ngTemplateOutlet="nodeTemplate; context: { nodes: node.children, level: level + 1 }"></ng-container>
                            </div>
                        </div>
                    </div>
                </ng-template>

                <ng-container *ngTemplateOutlet="nodeTemplate; context: { nodes: items, level: 1 }"></ng-container>
                
                <button (click)="add()" class="mt-4 w-full py-3 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-slate-500 dark:text-slate-400 hover:border-blue-400 hover:text-blue-500 transition-colors font-medium flex items-center justify-center gap-2 active:bg-slate-50 dark:active:bg-slate-700">
                    <i class="fas fa-plus"></i> {{ 'BTN_ADD_TOP_LEVEL' | translate }}
                </button>
             </div>
         </ng-container>

         <!-- === VIEW B: Horizontal Board (Footer) === -->
         <div *ngIf="menuCode === 'footer'" class="overflow-x-auto pb-6" cdkDropListGroup>
            <div cdkDropList 
                 cdkDropListOrientation="horizontal" 
                 [cdkDropListData]="items" 
                 (cdkDropListDropped)="drop($event)" 
                 class="flex items-start gap-6 min-w-max p-1">
                
                <!-- Draggable Columns (Cards) -->
                <div *ngFor="let node of items; let i = index; trackBy: trackByNode" cdkDrag [cdkDragData]="node"
                     class="w-72 flex-shrink-0 flex flex-col bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 group h-full max-h-[80vh]">
                    
                    <!-- Drag Placeholder (Column) -->
                    <div *cdkDragPlaceholder class="w-72 h-64 bg-slate-100 dark:bg-slate-800/50 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl flex-shrink-0"></div>

                    <!-- Column Header -->
                    <div class="p-3 border-b border-slate-100 dark:border-slate-700 flex items-center gap-2 bg-slate-50 dark:bg-slate-900/50 rounded-t-xl cursor-grab active:cursor-grabbing handle" cdkDragHandle>
                        <i class="fas fa-grip-vertical text-slate-400"></i>
                        
                        <!-- Header Content -->
                        <div class="flex-1 font-semibold text-slate-700 dark:text-slate-200 truncate flex items-center gap-2">
                             <!-- Widget Icon Badge -->
                             <span *ngIf="node.link_type && node.link_type.includes('widget')" 
                                   class="inline-flex items-center justify-center w-6 h-6 rounded bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 text-xs shadow-sm">
                                <i [class]="node.link_type === 'brand-widget' ? 'fas fa-copyright' : node.link_type === 'social-widget' ? 'fas fa-share-alt' : 'fas fa-address-card'"></i>
                             </span>
                             {{ (node.labelKey ? (node.labelKey | translate) : node.label) || 'Untitled' }}
                        </div>

                        <!-- Actions -->
                        <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button (click)="editItem(node)" class="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded text-slate-500 text-xs"><i class="fas fa-pencil-alt"></i></button>
                            <button (click)="remove(items, i, $event)" class="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/30 rounded text-red-500 text-xs"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>

                    <!-- Column Content (Scrollable) -->
                    <div class="flex-1 overflow-y-auto p-3 custom-scrollbar">
                        
                        <!-- CASE 1: Standard Menu Column (Has Children) -->
                        <div *ngIf="!node.link_type || !node.link_type.includes('widget')" class="space-y-2">
                             <div cdkDropList 
                                  [cdkDropListData]="node.children" 
                                  (cdkDropListDropped)="drop($event)" 
                                  class="min-h-[50px] space-y-2">
                                  
                                  <div *ngFor="let child of node.children; let j = index" cdkDrag [cdkDragData]="child"
                                       class="bg-white dark:bg-slate-700 border border-slate-100 dark:border-slate-600 shadow-sm rounded p-2 flex items-center gap-2 text-sm group/child cursor-move hover:border-blue-300 dark:hover:border-blue-500 transition-colors">
                                       <i class="fas fa-grip-lines text-slate-300 dark:text-slate-600 mr-1"></i>
                                       <span class="truncate flex-1 text-slate-600 dark:text-slate-300">
                                           {{ (child.labelKey ? (child.labelKey | translate) : child.label) || 'Untitled' }}
                                       </span>
                                       <button (click)="editItem(child)" class="text-slate-400 hover:text-blue-500 opacity-0 group-hover/child:opacity-100"><i class="fas fa-pencil-alt text-xs"></i></button>
                                       <button (click)="remove(node.children!, j, $event)" class="text-slate-400 hover:text-red-500 opacity-0 group-hover/child:opacity-100"><i class="fas fa-times text-xs"></i></button>
                                  </div>
                                  
                                  <!-- Empty State for Links -->
                                  <div *ngIf="!node.children?.length" class="text-center py-4 border-2 border-dashed border-slate-100 dark:border-slate-700 rounded text-xs text-slate-400">
                                      No links
                                  </div>
                             </div>
                             
                             <button (click)="addLinkToColumn(node)" class="w-full py-2 flex items-center justify-center gap-1.5 text-xs font-medium text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors dashed-border">
                                <i class="fas fa-plus"></i> Add Link
                             </button>
                        </div>

                        <!-- CASE 2: Info Widgets (Static Preview) -->
                        <div *ngIf="node.link_type === 'brand-widget'" class="text-center py-4 opacity-50 select-none">
                            <span class="text-3xl font-bold text-slate-300 block mb-2">CMS</span>
                            <div class="h-2 w-20 bg-slate-200 dark:bg-slate-700 mx-auto rounded mb-1"></div>
                            <div class="h-2 w-16 bg-slate-200 dark:bg-slate-700 mx-auto rounded"></div>
                        </div>

                        <div *ngIf="node.link_type === 'social-widget'" class="flex justify-center flex-wrap gap-2 py-4 opacity-70 cursor-default">
                             <div class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-500"><i class="fab fa-facebook-f"></i></div>
                             <div class="w-8 h-8 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center text-sky-500"><i class="fab fa-twitter"></i></div>
                             <div class="w-8 h-8 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-pink-500"><i class="fab fa-instagram"></i></div>
                        </div>

                        <div *ngIf="node.link_type === 'contact-widget'" class="space-y-2 py-2 opacity-60 text-xs text-slate-500 dark:text-slate-400 select-none">
                            <div class="flex items-center gap-2"><i class="fas fa-map-marker-alt w-4 text-center"></i> <span>123 Tech Park...</span></div>
                            <div class="flex items-center gap-2"><i class="fas fa-envelope w-4 text-center"></i> <span>contact@cms...</span></div>
                            <div class="flex items-center gap-2"><i class="fas fa-phone w-4 text-center"></i> <span>+1 (555)...</span></div>
                        </div>

                    </div>
                </div>

                <!-- Add New Column Button -->
                <div class="w-72 flex-shrink-0">
                    <button class="w-full h-16 border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-blue-400 hover:text-blue-500 text-slate-400 rounded-xl flex items-center justify-center gap-2 font-medium transition-all hover:bg-slate-50 dark:hover:bg-slate-800"
                            [class.ring-2]="isAdding"
                            [class.ring-blue-200]="isAdding"
                             (click)="toggleAddMenu()">
                        <i class="fas fa-plus-circle text-xl"></i>
                        <span>Add Column</span>
                    </button>
                    
                    <!-- Quick Add Menu -->
                    <div *ngIf="isAddMenuOpen" class="mt-4 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-slide-up">
                        <div class="p-2 space-y-1">
                            <button (click)="add(); isAddMenuOpen=false" class="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 flex items-center gap-2">
                                <i class="fas fa-list-ul text-slate-400"></i> Standard Menu
                            </button>
                            <div class="h-px bg-slate-100 dark:bg-slate-700 my-1"></div>
                            <button (click)="addWidget('brand-widget'); isAddMenuOpen=false" class="w-full text-left px-3 py-2 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg text-sm text-purple-700 dark:text-purple-300 flex items-center gap-2">
                                <i class="fas fa-copyright w-4 text-center"></i> Brand Widget
                            </button>
                            <button (click)="addWidget('social-widget'); isAddMenuOpen=false" class="w-full text-left px-3 py-2 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg text-sm text-purple-700 dark:text-purple-300 flex items-center gap-2">
                                <i class="fas fa-share-alt w-4 text-center"></i> Social Widget
                            </button>
                            <button (click)="addWidget('contact-widget'); isAddMenuOpen=false" class="w-full text-left px-3 py-2 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg text-sm text-purple-700 dark:text-purple-300 flex items-center gap-2">
                                <i class="fas fa-address-card w-4 text-center"></i> Contact Widget
                            </button>
                        </div>
                    </div>
                </div>

            </div>
         </div>
       </div>

      <!-- TAB: Social Links -->
      <div *ngIf="activeTab === 'social'" class="max-w-4xl">
         <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Active Links -->
            <div class="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4 sm:p-6">
                <h3 class="font-bold text-lg mb-4 text-slate-800 dark:text-white">{{ 'TAB_SOCIAL' | translate }}</h3>
                <div cdkDropList (cdkDropListDropped)="dropSocial($event)" class="space-y-3">
                    <div *ngFor="let link of socialLinks; let i = index; trackBy: trackByLink" cdkDrag class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3 bg-white dark:bg-slate-700 border dark:border-slate-600 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <div class="flex items-center gap-3">
                             <span class="text-slate-400 dark:text-slate-500 cursor-grab touch-none"><i class="fas fa-grip-vertical text-lg"></i></span>
                             <div class="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-600 flex items-center justify-center text-slate-600 dark:text-slate-300 text-lg shrink-0">
                                 <img *ngIf="link.icon_path" [src]="link.icon_path" class="w-6 h-6 object-contain">
                                 <i *ngIf="!link.icon_path" [class]="getIconClass(link.platform)"></i>
                             </div>
                        </div>
                        
                        <div class="flex-1 min-w-0">
                             <input [(ngModel)]="link.url" placeholder="https://..." class="w-full text-sm border-0 border-b border-slate-200 dark:border-slate-600 focus:border-blue-500 focus:ring-0 px-0 py-1 bg-transparent transition-colors text-slate-800 dark:text-white" />
                             <span class="text-xs text-slate-400 uppercase font-bold tracking-wider">{{ link.platform }}</span>
                        </div>
                        <div class="flex items-center justify-between sm:justify-end gap-2 mt-2 sm:mt-0">
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" [(ngModel)]="link.is_active" class="sr-only peer">
                                <span class="mr-2 text-xs text-slate-500 sm:hidden">Active</span>
                                <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] sm:after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                            <button (click)="removeSocial(i, $event)" class="text-red-400 hover:text-red-500 p-2 bg-red-50 rounded-full"><i class="fas fa-times"></i></button>
                        </div>
                    </div>
                </div>
                
                <div class="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                    <button (click)="addSocial()" class="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-2 w-full justify-center sm:justify-start py-2 sm:py-0">
                        <i class="fas fa-plus-circle"></i> {{ 'BTN_ADD_LINK' | translate }}
                    </button>
                </div>
            </div>

            <!-- Preview / Instructions -->
            <div class="space-y-6">
                <div class="bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 rounded-lg p-6">
                    <h4 class="font-bold text-indigo-900 dark:text-indigo-300 mb-2">{{ 'LABEL_SUPPORTED_PLATFORMS' | translate }}</h4>
                    <div class="flex flex-wrap gap-2">
                        <span class="px-2 py-1 bg-white dark:bg-slate-700 rounded text-xs text-slate-600 dark:text-slate-300 border dark:border-slate-600" *ngFor="let p of ['facebook','twitter','instagram','linkedin','youtube','github']">{{p}}</span>
                    </div>
                    <p class="text-sm text-indigo-700 dark:text-indigo-400 mt-3">{{ 'TIP_PLATFORMS' | translate }}</p>
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
          <div class="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-sm w-full p-6 animate-scale-in">
          <div class="flex items-center gap-3 text-red-600 mb-4">
             <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
               <i class="fas fa-exclamation-triangle"></i>
             </div>
             <h3 class="text-lg font-bold text-slate-800 dark:text-white">{{ 'DIALOG_CONFIRM_DELETE' | translate }}</h3>
          </div>
          
          <p class="text-slate-600 dark:text-slate-400 mb-6 text-sm">
             {{ (deleteState.type === 'item' ? 'MSG_CONFIRM_DELETE_ITEM' : 'MSG_CONFIRM_DELETE_GENERIC') | translate }}
          </p>

          <div class="flex gap-2 justify-end">
            <button (click)="cancelDelete()" class="px-4 py-2 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-md font-medium transition-colors">
              {{ 'BTN_CANCEL' | translate }}
            </button>
            <button (click)="confirmDelete()" class="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md font-medium transition-colors shadow-sm">
              {{ 'BTN_DELETE' | translate }}
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
    private cd: ChangeDetectorRef,
    private i18n: I18nService
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
    return this.menuCode === 'main' ? 'MENU_HEADER_NAV' :
      this.menuCode === 'footer' ? 'MENU_FOOTER_NAV' :
        'MENU_EDITOR_TITLE';
  }

  reload() {
    this.refresh$.next();
  }

  // --- Tree Logic ---

  add() {
    this.items.push({ label: 'New Item', link: '/', children: [], is_visible: true, link_type: 'internal' });
  }

  addWidget(type: 'brand-widget' | 'social-widget' | 'contact-widget') {
    const labels = {
      'brand-widget': 'Brand Information',
      'social-widget': 'Social Links',
      'contact-widget': 'Contact Information'
    };
    this.items.push({
      label: labels[type],
      link: '#',
      children: [],
      is_visible: true,
      link_type: type
    });
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

  addLinkToColumn(parent: MenuItem) {
    if (!parent.children) parent.children = [];
    parent.children.push({ label: 'New Link', link: '/', link_type: 'internal', is_visible: true });
  }

  isAddMenuOpen = false;
  isAdding = false;
  toggleAddMenu() {
    this.isAddMenuOpen = !this.isAddMenuOpen;
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
  drop(event: CdkDragDrop<any>) {
    // If dropping a column in the horizontal list
    if (this.menuCode === 'footer' && event.container.orientation === 'horizontal') {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      return;
    }

    if (event.previousContainer === event.container) {
      if (event.container.data) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      }
    } else {
      if (event.previousContainer.data && event.container.data) {
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex,
        );
      }
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
        this.saveStatus = { type: 'success', message: 'MSG_SAVED_SUCCESS' };
        this.cd.detectChanges();
        setTimeout(() => {
          this.saveStatus = null;
          this.cd.detectChanges();
        }, 3000);
      },
      error: (err) => {
        console.error('Failed to save:', err);
        this.saveStatus = { type: 'error', message: 'MSG_SAVE_ERROR' };
        this.cd.detectChanges();
      }
    });
  }
}
