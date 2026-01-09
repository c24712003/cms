import { Injectable, signal, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly TOKEN_KEY = 'cms_auth_token';
    readonly currentUser = signal<any>(null);
    readonly isLoggedIn = signal<boolean>(false);

    constructor(
        private http: HttpClient,
        private router: Router,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        if (isPlatformBrowser(this.platformId)) {
            this.loadToken();
        }
    }

    login(username: string, password: string) {
        return this.http.post<any>('/api/auth/login', { username, password }).pipe(
            tap(res => {
                if (isPlatformBrowser(this.platformId)) {
                    localStorage.setItem(this.TOKEN_KEY, res.token);
                }
                this.currentUser.set(res.user);
                this.isLoggedIn.set(true);
            })
        );
    }

    logout() {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem(this.TOKEN_KEY);
        }
        this.currentUser.set(null);
        this.isLoggedIn.set(false);
        this.router.navigate(['/admin/login']);
    }

    getToken(): string | null {
        if (isPlatformBrowser(this.platformId)) {
            return localStorage.getItem(this.TOKEN_KEY);
        }
        return null;
    }

    private loadToken() {
        const token = this.getToken();
        if (token) {
            // Optionally verify token with backend /me endpoint here
            this.isLoggedIn.set(true);
            // Decode token or fetch user details if needed
        }
    }
}
