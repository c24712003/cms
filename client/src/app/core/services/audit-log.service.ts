
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AuditLog {
    id: number;
    action: string;
    description?: string;
    type: string;
    username: string | null;
    role: string;
    resource_type: string;
    resource_id: string;
    details: string;
    ip_address: string;
    status: string;
    created_at: string;
}

export interface AuditLogResponse {
    data: AuditLog[];
    total: number;
    limit: number;
    offset: number;
}

@Injectable({
    providedIn: 'root'
})
export class AuditLogService {
    private http = inject(HttpClient);
    // Flexible API URL handling
    private apiUrl = environment.apiUrl ? `${environment.apiUrl}/audit-logs` : 'http://localhost:3000/api/audit-logs';

    getLogs(params: { limit: number; offset: number; action?: string; userId?: number }): Observable<AuditLogResponse> {
        let httpParams = new HttpParams()
            .set('limit', params.limit)
            .set('offset', params.offset)
            .set('_t', Date.now().toString()); // Prevent caching

        if (params.action) {
            httpParams = httpParams.set('action', params.action);
        }
        if (params.userId) {
            httpParams = httpParams.set('user_id', params.userId);
        }

        return this.http.get<AuditLogResponse>(this.apiUrl, { params: httpParams });
    }
}
