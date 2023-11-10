import { Component } from '@angular/core';
import { NgIf } from '@angular/common';

import { ChangePasswordComponent } from '../change-password/change-password.component';
import { ChangeEmailComponent } from '../change-email/change-email.component';

@Component({
    standalone: true,
    selector: 'account-management',
    templateUrl: './account-management.component.html',
    imports: [
        NgIf,
        ChangePasswordComponent,
        ChangeEmailComponent,
    ],
})
export class AccountManagementComponent {

}
