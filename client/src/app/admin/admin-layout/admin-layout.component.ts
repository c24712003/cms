import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="flex h-screen bg-gray-100">
      <!-- Sidebar -->
      <nav class="w-64 bg-slate-800 text-white flex flex-col shadow-lg">
        <div class="p-6 border-b border-slate-700">
          <h2 class="text-xl font-bold tracking-wide">CMS Admin</h2>
        </div>
        
        <div class="flex-1 overflow-y-auto py-4">
          <ul class="space-y-1">
            <li>
              <a routerLink="dashboard" routerLinkActive="bg-slate-700 text-blue-400 border-r-4 border-blue-400" class="flex items-center px-6 py-3 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">
                <span class="mr-3">📊</span> Dashboard
              </a>
            </li>
            <li>
              <a routerLink="languages" routerLinkActive="bg-slate-700 text-blue-400 border-r-4 border-blue-400" class="flex items-center px-6 py-3 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">
                <span class="mr-3">🌍</span> Languages
              </a>
            </li>
            <li>
              <a routerLink="translations" routerLinkActive="bg-slate-700 text-blue-400 border-r-4 border-blue-400" class="flex items-center px-6 py-3 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">
                <span class="mr-3">🗣️</span> Translations
              </a>
            </li>
            <li>
              <a routerLink="pages" routerLinkActive="bg-slate-700 text-blue-400 border-r-4 border-blue-400" class="flex items-center px-6 py-3 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">
                <span class="mr-3">📄</span> Pages
              </a>
            </li>
            <li>
              <a routerLink="media" routerLinkActive="bg-slate-700 text-blue-400 border-r-4 border-blue-400" class="flex items-center px-6 py-3 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">
                <span class="mr-3">🖼️</span> Media Library
              </a>
            </li>
            <li>
              <a routerLink="menus" routerLinkActive="bg-slate-700 text-blue-400 border-r-4 border-blue-400" class="flex items-center px-6 py-3 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">
                 <span class="mr-3">🍔</span> Menus
              </a>
            </li>
          </ul>
        </div>

        <div class="p-4 border-t border-slate-700 bg-slate-900">
            <div class="flex items-center justify-between mb-4 px-2">
                <div class="text-sm text-slate-400">
                    User: Admin
                </div>
            </div>
            <button (click)="logout()" class="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded transition-colors text-sm font-medium">
                Sign Out
            </button>
            <div class="mt-4 text-center">
                 <a routerLink="/" target="_blank" class="text-xs text-slate-500 hover:text-slate-300">View Public Site ↗</a>
            </div>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto p-8">
        <div class="max-w-6xl mx-auto">
            <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `
})
export class AdminLayoutComponent {
  constructor(private authService: AuthService) { }

  logout() {
    this.authService.logout();
  }
}
