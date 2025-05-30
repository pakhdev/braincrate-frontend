import { Component, inject } from '@angular/core';

import { ChangePasswordComponent } from '../change-password/change-password.component';
import { ChangeEmailComponent } from '../change-email/change-email.component';
import { LinkGoogleComponent } from '../link-google/link-google.component';
import { AuthService } from '../../../../auth/services/auth.service';

@Component({
    selector: 'account-management',
    templateUrl: './account-management.component.html',
    imports: [
        ChangePasswordComponent,
        ChangeEmailComponent,
        LinkGoogleComponent,
    ]
})
export class AccountManagementComponent {
    private readonly authService = inject(AuthService);

    get passwordSectionName(): string {
        return this.authService.currentUser()?.hasPass ? 'Cambiar la contraseña' : 'Crear una contraseña';
    }

    get showCurrentPasswordInput(): boolean {
        const hasPass = this.authService.currentUser()?.hasPass;
        return hasPass !== undefined && hasPass;
    }
}
