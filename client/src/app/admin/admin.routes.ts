import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LanguageManagerComponent } from './language-manager/language-manager.component';
import { TranslationEditorComponent } from './translation-editor/translation-editor.component';
import { PageEditorComponent } from './page-editor/page-editor.component';

export const ADMIN_ROUTES: Routes = [
    {
        path: '',
        component: AdminLayoutComponent,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: DashboardComponent },
            { path: 'languages', component: LanguageManagerComponent },
            { path: 'translations', component: TranslationEditorComponent },
            { path: 'pages', component: PageEditorComponent }
        ]
    }
];
