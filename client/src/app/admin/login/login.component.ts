import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { I18nService } from '../../core/services/i18n.service';
import { ThemeService } from '../../core/services/theme.service';
import { TranslatePipe } from '../../core/pipes/translate.pipe';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  template: `
    <div class="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-100 dark:bg-slate-900 transition-colors duration-200">
      <!-- Animated Background Effects -->
      <div class="absolute inset-0 z-0">
        <div class="absolute top-0 -left-4 w-72 h-72 bg-purple-400 dark:bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div class="absolute top-0 -right-4 w-72 h-72 bg-blue-400 dark:bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div class="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-400 dark:bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div class="w-full max-w-md relative z-10">
        <!-- Logo -->
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold tracking-tight text-slate-800 dark:text-white mb-2">
            <span>CMS</span><span class="text-blue-600 dark:text-blue-400">Admin</span>
          </h1>
          <p class="text-slate-600 dark:text-slate-300">{{ 'LOGIN_WELCOME' | translate }}</p>
        </div>

        <!-- Login Card -->
        <div class="login-card rounded-2xl p-8 backdrop-blur-xl shadow-2xl">
          <form (ngSubmit)="login()" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-white mb-2 ml-1">{{ 'LABEL_USERNAME' | translate }}</label>
              <div class="relative">
                <input type="text" 
                       [(ngModel)]="username" 
                       name="username" 
                       class="w-full px-4 py-3 bg-white dark:bg-slate-800/70 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                       [placeholder]="'LOGIN_USERNAME_PLACEHOLDER' | translate" 
                       required />
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-white mb-2 ml-1">{{ 'LABEL_PASSWORD' | translate }}</label>
              <div class="relative">
                <input type="password" 
                       [(ngModel)]="password" 
                       name="password" 
                       class="w-full px-4 py-3 bg-white dark:bg-slate-800/70 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                       [placeholder]="'LOGIN_PASSWORD_PLACEHOLDER' | translate" 
                       required />
              </div>
            </div>

            <div *ngIf="error()" class="p-4 bg-red-100 dark:bg-red-900/40 border border-red-300 dark:border-red-500/40 rounded-xl flex items-center gap-3 text-sm text-red-700 dark:text-red-300">
              <svg class="w-5 h-5 flex-shrink-0 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              {{ isLoading() ? ('LOGIN_SIGNING_IN' | translate) : ('LOGIN_SIGN_IN' | translate) }}
            </button>
          </form>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between mt-8">
          <p class="text-sm text-slate-500 dark:text-slate-400">
            <a href="/" class="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {{ 'LOGIN_BACK_TO_SITE' | translate }}
            </a>
          </p>
          <!-- Theme Toggle -->
          <button 
            (click)="toggleTheme()" 
            class="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700"
            title="Toggle theme"
          >
            <svg *ngIf="themeService.effectiveTheme() === 'dark'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <svg *ngIf="themeService.effectiveTheme() === 'light'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-card {
      background: rgba(255, 255, 255, 0.9);
      border: 1px solid rgba(226, 232, 240, 0.8);
    }
    
    :host-context(.dark) .login-card {
      background: rgba(30, 41, 59, 0.8);
      border: 1px solid rgba(71, 85, 105, 0.5);
    }
  `]
})
export class LoginComponent {
  username = '';
  password = '';
  error = signal('');
  isLoading = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router,
    private i18n: I18nService,
    public themeService: ThemeService
  ) {
    // Initialize i18n to detect browser language
    this.i18n.initLanguage();
    // Initialize theme
    this.themeService.initTheme();
  }

  toggleTheme() {
    this.themeService.toggleLightDark();
  }

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
