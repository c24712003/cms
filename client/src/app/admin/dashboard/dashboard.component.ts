import { Component, OnInit, signal, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardService, AuditLog, SystemStatus } from '../services/dashboard.service';
import { TranslatePipe } from '../../core/pipes/translate.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe, TranslatePipe],
  template: `
    <div class="min-h-screen bg-slate-50/50 p-6 md:p-8 transition-all duration-300 ease-in-out">
      <!-- Header Section with Greeting -->
      <div class="mb-10 animate-fade-in-up">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 class="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-2 font-display">
              {{ greeting() | translate }}
            </h1>
            <p class="text-slate-500 text-lg">
              {{ 'DASHBOARD_SUBTITLE' | translate }}
            </p>
          </div>
          <div class="text-right hidden md:block">
            <div class="text-3xl font-light text-slate-700 font-mono">{{ currentTime | date:'shortTime' }}</div>
            <div class="text-slate-400 font-medium">{{ currentTime | date:'fullDate' }}</div>
          </div>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <!-- Languages Card -->
        <div class="group relative bg-white rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] hover:shadow-[0_8px_30px_-4px_rgba(6,81,237,0.15)] transition-all duration-300 border border-slate-100 hover:border-blue-100 overflow-hidden">
          <div class="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div class="flex justify-between items-start mb-4">
            <div class="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-600 transition-colors duration-300">
              <svg class="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
            </div>
            <!-- <span class="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">+1 new</span> -->
          </div>
          <div class="text-3xl font-bold text-slate-800 mb-1">{{ stats().languages }}</div>
          <div class="text-sm text-slate-500 font-medium">{{ 'STATS_ACTIVE_LANGUAGES' | translate }}</div>
        </div>

        <!-- Translations Card -->
        <div class="group relative bg-white rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(16,185,129,0.1)] hover:shadow-[0_8px_30px_-4px_rgba(16,185,129,0.15)] transition-all duration-300 border border-slate-100 hover:border-emerald-100 overflow-hidden">
          <div class="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-emerald-500 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div class="flex justify-between items-start mb-4">
            <div class="p-3 bg-emerald-50 rounded-xl group-hover:bg-emerald-600 transition-colors duration-300">
              <svg class="w-6 h-6 text-emerald-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
          </div>
          <div class="text-3xl font-bold text-slate-800 mb-1">{{ stats().translations }}</div>
          <div class="text-sm text-slate-500 font-medium">{{ 'STATS_TRANSLATION_KEYS' | translate }}</div>
        </div>

        <!-- Pages Card -->
        <div class="group relative bg-white rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(139,92,246,0.1)] hover:shadow-[0_8px_30px_-4px_rgba(139,92,246,0.15)] transition-all duration-300 border border-slate-100 hover:border-violet-100 overflow-hidden">
          <div class="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-violet-500 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div class="flex justify-between items-start mb-4">
            <div class="p-3 bg-violet-50 rounded-xl group-hover:bg-violet-600 transition-colors duration-300">
              <svg class="w-6 h-6 text-violet-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <!-- <span class="text-xs font-semibold text-violet-600 bg-violet-50 px-2 py-1 rounded-full">Updated 2m ago</span> -->
          </div>
          <div class="text-3xl font-bold text-slate-800 mb-1">{{ stats().pages }}</div>
          <div class="text-sm text-slate-500 font-medium">{{ 'STATS_PUBLISHED_PAGES' | translate }}</div>
        </div>

        <!-- Menus Card -->
        <div class="group relative bg-white rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(245,158,11,0.1)] hover:shadow-[0_8px_30px_-4px_rgba(245,158,11,0.15)] transition-all duration-300 border border-slate-100 hover:border-amber-100 overflow-hidden">
          <div class="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-amber-500 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div class="flex justify-between items-start mb-4">
            <div class="p-3 bg-amber-50 rounded-xl group-hover:bg-amber-600 transition-colors duration-300">
              <svg class="w-6 h-6 text-amber-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </div>
          </div>
          <div class="text-3xl font-bold text-slate-800 mb-1">{{ stats().menus }}</div>
          <div class="text-sm text-slate-500 font-medium">{{ 'STATS_NAV_MENUS' | translate }}</div>
        </div>
      </div>

      <!-- Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Activity Column -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Quick Actions -->
          <div class="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
             <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-bold text-slate-800">{{ 'QUICK_ACTIONS' | translate }}</h2>
              <!-- <button class="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline">View All</button> -->
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
               <button class="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all duration-300 group">
                <div class="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                </div>
                <!-- TODO: Link to Page Create -->
                <span class="font-semibold text-slate-700 group-hover:text-blue-700">{{ 'ACTION_NEW_PAGE' | translate }}</span>
              </button>
              
               <button routerLink="/admin/media-manager" class="flex flex-col items-center justify-center p-6 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-lg hover:shadow-slate-100 hover:-translate-y-1 transition-all duration-300 group">
                <div class="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                </div>
                <span class="font-semibold text-slate-700">{{ 'ACTION_UPLOAD_MEDIA' | translate }}</span>
              </button>

               <button routerLink="/admin/translation-editor" class="flex flex-col items-center justify-center p-6 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-lg hover:shadow-slate-100 hover:-translate-y-1 transition-all duration-300 group">
                <div class="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/></svg>
                </div>
                <span class="font-semibold text-slate-700">{{ 'ACTION_LOCALIZE' | translate }}</span>
              </button>
            </div>
          </div>

          <!-- Activity Field -->
          <div class="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-bold text-slate-800">{{ 'RECENT_ACTIVITY' | translate }}</h2>
              <div class="flex gap-2">
                <!-- <span class="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">All</span> -->
              </div>
            </div>
            
            <div class="relative pl-8 border-l border-slate-100 space-y-8">
              @if (activityLogs().length === 0) {
                <div class="text-slate-400 text-sm">{{ 'NO_ACTIVITY' | translate }}</div>
              }
              @for (log of activityLogs(); track log.id) {
                <div class="relative">
                  <div class="absolute -left-[39px] w-5 h-5 rounded-full border-4 border-white" [ngClass]="getLogColor(log.type)"></div>
                  <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start group cursor-pointer p-3 -m-3 rounded-lg hover:bg-slate-50 transition-colors">
                    <div>
                      <h4 class="text-sm font-semibold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">{{ log.action }}</h4>
                      <p class="text-sm text-slate-500">{{ log.description }}</p>
                    </div>
                    <div class="mt-1 sm:mt-0 text-xs font-mono text-slate-400 whitespace-nowrap">{{ log.created_at | date:'short' }}</div>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Sidebar Column -->
        <div class="lg:col-span-1 space-y-6">
          <!-- System Status -->
          <div class="bg-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
             <!-- Abstract Background Shapes -->
            <div class="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <div class="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/20 rounded-full blur-xl -ml-6 -mb-6"></div>

            <h3 class="text-lg font-bold mb-6 relative z-10">{{ 'SYSTEM_STATUS' | translate }}</h3>
            <div class="space-y-4 relative z-10">
              @if (systemStatus(); as status) {
                  <div class="flex items-center justify-between">
                     <div class="flex items-center gap-3">
                       <div class="relative flex h-3 w-3">
                        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                      </div>
                      <span class="text-slate-300 text-sm">{{ 'STATUS_SERVER' | translate }}</span>
                     </div>
                     <span class="text-emerald-400 font-mono text-sm capitalize">{{ status.status }}</span>
                  </div>
                  
                  <div class="w-full bg-slate-800 rounded-full h-1.5">
                    <!-- Fake load bar related to memory usage? -->
                    <div class="bg-emerald-500 h-1.5 rounded-full" style="width: 98%"></div>
                  </div>

                   <div class="flex items-center justify-between pt-2">
                     <div class="flex items-center gap-3">
                       <div class="w-2 h-2 rounded-full" [ngClass]="status.database === 'connected' ? 'bg-emerald-500' : 'bg-red-500'"></div>
                      <span class="text-slate-300 text-sm">{{ 'STATUS_DB' | translate }}</span>
                     </div>
                     <span class="font-mono text-sm capitalize" [ngClass]="status.database === 'connected' ? 'text-emerald-400' : 'text-red-400'">{{ status.database }}</span>
                  </div>

                   <div class="flex items-center justify-between pt-2 border-t border-slate-800">
                     <span class="text-xs text-slate-500">{{ 'STATUS_VERSION' | translate }}</span>
                     <span class="text-xs font-mono text-slate-400">{{ status.version }}</span>
                  </div>
              } @else {
                  <div class="animate-pulse flex space-x-4">
                    <div class="flex-1 space-y-4 py-1">
                      <div class="h-4 bg-slate-700 rounded w-3/4"></div>
                      <div class="space-y-2">
                        <div class="h-4 bg-slate-700 rounded"></div>
                        <div class="h-4 bg-slate-700 rounded w-5/6"></div>
                      </div>
                    </div>
                  </div>
              }
            </div>
          </div>

          <!-- Quick Tip / Insight -->
          <div class="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-3xl p-6 border border-indigo-100">
            <h3 class="text-indigo-900 font-bold mb-2">{{ 'DID_YOU_KNOW' | translate }}</h3>
            <p class="text-sm text-indigo-700/80 leading-relaxed mb-4">
              {{ 'DID_YOU_KNOW_DESC' | translate }}
            </p>
            <button class="w-full py-2.5 rounded-xl bg-white text-indigo-600 text-sm font-semibold shadow-sm hover:shadow-md transition-all border border-indigo-100">
              {{ 'CHECK_IT_OUT' | translate }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes fade-in-up {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in-up {
      animation: fade-in-up 0.5s ease-out forwards;
    }
  `]
})
export class DashboardComponent implements OnInit, OnDestroy {
  stats = signal<any>({ languages: 0, translations: 0, pages: 0, menus: 0 });
  activityLogs = signal<any[]>([]);
  systemStatus = signal<any>(null);

  currentTime: Date = new Date();
  private timer: any;

  constructor(
    private http: HttpClient,
    private dashboardService: DashboardService
  ) { }

  ngOnInit() {
    this.fetchStats();
    this.fetchActivity();
    this.fetchSystemStatus();

    this.timer = setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  fetchStats() {
    this.http.get<any[]>('/api/languages').subscribe(d => this.stats.update(s => ({ ...s, languages: d.length })));
    this.http.get<any[]>('/api/translations/keys').subscribe(d => this.stats.update(s => ({ ...s, translations: d.length })));
    this.http.get<any[]>('/api/pages').subscribe(d => this.stats.update(s => ({ ...s, pages: d.length })));
    this.http.get<any[]>('/api/menus').subscribe(d => this.stats.update(s => ({ ...s, menus: d.length })));
  }

  fetchActivity() {
    this.dashboardService.getAuditLogs().subscribe((res: any) => { // Updated to accept paginated response
      const logs = res.data || []; // Extract data array
      this.activityLogs.set(logs.map((log: AuditLog) => ({
        ...log,
        // SQLite CURRENT_TIMESTAMP is UTC but lacks 'Z'. Append it to ensure browser treats it as UTC.
        created_at: log.created_at.endsWith('Z') ? log.created_at : log.created_at + 'Z'
      })));
    });
  }

  fetchSystemStatus() {
    this.dashboardService.getSystemStatus().subscribe((status: SystemStatus) => {
      this.systemStatus.set(status);
    });
  }

  greeting(): string {
    const hour = this.currentTime.getHours();
    if (hour < 12) return 'GREETING_MORNING';
    if (hour < 18) return 'GREETING_AFTERNOON';
    return 'GREETING_EVENING';
  }

  getLogColor(type: string): string {
    switch (type) {
      case 'content': return 'bg-blue-400';
      case 'system': return 'bg-emerald-400';
      case 'security': return 'bg-red-400';
      default: return 'bg-slate-400';
    }
  }
}
