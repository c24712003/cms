import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <!-- Sidebar -->
    <aside class="admin-sidebar shadow-2xl">
      <!-- Logo -->
      <div class="admin-sidebar-logo flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/30">
          C
        </div>
        <h1 class="text-xl font-bold tracking-tight">
          <span class="text-white">CMS</span><span class="text-blue-400">Admin</span>
        </h1>
      </div>
      
      <!-- Navigation -->
      <nav class="admin-sidebar-nav custom-scrollbar">
        <a routerLink="dashboard" routerLinkActive="active" class="admin-sidebar-item group">
          <svg class="w-5 h-5 mr-3 text-slate-400 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
          </svg>
          <span class="font-medium">Dashboard</span>
        </a>
        
        <div class="px-4 pt-4 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Content</div>

        <a routerLink="pages" routerLinkActive="active" class="admin-sidebar-item group">
          <svg class="w-5 h-5 mr-3 text-slate-400 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          Pages
        </a>
        
        <a routerLink="media" routerLinkActive="active" class="admin-sidebar-item group">
          <svg class="w-5 h-5 mr-3 text-slate-400 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          Media Library
        </a>

        <div class="px-4 pt-4 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Localization</div>
        
        <a routerLink="languages" routerLinkActive="active" class="admin-sidebar-item group">
          <svg class="w-5 h-5 mr-3 text-slate-400 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          Languages
        </a>
        
        <a routerLink="translations" routerLinkActive="active" class="admin-sidebar-item group">
          <svg class="w-5 h-5 mr-3 text-slate-400 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/>
          </svg>
          Translations
        </a>

        <div class="px-4 pt-4 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">System</div>
        
        <a routerLink="menus/main" routerLinkActive="active" class="admin-sidebar-item group">
          <svg class="w-5 h-5 mr-3 text-slate-400 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
          Header Menu
        </a>

        <a routerLink="menus/footer" routerLinkActive="active" class="admin-sidebar-item group">
          <svg class="w-5 h-5 mr-3 text-slate-400 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
          </svg>
          Footer Menu
        </a>
      </nav>

      <!-- Footer -->
      <div class="admin-sidebar-footer">
        <div class="flex items-center gap-3 mb-4 p-2 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
            A
          </div>
          <div>
            <div class="text-sm font-medium text-white">Admin User</div>
            <div class="text-xs text-slate-400">admin@cms.com</div>
          </div>
        </div>
        
        <button (click)="logout()" class="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all text-sm font-medium border border-red-500/10">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
          Sign Out
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="admin-content">
      <!-- Top Bar (Optional if needed for breadcrumbs later) -->
      <div class="p-8 max-w-7xl mx-auto">
        <router-outlet></router-outlet>
      </div>
    </main>
  `
})
export class AdminLayoutComponent {
  constructor(private authService: AuthService, private router: Router) { }

  logout() {
    this.authService.logout();
  }
}
