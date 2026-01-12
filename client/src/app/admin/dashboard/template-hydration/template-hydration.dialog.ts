import { Component, EventEmitter, Input, Output, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BoardingTemplate, TemplateVariable } from '../../../shared/models/template.types';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';

@Component({
  selector: 'app-template-hydration',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in">
      <div class="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700 flex flex-col">
        
        <!-- Header -->
        <div class="p-6 pb-0">
           <button (click)="cancel.emit()" class="mb-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1 text-sm font-medium transition-colors">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            Back to Gallery
           </button>
           <h2 class="text-2xl font-bold font-display text-slate-900 dark:text-white">Configure {{ template.name }}</h2>
           <p class="text-slate-500 dark:text-slate-400 text-sm mt-1">Fill in the details below to personalize your page.</p>
        </div>

        <!-- Form -->
        <div class="p-6 space-y-5">
          <!-- Standard Page Title/Slug inputs removed for Multi-Page Theme gen -->
          <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl text-sm text-blue-700 dark:text-blue-300">
            This theme will generate a set of pages (Home, About, etc.) automatically.
          </div>

          <!-- Theme Name -->
          <div class="space-y-1.5">
            <label class="text-sm font-semibold text-slate-700 dark:text-slate-300">Theme Name <span class="text-red-500">*</span></label>
            <input type="text" [(ngModel)]="themeName" 
              class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
              placeholder="e.g., Summer Campaign 2024">
          </div>

          <div class="h-px bg-slate-100 dark:bg-slate-800 my-2"></div>

          <!-- Template Variables -->
          @for (variable of template.variables; track variable.key) {
            <div class="space-y-1.5">
              <label class="text-sm font-semibold text-slate-700 dark:text-slate-300">{{ variable.label }}</label>
              <input 
                [type]="variable.type || 'text'" 
                [ngModel]="variables[variable.key] || variable.defaultValue"
                (ngModelChange)="variables[variable.key] = $event"
                class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                [placeholder]="variable.defaultValue">
            </div>
          }
        </div>

        <!-- Footer -->
        <div class="p-6 pt-2 flex gap-3 mt-auto">
          <button (click)="cancel.emit()" class="flex-1 px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
            Cancel
          </button>
          <button (click)="onConfirm()" 
            [disabled]="isCreating"
            class="flex-[2] px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            <span *ngIf="isCreating">Creating Theme...</span>
            <span *ngIf="!isCreating">Create Theme</span>
             <svg *ngIf="!isCreating" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </button>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.2s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
  `]
})
export class TemplateHydrationDialog implements OnInit {
  @Input() template!: BoardingTemplate;
  @Output() cancel = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<{ themeName: string, variables: Record<string, string> }>();

  // pageTitle = '';
  // slug = '';
  themeName = '';
  variables: Record<string, string> = {};
  isCreating = false;

  ngOnInit() {
    // Auto-fill defaults
    if (this.template) {
      this.template.variables.forEach(v => {
        this.variables[v.key] = v.defaultValue;
      });
      this.themeName = `My ${this.template.name}`;
      // Auto-generate slug from unique timestamp to avoid collision during extensive testing
      // this.slug = this.template.id + '-' + Math.floor(Date.now() / 1000).toString().substring(5);
      // this.pageTitle = 'My ' + this.template.name;
    }
  }

  isValid(): boolean {
    return !!this.themeName && !this.isCreating;
  }

  onConfirm() {
    // if (!this.isValid()) return;
    this.isCreating = true;
    this.confirm.emit({
      themeName: this.themeName,
      variables: this.variables
    });
  }
}
