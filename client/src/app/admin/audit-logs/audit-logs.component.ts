import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { I18nService } from '../../core/services/i18n.service';

export interface AuditLog {
  id: number;
  user_id?: number;
  username?: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  details?: string;
  ip_address: string;
  status: string;
  created_at: string;
  // mapped fields for display if needed
  role?: string;
  target_resource?: string;
}

@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  template: `
    <div class="space-y-6 animate-fade-in relative pb-10">
      <!-- Header -->
      <div class="mb-8">
         <h1 class="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">{{ 'AUDIT_LOGS_TITLE' | translate }}</h1>
         <p class="text-slate-500 dark:text-slate-400 mt-2 text-lg">{{ 'AUDIT_LOGS_SUBTITLE' | translate }}</p>
      </div>

      <!-- Filters & Controls -->
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div class="flex items-center gap-3 w-full md:w-auto">
             <div class="relative w-full md:w-64">
                <select [(ngModel)]="filterAction" class="appearance-none w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 py-2.5 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer font-medium">
                   <option *ngFor="let type of actionTypes" [value]="type.value">{{ type.label | translate }}</option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500 dark:text-slate-400">
                  <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
             </div>
          </div>
          
          <div class="text-slate-500 dark:text-slate-400 text-sm font-medium">
             {{ filteredLogs().length }} records found
          </div>
      </div>

      <!-- Logs Table -->
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50/50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-600 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">
                <th class="px-6 py-4 whitespace-nowrap">{{ 'TBL_TIMESTAMP' | translate }}</th>
                <th class="px-6 py-4 whitespace-nowrap">{{ 'LABEL_USERNAME' | translate }}</th>
                <th class="px-6 py-4 whitespace-nowrap text-center">{{ 'TBL_ROLE' | translate }}</th>
                <th class="px-6 py-4 whitespace-nowrap">{{ 'TBL_ACTION' | translate }}</th>
                <th class="px-6 py-4 whitespace-nowrap">{{ 'TBL_TARGET' | translate }}</th>
                <th class="px-6 py-4 whitespace-nowrap">{{ 'TBL_IP' | translate }}</th>
                <th class="px-6 py-4 whitespace-nowrap text-center">{{ 'TBL_STATUS' | translate }}</th>
                <th class="px-6 py-4 whitespace-nowrap text-right"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
              <tr *ngFor="let log of filteredLogs()" class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border-b border-slate-100 dark:border-slate-700 last:border-0 group cursor-pointer" (click)="viewDetails(log)">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400 font-mono">
                   {{ log.created_at | date:'MMM d, HH:mm:ss' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                   <div class="flex items-center">
                      <div class="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold mr-3">
                         {{ log.username?.charAt(0) | uppercase }}
                      </div>
                      <div class="text-sm font-medium text-slate-900 dark:text-white">{{ log.username || 'System' }}</div>
                   </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                    <span class="px-2 py-1 text-xs font-bold rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 uppercase">{{ log.role || 'N/A' }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                   <div class="text-sm font-bold text-slate-700 dark:text-slate-200">{{ formatAction(log.action) | translate }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                   <div class="text-sm text-slate-500 dark:text-slate-400 font-mono bg-slate-50 dark:bg-slate-700 px-2 py-1 rounded inline-block border border-slate-100 dark:border-slate-600 max-w-[150px] truncate" [title]="log.resource_type">
                      {{ log.resource_type || '-' }} <span *ngIf="log.resource_id">#{{log.resource_id}}</span>
                   </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                   {{ log.ip_address }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                   <span class="px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide" [ngClass]="getStatusClass(log.status)">
                      {{ log.status }}
                   </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                   <button class="text-blue-600 hover:text-blue-900 opacity-0 group-hover:opacity-100 transition-opacity" title="View Details">
                      <i class="fas fa-eye"></i>
                   </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

       <!-- Empty State -->
      <div *ngIf="filteredLogs().length === 0" class="p-12 text-center flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 border-dashed mt-6">
          <div class="w-16 h-16 bg-slate-50 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
             <i class="fas fa-search text-2xl text-slate-300 dark:text-slate-500"></i>
          </div>
          <h3 class="text-lg font-medium text-slate-600 dark:text-slate-300">{{ 'MSG_NO_LOGS' | translate }}</h3>
          <p class="text-sm mt-1">{{ 'MSG_NO_LOGS_SUB' | translate }}</p>
      </div>

      <!-- Detail Modal -->
      <div *ngIf="selectedLog" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" (click)="closeDetails()">
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in" (click)="$event.stopPropagation()">
            <div class="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-700/50">
                <div>
                   <h3 class="text-xl font-bold text-slate-800 dark:text-white">{{ 'MODAL_LOG_DETAILS' | translate }}</h3>
                   <span class="text-s text-slate-500 dark:text-slate-400 font-mono mt-1 block">ID: #{{ selectedLog.id }}</span>
                </div>
                <button (click)="closeDetails()" class="p-2 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full transition-colors text-slate-500 dark:text-slate-400">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
            </div>
            
            <div class="p-6 space-y-6">
                <!-- User Section -->
                <div class="flex items-start gap-4 p-4 bg-blue-50/50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                    <div class="w-10 h-10 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm text-blue-600 dark:text-blue-400 font-bold text-lg">
                        {{ selectedLog.username?.charAt(0) | uppercase}}
                    </div>
                    <div>
                        <h4 class="text-sm font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wider mb-1">{{ 'LABEL_USER_INFO' | translate }}</h4>
                        <div class="text-slate-800 dark:text-white font-medium">{{ selectedLog.username }}</div>
                        <div class="text-slate-500 dark:text-slate-400 text-sm flex gap-2 items-center mt-1">
                            <span class="px-2 py-0.5 bg-white dark:bg-slate-700 rounded border border-blue-200 dark:border-blue-700 text-xs font-bold text-blue-600 dark:text-blue-400">{{ selectedLog.role }}</span>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <!-- Action Info -->
                     <div class="space-y-1">
                        <label class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{{ 'LABEL_ACTION_TYPE' | translate }}</label>
                        <div class="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 font-medium text-slate-700 dark:text-slate-200 flex items-center gap-2">
                             <span class="w-2 h-2 rounded-full" [class.bg-green-500]="selectedLog.status === 'success'" [class.bg-red-500]="selectedLog.status === 'failure'"></span>
                             {{ formatAction(selectedLog.action) | translate }}
                        </div>
                     </div>

                     <!-- Target Info -->
                     <div class="space-y-1">
                        <label class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{{ 'LABEL_TARGET_RESOURCE' | translate }}</label>
                        <div class="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 font-medium text-slate-700 dark:text-slate-200 font-mono text-sm">
                             {{ selectedLog.resource_type }} <span *ngIf="selectedLog.resource_id">#{{selectedLog.resource_id}}</span>
                        </div>
                     </div>
                </div>

                <!-- Timing & IP -->
                <div class="bg-slate-50 dark:bg-slate-700 rounded-xl p-4 border border-slate-200 dark:border-slate-600">
                    <h4 class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">{{ 'LABEL_IP_TIME' | translate }}</h4>
                    <div class="flex justify-between items-center text-sm">
                        <span class="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                            <i class="fas fa-globe text-slate-400"></i> {{ selectedLog.ip_address }}
                        </span>
                        <span class="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                            <i class="far fa-clock text-slate-400"></i> {{ selectedLog.created_at | date:'medium' }}
                        </span>
                    </div>
                </div>

                <!-- Payload -->
                <div *ngIf="selectedLog.details">
                    <label class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 block">{{ 'LABEL_PAYLOAD' | translate }}</label>
                    <pre class="bg-slate-900 text-slate-50 p-4 rounded-xl text-xs font-mono overflow-x-auto text-green-400 shadow-inner custom-scrollbar">{{ selectedLog.details | json }}</pre>
                </div>
            </div>

            <div class="p-6 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-700/50 flex justify-end">
                <button (click)="closeDetails()" class="px-6 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-bold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-500 transition-all shadow-sm">
                    {{ 'BTN_CLOSE_DETAILS' | translate }}
                </button>
            </div>
        </div>
      </div>
    </div>
  `
})
export class AuditLogsComponent implements OnInit {
  logs = signal<AuditLog[]>([]);
  filteredLogs = computed(() => {
    if (this.filterAction === 'ALL') return this.logs();
    return this.logs().filter(l => l.action === this.filterAction);
  });

  filterAction = 'ALL';
  selectedLog: AuditLog | null = null;

  actionTypes = [
    { value: 'ALL', label: 'ACTION_ALL' },
    { value: 'CREATE_USER', label: 'ACTION_CREATE_USER' },
    { value: 'UPDATE_USER', label: 'ACTION_UPDATE_USER' },
    { value: 'DELETE_USER', label: 'ACTION_DELETE_USER' },
    { value: 'UPDATE_PASSWORD', label: 'ACTION_UPDATE_PASSWORD' },
    { value: 'LOGIN', label: 'ACTION_LOGIN' }
  ];

  constructor(private http: HttpClient, private i18n: I18nService) { }

  ngOnInit() {
    this.loadLogs();
  }

  loadLogs() {
    this.http.get<AuditLog[]>('/api/audit-logs').subscribe(data => {
      // Sort by id desc for now since timestamp might be same
      this.logs.set(data.sort((a, b) => b.id - a.id));
    });
  }

  viewDetails(log: AuditLog) {
    this.selectedLog = log;
  }

  closeDetails() {
    this.selectedLog = null;
  }

  formatAction(action: string): string {
    return 'ACTION_' + action;
  }

  getStatusClass(status: string): string {
    return status === 'success'
      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
      : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800';
  }
}
