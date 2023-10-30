import { Component, computed, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth/services/auth.service';
import { AuthStatus } from './auth/enums/auth-status.enum';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
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
                this.router.navigateByUrl('/dashboard');
                return;
            case AuthStatus.notAuthenticated:
                this.router.navigateByUrl('/auth/register');
                return;
        }
    });
}
