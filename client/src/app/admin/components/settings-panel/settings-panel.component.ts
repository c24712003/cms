import { Component, input, output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';
import { BlockSettings, BlockAnimation } from '../../../features/content-blocks/block.types';

@Component({
  selector: 'app-settings-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  template: `
    <div class="h-full flex flex-col bg-slate-50 dark:bg-slate-900">
      <div class="flex-1 overflow-y-auto p-4 space-y-6">
        
        <!-- Animation Section -->
        <section class="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          <h4 class="font-bold text-slate-700 dark:text-white text-sm mb-4 flex items-center gap-2">
            <svg class="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"/>
            </svg>
            {{ 'SETTINGS_ANIMATION' | translate }}
          </h4>
          
          <div class="space-y-4">
            <!-- Animation Type -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-medium text-slate-600 dark:text-slate-300">{{ 'SETTINGS_ANIMATION_TYPE' | translate }}</span>
              </label>
              <select 
                [(ngModel)]="settings.animation!.type"
                (ngModelChange)="emitChange()"
                class="select select-bordered w-full dark:bg-slate-700 dark:border-slate-600">
                <option value="none">{{ 'ANIMATION_NONE' | translate }}</option>
                <option value="fade-up">{{ 'ANIMATION_FADE_UP' | translate }}</option>
                <option value="zoom-in">{{ 'ANIMATION_ZOOM_IN' | translate }}</option>
                <option value="slide-right">{{ 'ANIMATION_SLIDE_RIGHT' | translate }}</option>
                <option value="slide-left">{{ 'ANIMATION_SLIDE_LEFT' | translate }}</option>
              </select>
            </div>
            
            <!-- Duration -->
            <div class="form-control" *ngIf="settings.animation?.type !== 'none'">
              <label class="label">
                <span class="label-text font-medium text-slate-600 dark:text-slate-300">{{ 'SETTINGS_ANIMATION_DURATION' | translate }}</span>
                <span class="label-text-alt text-slate-400">{{ settings.animation?.duration || 500 }}ms</span>
              </label>
              <input 
                type="range" 
                [(ngModel)]="settings.animation!.duration"
                (ngModelChange)="emitChange()"
                min="100" 
                max="2000" 
                step="100"
                class="range range-primary range-sm" />
              <div class="flex justify-between text-xs text-slate-400 mt-1">
                <span>100ms</span>
                <span>2000ms</span>
              </div>
            </div>
            
            <!-- Delay -->
            <div class="form-control" *ngIf="settings.animation?.type !== 'none'">
              <label class="label">
                <span class="label-text font-medium text-slate-600 dark:text-slate-300">{{ 'SETTINGS_ANIMATION_DELAY' | translate }}</span>
                <span class="label-text-alt text-slate-400">{{ settings.animation?.delay || 0 }}ms</span>
              </label>
              <input 
                type="range" 
                [(ngModel)]="settings.animation!.delay"
                (ngModelChange)="emitChange()"
                min="0" 
                max="1000" 
                step="50"
                class="range range-secondary range-sm" />
            </div>
            
            <!-- Trigger -->
            <div class="form-control" *ngIf="settings.animation?.type !== 'none'">
              <label class="label">
                <span class="label-text font-medium text-slate-600 dark:text-slate-300">{{ 'SETTINGS_ANIMATION_TRIGGER' | translate }}</span>
              </label>
              <div class="flex gap-2">
                <button 
                  *ngFor="let trigger of animationTriggers"
                  (click)="settings.animation!.trigger = trigger; emitChange()"
                  class="btn btn-sm flex-1"
                  [class.btn-primary]="settings.animation?.trigger === trigger"
                  [class.btn-outline]="settings.animation?.trigger !== trigger">
                  {{ 'TRIGGER_' + trigger.toUpperCase() | translate }}
                </button>
              </div>
            </div>
          </div>
        </section>
        
        <!-- Visibility Section -->
        <section class="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          <h4 class="font-bold text-slate-700 dark:text-white text-sm mb-4 flex items-center gap-2">
            <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
            </svg>
            {{ 'SETTINGS_VISIBILITY' | translate }}
          </h4>
          
          <div class="space-y-3">
            <!-- Hide on Mobile -->
            <label class="flex items-center justify-between cursor-pointer p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <div class="flex items-center gap-3">
                <svg class="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                </svg>
                <span class="text-sm text-slate-600 dark:text-slate-300">{{ 'SETTINGS_HIDE_MOBILE' | translate }}</span>
              </div>
              <input 
                type="checkbox" 
                [(ngModel)]="settings.visibility!.hideOnMobile"
                (ngModelChange)="emitChange()"
                class="toggle toggle-primary toggle-sm" />
            </label>
            
            <!-- Hide on Tablet -->
            <label class="flex items-center justify-between cursor-pointer p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <div class="flex items-center gap-3">
                <svg class="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                </svg>
                <span class="text-sm text-slate-600 dark:text-slate-300">{{ 'SETTINGS_HIDE_TABLET' | translate }}</span>
              </div>
              <input 
                type="checkbox" 
                [(ngModel)]="settings.visibility!.hideOnTablet"
                (ngModelChange)="emitChange()"
                class="toggle toggle-primary toggle-sm" />
            </label>
            
            <!-- Hide on Desktop -->
            <label class="flex items-center justify-between cursor-pointer p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <div class="flex items-center gap-3">
                <svg class="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                <span class="text-sm text-slate-600 dark:text-slate-300">{{ 'SETTINGS_HIDE_DESKTOP' | translate }}</span>
              </div>
              <input 
                type="checkbox" 
                [(ngModel)]="settings.visibility!.hideOnDesktop"
                (ngModelChange)="emitChange()"
                class="toggle toggle-primary toggle-sm" />
            </label>
            
            <!-- Requires Auth -->
            <label class="flex items-center justify-between cursor-pointer p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <div class="flex items-center gap-3">
                <svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
                <span class="text-sm text-slate-600 dark:text-slate-300">{{ 'SETTINGS_REQUIRES_AUTH' | translate }}</span>
              </div>
              <input 
                type="checkbox" 
                [(ngModel)]="settings.visibility!.requiresAuth"
                (ngModelChange)="emitChange()"
                class="toggle toggle-warning toggle-sm" />
            </label>
          </div>
        </section>
        
        <!-- Advanced Section -->
        <section class="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          <h4 class="font-bold text-slate-700 dark:text-white text-sm mb-4 flex items-center gap-2">
            <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            {{ 'SETTINGS_ADVANCED' | translate }}
          </h4>
          
          <div class="space-y-4">
            <!-- Custom ID -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-medium text-slate-600 dark:text-slate-300">{{ 'SETTINGS_CUSTOM_ID' | translate }}</span>
              </label>
              <input 
                type="text" 
                [(ngModel)]="settings.id"
                (ngModelChange)="emitChange()"
                placeholder="my-section"
                class="input input-bordered w-full dark:bg-slate-700 dark:border-slate-600 font-mono text-sm" />
              <p class="text-xs text-slate-400 mt-1">{{ 'SETTINGS_CUSTOM_ID_HINT' | translate }}</p>
            </div>
            
            <!-- Custom CSS Class -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-medium text-slate-600 dark:text-slate-300">{{ 'SETTINGS_CUSTOM_CLASS' | translate }}</span>
              </label>
              <input 
                type="text" 
                [(ngModel)]="settings.customClass"
                (ngModelChange)="emitChange()"
                placeholder="my-custom-class another-class"
                class="input input-bordered w-full dark:bg-slate-700 dark:border-slate-600 font-mono text-sm" />
              <p class="text-xs text-slate-400 mt-1">{{ 'SETTINGS_CUSTOM_CLASS_HINT' | translate }}</p>
            </div>
          </div>
        </section>
        
      </div>
    </div>
  `
})
export class SettingsPanelComponent implements OnChanges {
  readonly blockSettings = input<BlockSettings>({});
  readonly settingsChange = output<BlockSettings>();

  settings: BlockSettings = this.getDefaultSettings();
  animationTriggers: Array<'visible' | 'hover' | 'click'> = ['visible', 'hover', 'click'];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['blockSettings']) {
      this.settings = this.mergeWithDefaults(this.blockSettings() || {});
    }
  }

  private getDefaultSettings(): BlockSettings {
    return {
      animation: {
        type: 'none',
        duration: 500,
        delay: 0,
        trigger: 'visible'
      },
      visibility: {
        hideOnMobile: false,
        hideOnTablet: false,
        hideOnDesktop: false,
        requiresAuth: false
      },
      customClass: '',
      id: ''
    };
  }

  private mergeWithDefaults(input: BlockSettings): BlockSettings {
    const defaults = this.getDefaultSettings();
    return {
      animation: { ...defaults.animation!, ...input.animation } as BlockSettings['animation'],
      visibility: { ...defaults.visibility!, ...input.visibility },
      customClass: input.customClass || '',
      id: input.id || ''
    };
  }

  emitChange(): void {
    this.settingsChange.emit({ ...this.settings });
  }
}
