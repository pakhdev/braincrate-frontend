import { Component, computed, effect, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { AuthService } from './auth/services/auth.service';
import { AuthStatus } from './auth/enums/auth-status.enum';

@Component({
    standalone: true,
    imports: [RouterOutlet],
    selector: 'app-root',
    template: '<router-outlet></router-outlet>',
})
export class AppComponent {
    title = 'BrainCrate';
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);

    public finishedAuthCheck = computed<boolean>(() => {
        return this.authService.authStatus() !== AuthStatus.checking;
    });

    public authStatusChangedEffect = effect(() => {
        switch (this.authService.authStatus()) {
            case AuthStatus.checking:
                return;
            case AuthStatus.authenticated:
                if (['/auth/register', '/auth/login', '/auth/about']
                    .includes(window.location.pathname) || window.location.pathname === '/') {
                    this.router.navigateByUrl('/dashboard');
                }
                return;
            case AuthStatus.notAuthenticated:
                this.router.navigateByUrl('/auth/register');
                return;
        }
    });
}
