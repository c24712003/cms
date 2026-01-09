import { Component, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="space-y-6">
      <h2 class="text-3xl font-bold text-slate-800">Overview</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Stat Card 1 -->
        <div class="bg-white rounded-xl shadow p-6 border-l-4 border-blue-500">
            <div class="text-slate-500 text-sm font-uppercase mb-1">Total Languages</div>
            <div class="text-4xl font-bold text-slate-800">{{ stats().languages }}</div>
        </div>

        <!-- Stat Card 2 -->
        <div class="bg-white rounded-xl shadow p-6 border-l-4 border-emerald-500">
            <div class="text-slate-500 text-sm font-uppercase mb-1">Translation Keys</div>
            <div class="text-4xl font-bold text-slate-800">{{ stats().translations }}</div>
        </div>

        <!-- Stat Card 3 -->
        <div class="bg-white rounded-xl shadow p-6 border-l-4 border-indigo-500">
            <div class="text-slate-500 text-sm font-uppercase mb-1">Pages Created</div>
            <div class="text-4xl font-bold text-slate-800">{{ stats().pages }}</div>
        </div>

        <!-- Stat Card 4 -->
        <div class="bg-white rounded-xl shadow p-6 border-l-4 border-amber-500">
            <div class="text-slate-500 text-sm font-uppercase mb-1">Menus</div>
             <!-- Mock Data for now as API might not return menus count yet -->
            <div class="text-4xl font-bold text-slate-800">{{ stats().menus || 1 }}</div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div class="bg-white rounded-xl shadow p-6">
            <h3 class="text-lg font-bold text-slate-700 mb-4">Quick Actions</h3>
            <div class="space-y-2">
                <button class="w-full text-left px-4 py-3 rounded hover:bg-slate-50 border border-slate-200 text-slate-600 flex items-center group transition">
                    <span class="w-8 h-8 rounded bg-blue-100 text-blue-600 flex items-center justify-center mr-3 group-hover:bg-blue-600 group-hover:text-white transition">✎</span>
                    Create New Page
                </button>
                <button class="w-full text-left px-4 py-3 rounded hover:bg-slate-50 border border-slate-200 text-slate-600 flex items-center group transition">
                     <span class="w-8 h-8 rounded bg-emerald-100 text-emerald-600 flex items-center justify-center mr-3 group-hover:bg-emerald-600 group-hover:text-white transition">🌍</span>
                    Add Language
                </button>
            </div>
        </div>

        <div class="bg-white rounded-xl shadow p-6">
             <h3 class="text-lg font-bold text-slate-700 mb-4">System Status</h3>
             <ul class="space-y-3">
                <li class="flex justify-between items-center pb-2 border-b border-gray-100">
                    <span class="text-slate-600">Server Status</span>
                    <span class="px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-bold">ONLINE</span>
                </li>
                <li class="flex justify-between items-center pb-2 border-b border-gray-100">
                    <span class="text-slate-600">Database</span>
                    <span class="px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-bold">CONNECTED</span>
                </li>
                <li class="flex justify-between items-center pb-2 border-b border-gray-100">
                    <span class="text-slate-600">Version</span>
                    <span class="text-slate-800 font-mono text-sm">v1.0.0</span>
                </li>
             </ul>
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
