import { Component } from '@angular/core';
import { NgIf } from '@angular/common';

import { ChangePasswordComponent } from '../change-password/change-password.component';
import { ChangeEmailComponent } from '../change-email/change-email.component';
import { LinkGoogleComponent } from '../link-google/link-google.component';

@Component({
    standalone: true,
    selector: 'account-management',
    templateUrl: './account-management.component.html',
    imports: [
        NgIf,
        ChangePasswordComponent,
        ChangeEmailComponent,
        LinkGoogleComponent,
    ],
})
export class AccountManagementComponent {

}
