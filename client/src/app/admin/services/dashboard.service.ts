import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AuditLog {
    id: number;
    action: string;
    description: string;
    type: string;
    user_id?: number | null;
    created_at: string;
}

export interface SystemStatus {
    status: string;
    database: string;
    server_time: string;
    version: string;
    memory: {
        rss: string;
        heapTotal: string;
        heapUsed: string;
    };
}

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    private apiUrl = '/api';

    constructor(private http: HttpClient) { }

    getAuditLogs(limit: number = 5): Observable<AuditLog[]> {
        return this.http.get<AuditLog[]>(`${this.apiUrl}/audit-logs?limit=${limit}`);
    }

    getSystemStatus(): Observable<SystemStatus> {
        return this.http.get<SystemStatus>(`${this.apiUrl}/health`);
    }
}
