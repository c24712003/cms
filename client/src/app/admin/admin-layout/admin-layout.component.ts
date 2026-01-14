import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { GlobalSearchInputComponent } from '../../shared/components/global-search-input/global-search-input.component';
import { TranslatePipe } from '../../core/pipes/translate.pipe';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, FormsModule, GlobalSearchInputComponent, TranslatePipe],
  template: `
    <div class="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden transition-colors duration-200">
      
      <!-- Mobile Sidebar Overlay -->
      <div 
        *ngIf="isMobileMenuOpen()" 
        (click)="toggleMobileMenu()"
        class="fixed inset-0 bg-slate-900/50 z-40 transition-opacity lg:hidden backdrop-blur-sm"
      ></div>

      <!-- Sidebar -->
      <aside 
        class="fixed sm:static inset-y-0 left-0 z-50 bg-slate-900 text-white transition-all duration-300 ease-in-out transform shadow-xl flex flex-col"
        [ngClass]="{
          '-translate-x-full': !isMobileMenuOpen(),
          'translate-x-0': isMobileMenuOpen(),
          'w-64': true, 
          'lg:translate-x-0': true,
          'lg:w-48': true,
          'sm:w-20 sm:translate-x-0': true
        }"
      >
        <!-- Logo -->
        <div class="h-16 flex items-center gap-3 px-4 border-b border-slate-800 sm:justify-center lg:justify-start overflow-hidden whitespace-nowrap">
          <div class="w-8 h-8 min-w-[2rem] rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/30">
            C
          </div>
          <h1 class="text-xl font-bold tracking-tight sm:hidden lg:block transition-all duration-300 opacity-100">
            <span class="text-white">CMS</span><span class="text-blue-400">Admin</span>
          </h1>
        </div>
        
        <!-- Navigation -->
        <nav class="flex-1 overflow-y-auto custom-scrollbar py-4 space-y-1">
          
          <!-- Nav Item Helper -->
          <ng-template #navItem let-link="link" let-icon="icon" let-label="label">
            <a [routerLink]="link" routerLinkActive="active" 
               class="flex items-center px-4 py-3 mx-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-all group relative overflow-hidden whitespace-nowrap sm:justify-center lg:justify-start"
               (click)="isMobileMenuOpen.set(false)">
              <div class="min-w-[1.25rem] flex justify-center">
                <i [class]="icon + ' text-lg group-hover:text-blue-400 transition-colors'"></i>
                <!-- SVG Fallback/Replacement since we used SVGs before, sticking to SVGs for quality -->
                <ng-content select="svg"></ng-content>
              </div>
              <span class="ml-3 font-medium sm:hidden lg:block transition-all duration-300 opacity-100">
                {{label | translate}}
              </span>
              <!-- Tooltip for Tablet -->
              <div class="hidden sm:block lg:hidden absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
                {{label | translate}}
              </div>
            </a>
          </ng-template>

          <a routerLink="dashboard" routerLinkActive="bg-slate-800 text-white" class="flex items-center px-4 py-3 mx-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-all group relative overflow-hidden whitespace-nowrap sm:justify-center lg:justify-start" (click)="isMobileMenuOpen.set(false)">
            <svg class="w-5 h-5 min-w-[1.25rem] text-slate-400 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
            </svg>
            <span class="ml-3 font-medium sm:hidden lg:block">{{ 'NAV_DASHBOARD' | translate }}</span>
            <div class="hidden sm:block lg:hidden absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">{{ 'NAV_DASHBOARD' | translate }}</div>
          </a>
          
          <div class="px-4 mt-6 mb-2 text-xs font-semibold text-slate-600 uppercase tracking-wider sm:hidden lg:block">{{ 'NAV_CONTENT' | translate }}</div>
          <div class="my-4 border-t border-slate-800 sm:block lg:hidden"></div>

          <a routerLink="pages" routerLinkActive="bg-slate-800 text-white" class="flex items-center px-4 py-3 mx-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-all group relative overflow-hidden whitespace-nowrap sm:justify-center lg:justify-start" (click)="isMobileMenuOpen.set(false)">
            <svg class="w-5 h-5 min-w-[1.25rem] text-slate-400 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <span class="ml-3 font-medium md:hidden lg:block">{{ 'NAV_PAGES' | translate }}</span>
            <div class="hidden sm:block lg:hidden absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">{{ 'NAV_PAGES' | translate }}</div>
          </a>

          <a routerLink="themes" routerLinkActive="bg-slate-800 text-white" class="flex items-center px-4 py-3 mx-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-all group relative overflow-hidden whitespace-nowrap sm:justify-center lg:justify-start" (click)="isMobileMenuOpen.set(false)">
            <svg class="w-5 h-5 min-w-[1.25rem] text-slate-400 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"/>
            </svg>
            <span class="ml-3 font-medium sm:hidden lg:block">{{ 'NAV_THEMES' | translate }}</span>
            <div class="hidden sm:block lg:hidden absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">{{ 'NAV_THEMES' | translate }}</div>
          </a>

          <a routerLink="media" routerLinkActive="bg-slate-800 text-white" class="flex items-center px-4 py-3 mx-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-all group relative overflow-hidden whitespace-nowrap sm:justify-center lg:justify-start" (click)="isMobileMenuOpen.set(false)">
            <svg class="w-5 h-5 min-w-[1.25rem] text-slate-400 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <span class="ml-3 font-medium sm:hidden lg:block">{{ 'NAV_MEDIA' | translate }}</span>
            <div class="hidden sm:block lg:hidden absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">{{ 'NAV_MEDIA' | translate }}</div>
          </a>

          <div class="px-4 mt-6 mb-2 text-xs font-semibold text-slate-600 uppercase tracking-wider sm:hidden lg:block">{{ 'NAV_LOCALIZATION' | translate }}</div>
          
          <a routerLink="languages" routerLinkActive="bg-slate-800 text-white" class="flex items-center px-4 py-3 mx-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-all group relative overflow-hidden whitespace-nowrap sm:justify-center lg:justify-start" (click)="isMobileMenuOpen.set(false)">
            <svg class="w-5 h-5 min-w-[1.25rem] text-slate-400 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span class="ml-3 font-medium sm:hidden lg:block">{{ 'NAV_LANGUAGES' | translate }}</span>
            <div class="hidden sm:block lg:hidden absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">{{ 'NAV_LANGUAGES' | translate }}</div>
          </a>
          
          <a routerLink="translations" routerLinkActive="bg-slate-800 text-white" class="flex items-center px-4 py-3 mx-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-all group relative overflow-hidden whitespace-nowrap sm:justify-center lg:justify-start" (click)="isMobileMenuOpen.set(false)">
            <svg class="w-5 h-5 min-w-[1.25rem] text-slate-400 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/>
            </svg>
            <span class="ml-3 font-medium sm:hidden lg:block">{{ 'NAV_TRANSLATIONS' | translate }}</span>
            <div class="hidden sm:block lg:hidden absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">{{ 'NAV_TRANSLATIONS' | translate }}</div>
          </a>

          <div class="px-4 mt-6 mb-2 text-xs font-semibold text-slate-600 uppercase tracking-wider sm:hidden lg:block">{{ 'NAV_SYSTEM' | translate }}</div>

          <a routerLink="users" routerLinkActive="bg-slate-800 text-white" class="flex items-center px-4 py-3 mx-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-all group relative overflow-hidden whitespace-nowrap sm:justify-center lg:justify-start" (click)="isMobileMenuOpen.set(false)">
            <svg class="w-5 h-5 min-w-[1.25rem] text-slate-400 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span class="ml-3 font-medium sm:hidden lg:block">{{ 'NAV_USERS' | translate }}</span>
            <div class="hidden sm:block lg:hidden absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">{{ 'NAV_USERS' | translate }}</div>
          </a>

          <a routerLink="audit-logs" routerLinkActive="bg-slate-800 text-white" class="flex items-center px-4 py-3 mx-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-all group relative overflow-hidden whitespace-nowrap sm:justify-center lg:justify-start" (click)="isMobileMenuOpen.set(false)">
            <svg class="w-5 h-5 min-w-[1.25rem] text-slate-400 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <span class="ml-3 font-medium sm:hidden lg:block">{{ 'NAV_AUDIT_LOGS' | translate }}</span>
            <div class="hidden sm:block lg:hidden absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">{{ 'NAV_AUDIT_LOGS' | translate }}</div>
          </a>

          <div class="px-4 mt-6 mb-2 text-xs font-semibold text-slate-600 uppercase tracking-wider sm:hidden lg:block">{{ 'NAV_MENUS' | translate }}</div>

          <a routerLink="menus/main" routerLinkActive="bg-slate-800 text-white" class="flex items-center px-4 py-3 mx-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-all group relative overflow-hidden whitespace-nowrap sm:justify-center lg:justify-start" (click)="isMobileMenuOpen.set(false)">
            <svg class="w-5 h-5 min-w-[1.25rem] text-slate-400 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
            <span class="ml-3 font-medium sm:hidden lg:block">{{ 'NAV_HEADER_MENU' | translate }}</span>
             <div class="hidden sm:block lg:hidden absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">{{ 'NAV_HEADER_MENU' | translate }}</div>
          </a>
          <a routerLink="menus/footer" routerLinkActive="bg-slate-800 text-white" class="flex items-center px-4 py-3 mx-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-all group relative overflow-hidden whitespace-nowrap sm:justify-center lg:justify-start" (click)="isMobileMenuOpen.set(false)">
            <svg class="w-5 h-5 min-w-[1.25rem] text-slate-400 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
            </svg>
            <span class="ml-3 font-medium sm:hidden lg:block">{{ 'NAV_FOOTER_MENU' | translate }}</span>
             <div class="hidden sm:block lg:hidden absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">{{ 'NAV_FOOTER_MENU' | translate }}</div>
          </a>

        </nav>

        <!-- Sidebar Footer -->
        <div class="p-4 border-t border-slate-800">
          <div class="flex items-center gap-3 mb-4 rounded-xl sm:justify-center lg:justify-start">
            <div class="w-10 h-10 min-w-[2.5rem] rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-slate-700">
              A
            </div>
            <div class="overflow-hidden sm:hidden lg:block">
              <div class="text-sm font-medium text-white">Admin User</div>
              <div class="text-xs text-slate-400 truncate">admin@cms.com</div>
            </div>
          </div>
          
          <button (click)="logout()" class="w-full flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all text-sm font-medium border border-red-500/10 sm:justify-center lg:justify-start group">
            <svg class="w-4 h-4 min-w-[1rem]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            <span class="sm:hidden lg:block">{{ 'NAV_SIGNOUT' | translate }}</span>
             <div class="hidden sm:block lg:hidden absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">{{ 'NAV_SIGNOUT' | translate }}</div>
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <div class="flex-1 flex flex-col min-w-0 transition-all duration-300">
        
        <!-- Top Bar -->
        <header class="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 h-16 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30 shadow-sm transition-colors duration-200">
          <div class="flex items-center gap-4">
            <!-- Mobile Toggle -->
            <!-- Mobile Toggle -->
            <button 
              (click)="toggleMobileMenu()"
              class="sm:hidden p-2 -ml-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-600"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>
            
            <!-- Breadcrumbs (Simplified for now) -->
            <nav class="hidden sm:flex text-sm font-medium text-slate-500 dark:text-slate-400">
              <span class="hover:text-slate-800 dark:hover:text-white cursor-pointer transition-colors">Admin</span>
              <span class="mx-2 text-slate-300 dark:text-slate-600">/</span>
              <span class="text-slate-800 dark:text-white">Dashboard</span>
            </nav>
          </div>

          <div class="flex items-center gap-4">
            <!-- Search -->
            <div class="hidden md:block relative">
               <app-global-search-input mode="admin" placeholder="Global search..."></app-global-search-input>
            </div>

            <!-- Theme Toggle Dropdown -->
            <div class="relative">
              <button 
                (click)="toggleThemeMenu()" 
                class="relative p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-1"
                [title]="getThemeTooltip()"
              >
                <!-- Sun Icon (Light Mode) -->
                <svg *ngIf="themeService.theme() === 'light'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <!-- Moon Icon (Dark Mode) -->
                <svg *ngIf="themeService.theme() === 'dark'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
                <!-- System Icon (System Mode) -->
                <svg *ngIf="themeService.theme() === 'system'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <!-- Dropdown Arrow -->
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <!-- Theme Dropdown Menu -->
              <div *ngIf="isThemeMenuOpen()" 
                   class="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-2 z-50 animate-fade-in">
                <button 
                  (click)="setTheme('light')" 
                  class="w-full px-4 py-2 text-left text-sm flex items-center gap-3 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  [class.text-blue-600]="themeService.theme() === 'light'"
                  [class.dark:text-blue-400]="themeService.theme() === 'light'"
                  [class.text-slate-700]="themeService.theme() !== 'light'"
                  [class.dark:text-slate-300]="themeService.theme() !== 'light'">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  {{ 'THEME_LIGHT' | translate }}
                  <svg *ngIf="themeService.theme() === 'light'" class="w-4 h-4 ml-auto text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </button>
                <button 
                  (click)="setTheme('dark')" 
                  class="w-full px-4 py-2 text-left text-sm flex items-center gap-3 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  [class.text-blue-600]="themeService.theme() === 'dark'"
                  [class.dark:text-blue-400]="themeService.theme() === 'dark'"
                  [class.text-slate-700]="themeService.theme() !== 'dark'"
                  [class.dark:text-slate-300]="themeService.theme() !== 'dark'">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                  {{ 'THEME_DARK' | translate }}
                  <svg *ngIf="themeService.theme() === 'dark'" class="w-4 h-4 ml-auto text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </button>
                <div class="border-t border-slate-100 dark:border-slate-700 my-1"></div>
                <button 
                  (click)="setTheme('system')" 
                  class="w-full px-4 py-2 text-left text-sm flex items-center gap-3 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  [class.text-blue-600]="themeService.theme() === 'system'"
                  [class.dark:text-blue-400]="themeService.theme() === 'system'"
                  [class.text-slate-700]="themeService.theme() !== 'system'"
                  [class.dark:text-slate-300]="themeService.theme() !== 'system'">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {{ 'THEME_SYSTEM' | translate }}
                  <svg *ngIf="themeService.theme() === 'system'" class="w-4 h-4 ml-auto text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Notifications (Placeholder) -->
            <button class="relative p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
              <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-800"></span>
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
              </svg>
            </button>
            
            <!-- User Avatar -->
            <div class="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-600 border border-slate-300 dark:border-slate-500 flex items-center justify-center text-slate-500 dark:text-slate-300 font-bold text-xs ring-2 ring-transparent hover:ring-blue-100 dark:hover:ring-blue-900 transition-all cursor-pointer">
              A
            </div>
          </div>
        </header>

        <!-- Page Content -->
        <main class="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 dark:bg-slate-900 p-2 lg:p-0 transition-colors duration-200">
          <div class="max-w-7xl mx-auto">
            <router-outlet></router-outlet>
          </div>
        </main>
      </div>
    </div>
  `
})
export class AdminLayoutComponent implements OnInit {
  isMobileMenuOpen = signal(false);
  isThemeMenuOpen = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router,
    public themeService: ThemeService
  ) { }

  ngOnInit() {
    this.themeService.initTheme();
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(v => !v);
  }

  toggleThemeMenu() {
    this.isThemeMenuOpen.update(v => !v);
  }

  setTheme(mode: 'light' | 'dark' | 'system') {
    this.themeService.setTheme(mode);
    this.isThemeMenuOpen.set(false);
  }

  toggleTheme() {
    this.themeService.toggleLightDark();
  }

  getThemeTooltip(): string {
    const theme = this.themeService.theme();
    const effective = this.themeService.effectiveTheme();
    if (theme === 'system') {
      return `System (${effective})`;
    }
    return effective === 'dark' ? 'Dark mode' : 'Light mode';
  }

  logout() {
    this.authService.logout();
  }
}
