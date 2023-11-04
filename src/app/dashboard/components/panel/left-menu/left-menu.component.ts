import { Component, EventEmitter, inject, Output } from '@angular/core';
import { AuthService } from '../../../../auth/services/auth.service';

@Component({
    selector: 'dashboard-left-menu',
    templateUrl: './left-menu.component.html',
})
export class LeftMenuComponent {
    @Output() public activateManagementView: EventEmitter<'notes' | 'account'> = new EventEmitter();
    private authService = inject(AuthService);

    public activateManagementViewHandler(view: 'notes' | 'account'): void {
        this.activateManagementView.emit(view);
    }

    public logout(): void {
        this.authService.logout();
    }
}
