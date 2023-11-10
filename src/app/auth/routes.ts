import { Route, Routes } from '@angular/router';

import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';

export const authRoutes: Routes = [{
    path: '',
    component: AuthLayoutComponent,
    children: [
        {
            path: 'login',
            loadChildren: () => import('./pages/login-page/login-page.component').then(m => m.LoginPageComponent),
        },
        {
            path: 'register',
            loadChildren: () => import('./pages/register-page/register-page.component').then(m => m.RegisterPageComponent),
        },
        {
            path: 'about',
            loadChildren: () => import('./pages/about-page/about-page.component').then(m => m.AboutPageComponent),
        },
        { path: '**', redirectTo: 'register' },
    ],
}] as Route[];