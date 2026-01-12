import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BoardingTemplate } from '../../shared/models/template.types';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class TemplateService {
    private apiUrl = `${environment.apiUrl}/templates`;

    constructor(private http: HttpClient) { }

    getTemplates(): Observable<BoardingTemplate[]> {
        return this.http.get<BoardingTemplate[]>(this.apiUrl);
    }

    instantiateTemplate(data: { templateId: string, variables: Record<string, string>, themeName: string }): Observable<{ success: boolean, pages: any[] }> {
        return this.http.post<{ success: boolean, pages: any[] }>(`${this.apiUrl}/instantiate`, data);
    }
}
