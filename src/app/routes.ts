import { Route, Routes } from '@angular/router';

import { isPublicGuard } from './auth/guards/is-public.guard';
import { isPrivateGuard } from './auth/guards/is-private.guard';

export const routes: Routes = [
    {
        path: 'auth',
        canActivate: [isPublicGuard],
        loadChildren: () => import('./auth/routes').then(m => m.authRoutes),
    },
    {
        path: 'dashboard',
        canActivate: [isPrivateGuard],
        loadChildren: () => import('./dashboard/routes').then(m => m.dashboardRoutes),
    },
    {
        path: '**',
        redirectTo: 'auth',
    },
] as Route[];