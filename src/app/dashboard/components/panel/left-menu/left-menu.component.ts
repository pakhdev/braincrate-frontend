import { Component, inject } from '@angular/core';
import { AuthService } from '../../../../auth/services/auth.service';

@Component({
    selector: 'dashboard-left-menu',
    templateUrl: './left-menu.component.html',
})
export class LeftMenuComponent {
    private authService = inject(AuthService);

    public logout(): void {
        this.authService.logout();
    }
}
