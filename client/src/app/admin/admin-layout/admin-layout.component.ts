import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <div class="admin-container">
      <nav class="sidebar">
        <h2>CMS Admin</h2>
        <ul>
          <li><a routerLink="dashboard" routerLinkActive="active">Dashboard</a></li>
          <li><a routerLink="languages" routerLinkActive="active">Languages</a></li>
          <li><a routerLink="translations" routerLinkActive="active">Translations</a></li>
          <li><a routerLink="pages" routerLinkActive="active">Pages</a></li>
          <li><a routerLink="media" routerLinkActive="active">Media Library</a></li>
          <li><a routerLink="menus" routerLinkActive="active">Menus</a></li>
        </ul>
        <div class="user-actions" style="padding: 20px; text-align: center;">
            <button (click)="logout()" style="padding: 8px 16px; background: #e74c3c; color: white; border: none; borderRadius: 4px; cursor: pointer;">Logout</button>
        </div>
        <div class="footer">
            <a routerLink="/" target="_blank">View Site</a>
        </div>
      </nav>
      <main class="content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .admin-container { display: flex; height: 100vh; }
    .sidebar { width: 250px; background: #2c3e50; color: white; display: flex; flex-direction: column; }
    .sidebar h2 { padding: 20px; margin: 0; background: #1a252f; text-align: center; }
    .sidebar ul { list-style: none; padding: 0; margin: 0; flex: 1; }
    .sidebar li a { display: block; padding: 15px 20px; color: #ecf0f1; text-decoration: none; border-bottom: 1px solid #34495e; transition: background 0.3s; }
    .sidebar li a:hover, .sidebar li a.active { background: #34495e; color: #1abc9c; }
    .content { flex: 1; padding: 30px; overflow-y: auto; background: #ecf0f1; }
    .footer { padding: 20px; text-align: center; border-top: 1px solid #34495e; }
    .footer a { color: #bdc3c7; text-decoration: none; }
  `]
})
export class AdminLayoutComponent {
  constructor(private authService: AuthService) { }

  logout() {
    this.authService.logout();
  }
}
