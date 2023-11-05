import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { emailDiffersFromOld, emailPattern, isFieldOneEqualFieldTwo } from '../../../../shared/validators/validators';
import { AuthService } from '../../../../auth/services/auth.service';

@Component({
    selector: 'panel-account-management',
    templateUrl: './account-management.component.html',
})
export class AccountManagementComponent {

    public readonly authService = inject(AuthService);
    private readonly fb = inject(FormBuilder);

    public emailUpdatingForm = this.fb.group({
        email: [
            this.authService.currentUser()?.email,
            [
                Validators.required,
                Validators.pattern(emailPattern),
                emailDiffersFromOld(this.authService.currentUser()?.email),
            ],
        ],
    });

    public passwordUpdatingForm = this.fb.group({
        currentPassword: [
            '',
            [Validators.required, Validators.minLength(6)],
        ],
        newPassword: [
            '',
            [Validators.required, Validators.minLength(6)],
        ],
        repeatNewPassword: [
            '',
            [Validators.required, Validators.minLength(6)],
        ],
    }, {
        validators: [
            isFieldOneEqualFieldTwo('newPassword', 'repeatNewPassword'),
        ],
    });

    public updateEmail() {
        this.emailUpdatingForm.markAllAsTouched();
        const { email } = this.emailUpdatingForm.value;
        if (this.emailUpdatingForm.invalid || !email) return;
        this.authService.updateEmail(email).subscribe({
            next: response => {
                console.log(response);
            },
        });
    }

    public updatePassword() {
        this.passwordUpdatingForm.markAllAsTouched();
        const { currentPassword, newPassword } = this.passwordUpdatingForm.value;
        if (this.passwordUpdatingForm.invalid || !currentPassword || !newPassword) return;
        this.authService.updatePassword(currentPassword, newPassword).subscribe();
    }
}
