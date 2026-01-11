import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LanguageManagerComponent } from './language-manager/language-manager.component';
import { TranslationEditorComponent } from './translation-editor/translation-editor.component';
import { PageEditorComponent } from './page-editor/page-editor.component';
import { MediaManagerComponent } from './media-manager/media-manager.component';

import { authGuard } from '../core/guards/auth.guard';

export const ADMIN_ROUTES: Routes = [
    {
        path: '',
        component: AdminLayoutComponent,
        canActivate: [authGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: DashboardComponent },
            { path: 'languages', component: LanguageManagerComponent },
            { path: 'translations', component: TranslationEditorComponent },
            { path: 'pages', component: PageEditorComponent },
            { path: 'media', component: MediaManagerComponent },
            { path: 'users', loadComponent: () => import('./user-management/user-management.component').then(m => m.UserManagementComponent) },
            { path: 'menus/:code', loadComponent: () => import('./menu-builder/menu-builder.component').then(m => m.MenuBuilderComponent) }
        ]
    }
];
