import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-900">
      <!-- Animated Background Effects -->
      <div class="absolute inset-0 z-0">
        <div class="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div class="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div class="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div class="w-full max-w-md relative z-10">
        <!-- Logo -->
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold tracking-tight text-white mb-2">
            <span>CMS</span><span class="text-blue-400">Admin</span>
          </h1>
          <p class="text-slate-400">Welcome back! Please sign in to continue.</p>
        </div>

        <!-- Login Card -->
        <div class="glass-panel rounded-2xl p-8 backdrop-blur-xl bg-white/10 border border-white/10 shadow-2xl">
          <form (ngSubmit)="login()" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2 ml-1">Username</label>
              <div class="relative">
                <input type="text" 
                       [(ngModel)]="username" 
                       name="username" 
                       class="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                       placeholder="Enter your username" 
                       required />
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2 ml-1">Password</label>
              <div class="relative">
                <input type="password" 
                       [(ngModel)]="password" 
                       name="password" 
                       class="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                       placeholder="Enter your password" 
                       required />
              </div>
            </div>

            <div *ngIf="error()" class="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-sm text-red-200">
              <svg class="w-5 h-5 flex-shrink-0 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ error() }}
            </div>

            <button type="submit" 
                    class="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    [disabled]="isLoading()">
              <span *ngIf="isLoading()" class="animate-spin">
                <svg class="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              {{ isLoading() ? 'Signing in...' : 'Sign In' }}
            </button>
          </form>
        </div>

        <!-- Footer -->
        <p class="text-center text-sm text-slate-500 mt-8">
          <a href="/" class="text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to public site
          </a>
        </p>
      </div>
    </div>
  `
})
export class LoginComponent {
  username = '';
  password = '';
  error = signal('');
  isLoading = signal(false);

  constructor(private authService: AuthService, private router: Router) { }

  login() {
    this.isLoading.set(true);
    this.error.set('');

    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        this.router.navigate(['/admin/dashboard']);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Invalid credentials');
        this.isLoading.set(false);
      }
    });
  }
}
