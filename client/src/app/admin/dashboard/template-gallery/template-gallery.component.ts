import { Component, EventEmitter, Output, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplateService } from '../../services/template.service';
import { BoardingTemplate } from '../../../shared/models/template.types';

@Component({
  selector: 'app-template-gallery',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 animate-fade-in">
      <div class="bg-white dark:bg-slate-900 w-full max-w-6xl h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-700">
        
        <!-- Header -->
        <div class="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
          <div>
            <h2 class="text-3xl font-display font-bold text-slate-900 dark:text-white mb-2">
              Choose a Template
            </h2>
            <p class="text-slate-500 dark:text-slate-400">
              Select a starting point for your new page. You can customize everything later.
            </p>
          </div>
          <button (click)="close.emit()" class="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <svg class="w-6 h-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto p-8 custom-scrollbar">
          
          <!-- Filter Tabs -->
          <div class="flex gap-4 mb-8 overflow-x-auto pb-2">
            @for (cat of categories; track cat) {
              <button 
                (click)="activeCategory.set(cat)"
                class="px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border"
                [ngClass]="activeCategory() === cat 
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-lg scale-105' 
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500'">
                {{ cat }}
              </button>
            }
          </div>

          <!-- Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            @for (template of filteredTemplates(); track template.id) {
              <div class="group relative bg-slate-50 dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-2 cursor-pointer"
                   (click)="select.emit(template)">
                
                <!-- Thumbnail -->
                <div class="aspect-[4/3] relative overflow-hidden bg-slate-200 dark:bg-slate-700">
                  <img [src]="template.thumbnail" 
                       (error)="handleImageError($event)"
                       class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                       alt="{{ template.name }}">
                  
                  <!-- Overlay -->
                  <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <span class="text-white font-semibold flex items-center gap-2">
                      Use this template 
                      <svg class="w-4 h-4 translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                    </span>
                  </div>
                </div>

                <!-- Info -->
                <div class="p-6">
                  <div class="flex justify-between items-start mb-2">
                    <h3 class="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {{ template.name }}
                    </h3>
                    <span class="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      {{ template.category }}
                    </span>
                  </div>
                  <p class="text-slate-500 dark:text-slate-400 text-sm line-clamp-2">
                    {{ template.description }}
                  </p>
                </div>
              </div>
            } @empty {
              <div class="col-span-full flex flex-col items-center justify-center py-20 text-center">
                 <div class="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                    <svg class="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
                 </div>
                 <p class="text-slate-500 dark:text-slate-400 font-medium">No templates found for this category.</p>
              </div>
            }
          </div>

        </div>
      </div>
    </div>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 6px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(156, 163, 175, 0.3); border-radius: 20px; }
    .animate-fade-in { animation: fadeIn 0.3s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
  `]
})
export class TemplateGalleryComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() select = new EventEmitter<BoardingTemplate>();

  templates = signal<BoardingTemplate[]>([]);
  activeCategory = signal<string>('All');

  categories = ['All', 'Corporate', 'Portfolio', 'Landing', 'E-commerce', 'SaaS'];

  constructor(private templateService: TemplateService) { }

  ngOnInit() {
    this.templateService.getTemplates().subscribe({
      next: (data) => this.templates.set(data),
      error: (err) => console.error('Failed to load templates', err)
    });
  }

  filteredTemplates() {
    const cat = this.activeCategory();
    if (cat === 'All') return this.templates();
    return this.templates().filter(t => t.category === cat);
  }

  handleImageError(event: any) {
    // Fallback placeholder
    event.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MCA0MCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2YzZjRZjYiLz48L3N2Zz4=';
    // Just a gray box
    event.target.classList.add('opacity-50', 'grayscale');
  }
}
