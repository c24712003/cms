import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule],
    template: `
    <h1>Dashboard</h1>
    <div class="stats-grid">
        <div class="stat-card">
            <h3>Languages</h3>
            <p class="number">{{ langCount() }}</p>
        </div>
        <div class="stat-card">
            <h3>Pages</h3>
            <p class="number">{{ pageCount() }}</p>
        </div>
    </div>
  `,
    styles: [`
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; }
    .stat-card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
    .stat-card h3 { margin: 0 0 10px 0; color: #7f8c8d; font-size: 0.9rem; text-transform: uppercase; }
    .number { font-size: 2.5rem; font-weight: bold; margin: 0; color: #2c3e50; }
  `]
})
export class DashboardComponent {
    langCount = signal(0);
    pageCount = signal(0);

    constructor(private http: HttpClient) {
        this.http.get<any[]>('http://localhost:3000/api/languages').subscribe(d => this.langCount.set(d.length));
        this.http.get<any[]>('http://localhost:3000/api/pages').subscribe(d => this.pageCount.set(d.length));
    }
}
