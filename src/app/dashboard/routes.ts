import { Route, Routes } from '@angular/router';

import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';

export const dashboardRoutes: Routes = [{
    path: '',
    component: DashboardLayoutComponent,
    children: [
        {
            path: 'all',
            loadComponent: () => import('./pages/all-notes-page/all-notes-page.component').then(c => c.AllNotesPageComponent),
        },
        {
            path: 'for-review',
            loadComponent: () => import('./pages/review-notes-page/review-notes-page.component').then(c => c.ReviewNotesPageComponent),
        },
        {
            path: 'new-note',
            loadComponent: () => import('./pages/new-note-page/new-note-page.component').then(c => c.NewNotePageComponent),
        },
        { path: '', redirectTo: 'all', pathMatch: 'full' },
    ],
}] as Route[];