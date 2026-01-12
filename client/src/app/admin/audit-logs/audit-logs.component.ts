import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuditLogService, AuditLog } from '../../core/services/audit-log.service';

@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 animate-fade-in relative pb-10">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Audit Logs</h1>
          <p class="text-sm text-slate-500 mt-1">Track system activities and user operations</p>
        </div>
        
        <div class="flex items-center gap-2 self-end sm:self-auto">
            <button (click)="loadLogs()" [disabled]="loading()" class="p-2 text-slate-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 disabled:opacity-50" title="Refresh">
                <svg class="w-5 h-5" [class.animate-spin]="loading()" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
            </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div class="relative">
            <label class="block text-xs font-semibold text-slate-500 mb-1.5 ml-1">Filter by Action</label>
            <div class="relative">
                <select [(ngModel)]="filterAction" (change)="onFilterChange()" class="w-full pl-3 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none text-slate-700">
                    <option value="">All Actions</option>
                    <option value="CREATE_USER">Create User</option>
                    <option value="UPDATE_USER">Update User</option>
                    <option value="DELETE_USER">Delete User</option>
                    <option value="UPDATE_PASSWORD">Password Change</option>
                    <option value="LOGIN">Login</option>
                </select>
                <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-500">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
            </div>
        </div>
      </div>

      <!-- Content Area -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        
        <!-- Desktop Table (Hidden on Mobile) -->
        <div class="hidden md:block overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-200">
                <th class="px-6 py-4 font-semibold text-slate-700 w-48">Timestamp</th>
                <th class="px-6 py-4 font-semibold text-slate-700 w-48">User</th>
                <th class="px-6 py-4 font-semibold text-slate-700 w-32">Role</th>
                <th class="px-6 py-4 font-semibold text-slate-700 w-40">Action</th>
                <th class="px-6 py-4 font-semibold text-slate-700">Target</th>
                <th class="px-6 py-4 font-semibold text-slate-700 w-32">IP Address</th>
                <th class="px-6 py-4 font-semibold text-slate-700 w-24">Status</th>
                <th class="px-6 py-4 w-20"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr *ngFor="let log of logs()" class="hover:bg-slate-50 transition-colors group">
                <td class="px-6 py-4 text-slate-500 whitespace-nowrap font-mono text-xs">
                  {{ log.created_at | date:'medium' }}
                </td>
                <td class="px-6 py-4 font-medium text-slate-900">
                    <div class="flex items-center gap-2">
                        <div class="w-7 h-7 min-w-[1.75rem] rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs text-slate-600 font-bold">
                            {{ log.username?.charAt(0)?.toUpperCase() || '?' }}
                        </div>
                        <span class="truncate max-w-[8rem]">{{ log.username || 'System' }}</span>
                    </div>
                </td>
                 <td class="px-6 py-4 text-slate-500">
                    <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                        {{ log.role }}
                    </span>
                 </td>
                <td class="px-6 py-4">
                   <div class="flex items-center">
                       <span class="font-mono text-xs text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100 font-medium">
                         {{ log.action }}
                       </span>
                   </div>
                </td>
                <td class="px-6 py-4 text-slate-600">
                    <div class="flex flex-col">
                        <span class="text-xs font-medium text-slate-700">{{ log.resource_type }}</span>
                        <span class="text-[10px] text-slate-400 font-mono" *ngIf="log.resource_id">#{{ log.resource_id }}</span>
                    </div>
                </td>
                <td class="px-6 py-4 text-slate-500 font-mono text-xs">{{ log.ip_address }}</td>
                <td class="px-6 py-4">
                  <span 
                    class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ring-1 ring-inset"
                    [ngClass]="{
                      'bg-emerald-50 text-emerald-700 ring-emerald-600/20': log.status === 'SUCCESS',
                      'bg-red-50 text-red-700 ring-red-600/20': log.status !== 'SUCCESS'
                    }"
                  >
                    <span class="w-1.5 h-1.5 rounded-full" [ngClass]="log.status === 'SUCCESS' ? 'bg-emerald-500' : 'bg-red-500'"></span>
                    {{ log.status }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                    <button (click)="viewDetails(log)" class="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                        <span class="sr-only">View</span>
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Card View (Visible on Mobile) -->
        <div class="md:hidden divide-y divide-slate-100">
            <div *ngFor="let log of logs()" class="p-4 hover:bg-slate-50 transition-colors active:bg-slate-100" (click)="viewDetails(log)">
                <div class="flex justify-between items-start mb-3">
                    <div class="flex items-center gap-3">
                         <div class="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs text-slate-600 font-bold">
                            {{ log.username?.charAt(0)?.toUpperCase() || '?' }}
                        </div>
                        <div>
                            <div class="text-sm font-semibold text-slate-900">{{ log.username || 'System' }}</div>
                            <div class="text-xs text-slate-500">{{ log.created_at | date:'MMM d, h:mm a' }}</div>
                        </div>
                    </div>
                    <span 
                        class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ring-1 ring-inset"
                        [ngClass]="{
                            'bg-emerald-50 text-emerald-700 ring-emerald-600/20': log.status === 'SUCCESS',
                            'bg-red-50 text-red-700 ring-red-600/20': log.status !== 'SUCCESS'
                        }"
                    >
                        {{ log.status }}
                    </span>
                </div>
                
                <div class="pl-11 space-y-2">
                    <div class="flex items-center justify-between">
                         <span class="font-mono text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 font-medium">
                             {{ log.action }}
                         </span>
                         <span class="text-xs text-slate-500 font-mono">{{ log.ip_address }}</span>
                    </div>
                    <div class="flex items-center text-xs text-slate-600">
                        <span class="font-medium mr-1.5 ">Target:</span>
                        <span>{{ log.resource_type }}</span>
                        <span class="text-slate-400 font-mono ml-1" *ngIf="log.resource_id">#{{ log.resource_id }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="logs().length === 0 && !loading()" class="px-6 py-12 text-center text-slate-500">
            <div class="flex flex-col items-center justify-center">
                <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <svg class="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <h3 class="text-base font-medium text-slate-900">No logs found</h3>
                <p class="text-sm mt-1">Try adjusting your filters or check back later.</p>
            </div>
        </div>
        
        <!-- Pagination -->
        <div class="px-4 sm:px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between bg-slate-50 gap-4">
            <div class="text-xs sm:text-sm text-slate-500 text-center sm:text-left">
                Showing <span class="font-medium text-slate-900">{{ offset() + 1 }}</span> to <span class="font-medium text-slate-900">{{ getEndRange() }}</span> of <span class="font-medium text-slate-900">{{ total() }}</span> results
            </div>
            <div class="flex gap-2 w-full sm:w-auto">
                <button 
                  [disabled]="offset() === 0 || loading()"
                  (click)="prevPage()"
                  class="flex-1 sm:flex-none justify-center px-4 py-2 border border-slate-300 rounded-lg bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95"
                >
                  Previous
                </button>
                <button 
                  [disabled]="getEndRange() >= total() || loading()"
                  (click)="nextPage()"
                  class="flex-1 sm:flex-none justify-center px-4 py-2 border border-slate-300 rounded-lg bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95"
                >
                  Next
                </button>
            </div>
        </div>
      </div>

      <!-- Detail Modal -->
      <div *ngIf="selectedLog()" class="fixed inset-0 z-[60] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" (click)="closeModal()"></div>
        
        <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          <div class="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-2xl border border-slate-100 w-full animate-modal-in">
            
            <!-- Modal Header -->
            <div class="bg-white px-4 py-4 sm:px-6 flex justify-between items-center border-b border-slate-100">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                        <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                    </div>
                    <div>
                        <h3 class="text-lg font-bold text-slate-900 leading-tight">Log Details</h3>
                        <p class="text-xs text-slate-400 font-mono">ID: #{{ selectedLog()?.id }}</p>
                    </div>
                </div>
                <button (click)="closeModal()" class="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all">
                    <span class="sr-only">Close</span>
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
            
            <!-- Modal Body -->
            <div class="px-4 py-5 sm:p-6 max-h-[70vh] overflow-y-auto bg-slate-50/50">
                <!-- Info Grid -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                     <div class="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                        <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">User Info</label>
                        <div class="flex items-center gap-2">
                             <div class="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold">
                                {{ selectedLog()?.username?.charAt(0)?.toUpperCase() || '?' }}
                            </div>
                            <div class="text-sm font-medium text-slate-900">{{ selectedLog()?.username || 'System' }}</div>
                            <span class="text-xs text-slate-400 ml-auto border border-slate-200 px-1.5 rounded">{{ selectedLog()?.role }}</span>
                        </div>
                     </div>
                     
                     <div class="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                        <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Action Type</label>
                        <div class="text-sm font-mono font-medium text-blue-600">{{ selectedLog()?.action }}</div>
                     </div>
                     
                     <div class="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                        <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Target Resource</label>
                        <div class="text-sm text-slate-900 border-b border-dashed border-slate-300 inline-block pb-0.5">{{ selectedLog()?.resource_type }}</div>
                        <span class="text-xs text-slate-400 ml-2 font-mono">#{{ selectedLog()?.resource_id }}</span>
                     </div>

                     <div class="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                        <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">IP & Time</label>
                        <div class="flex justify-between items-center">
                            <div class="text-xs font-mono text-slate-600">{{ selectedLog()?.ip_address }}</div>
                            <div class="text-xs text-slate-400">{{ selectedLog()?.created_at | date:'short' }}</div>
                        </div>
                     </div>
                </div>

                <!-- Payload -->
                <div class="relative group">
                    <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <span>Payload Data</span>
                        <div class="h-px bg-slate-200 flex-1"></div>
                    </label>
                    <div class="bg-slate-900 rounded-xl p-4 overflow-x-auto border border-slate-800 shadow-inner relative group">
                        <div class="absolute top-2 right-2 text-[10px] text-slate-600 font-mono">JSON</div>
                        <pre class="text-emerald-400 text-xs font-mono leading-relaxed">{{ formatDetails(selectedLog()?.details) }}</pre>
                    </div>
                </div>
            </div>
            
            <!-- Modal Footer -->
            <div class="bg-white px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-slate-100 gap-3">
              <button type="button" (click)="closeModal()" class="w-full inline-flex justify-center items-center rounded-lg border border-slate-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto transition-all">
                Close Details
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>

  `,
  styles: [`
    :host { display: block; }
    /* Simple fade in animation */
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in {
        animation: fadeIn 0.3s ease-out forwards;
    }
    @keyframes modalIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
    }
    .animate-modal-in {
        animation: modalIn 0.2s ease-out forwards;
    }
  `]
})
export class AuditLogsComponent implements OnInit {
  logs = signal<AuditLog[]>([]);
  total = signal(0);
  loading = signal(false);
  offset = signal(0);
  limit = 20;

  filterAction = '';

  selectedLog = signal<AuditLog | null>(null);

  constructor(private auditService: AuditLogService) { }

  ngOnInit() {
    this.loadLogs();
  }

  loadLogs() {
    this.loading.set(true);
    this.auditService.getLogs({
      limit: this.limit,
      offset: this.offset(),
      action: this.filterAction || undefined
    }).subscribe({
      next: (res) => {
        this.logs.set(res.data);
        this.total.set(res.total);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
      }
    });
  }

  onFilterChange() {
    this.offset.set(0);
    this.loadLogs();
  }

  nextPage() {
    if (this.offset() + this.limit < this.total()) {
      this.offset.update(v => v + this.limit);
      this.loadLogs();
    }
  }

  prevPage() {
    if (this.offset() > 0) {
      this.offset.update(v => Math.max(0, v - this.limit));
      this.loadLogs();
    }
  }

  getEndRange() {
    return Math.min(this.offset() + this.limit, this.total());
  }

  viewDetails(log: AuditLog) {
    this.selectedLog.set(log);
  }

  closeModal() {
    this.selectedLog.set(null);
  }

  formatDetails(details: string | undefined): string {
    if (!details) return '{}';
    try {
      // If it's already a string that looks like JSON, parse it first to format it
      const parsed = JSON.parse(details);
      return JSON.stringify(parsed, null, 2);
    } catch (e) {
      return details;
    }
  }
}
