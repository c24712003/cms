import { Component, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div>
      <!-- Page Header -->
      <div class="admin-page-header">
        <h1 class="admin-page-title">Dashboard</h1>
        <span class="text-sm text-slate-500">Welcome back, Admin</span>
      </div>

      <!-- Stat Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="stat-card border-l-blue-500">
          <div class="stat-card-value">{{ stats().languages }}</div>
          <div class="stat-card-label">Languages</div>
        </div>
        
        <div class="stat-card border-l-emerald-500">
          <div class="stat-card-value">{{ stats().translations }}</div>
          <div class="stat-card-label">Translation Keys</div>
        </div>
        
        <div class="stat-card border-l-violet-500">
          <div class="stat-card-value">{{ stats().pages }}</div>
          <div class="stat-card-label">Pages Created</div>
        </div>
        
        <div class="stat-card border-l-amber-500">
          <div class="stat-card-value">{{ stats().menus }}</div>
          <div class="stat-card-label">Menus</div>
        </div>
      </div>

      <!-- Two Column Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Quick Actions Card -->
        <div class="card">
          <div class="card-header">
            <h3 class="text-lg font-semibold text-slate-800">Quick Actions</h3>
          </div>
          <div class="card-body space-y-3">
            <button class="w-full flex items-center p-4 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all group">
              <div class="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mr-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
              </div>
              <div class="text-left">
                <div class="font-medium text-slate-800">Create New Page</div>
                <div class="text-sm text-slate-500">Add a new content page</div>
              </div>
            </button>
            
            <button class="w-full flex items-center p-4 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all group">
              <div class="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center mr-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div class="text-left">
                <div class="font-medium text-slate-800">Add Language</div>
                <div class="text-sm text-slate-500">Enable new locale support</div>
              </div>
            </button>
          </div>
        </div>

        <!-- System Status Card -->
        <div class="card">
          <div class="card-header">
            <h3 class="text-lg font-semibold text-slate-800">System Status</h3>
          </div>
          <div class="card-body">
            <div class="space-y-4">
              <div class="flex items-center justify-between py-3 border-b border-slate-100">
                <span class="text-slate-600">Server Status</span>
                <span class="badge badge-success">Online</span>
              </div>
              <div class="flex items-center justify-between py-3 border-b border-slate-100">
                <span class="text-slate-600">Database</span>
                <span class="badge badge-success">Connected</span>
              </div>
              <div class="flex items-center justify-between py-3 border-b border-slate-100">
                <span class="text-slate-600">API Health</span>
                <span class="badge badge-success">Healthy</span>
              </div>
              <div class="flex items-center justify-between py-3">
                <span class="text-slate-600">Version</span>
                <span class="font-mono text-sm text-slate-800">v1.0.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
    stats = signal<any>({ languages: 0, translations: 0, pages: 0, menus: 0 });

    constructor(private http: HttpClient) { }

    ngOnInit() {
        this.http.get<any[]>('/api/languages').subscribe(d => this.stats.update(s => ({ ...s, languages: d.length })));
        this.http.get<any[]>('/api/translations/keys').subscribe(d => this.stats.update(s => ({ ...s, translations: d.length })));
        this.http.get<any[]>('/api/pages').subscribe(d => this.stats.update(s => ({ ...s, pages: d.length })));
        this.http.get<any[]>('/api/menus').subscribe(d => this.stats.update(s => ({ ...s, menus: d.length })));
    }
}
