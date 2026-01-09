import { Routes } from '@angular/router';
import { App } from './app';

export const routes: Routes = [
    {
        path: 'admin/login',
        loadComponent: () => import('./admin/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'admin',
        loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES)
    },
    // Wildcard catch-all for SSR i18n or 404
    {
        path: ':lang/contact',
        loadComponent: () => import('./features/contact-form/contact-form.component').then(m => m.ContactFormComponent)
    },
    {
        path: ':lang/:slug',
        loadComponent: () => import('./features/dynamic-page/dynamic-page.component').then(m => m.DynamicPageComponent)
    },
    {
        path: ':lang',
        redirectTo: ':lang/home',
        pathMatch: 'full'
    },
    { path: '**', redirectTo: 'en/home' } // Fallback to default
];
