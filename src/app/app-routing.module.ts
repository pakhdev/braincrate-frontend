import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { isPrivateGuard } from './auth/guards/is-private.guard';
import { isPublicGuard } from './auth/guards/is-public.guard';

const routes: Routes = [
    {
        path: 'auth',
        canActivate: [isPublicGuard],
        loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
    },
    {
        path: 'dashboard',
        canActivate: [isPrivateGuard],
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
    },
    {
        path: '**',
        redirectTo: 'auth',
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {
}
