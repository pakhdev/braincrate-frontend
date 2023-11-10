import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';

import { emailDiffersFromOld, emailPattern } from '../../../../shared/validators/validators';
import { AuthService } from '../../../../auth/services/auth.service';
import { ErrorMessageDirective } from '../../../../shared/directives/error-message.directive';

@Component({
    standalone: true,
    selector: 'change-email',
    templateUrl: './change-email.component.html',
    imports: [
        NgIf,
        ErrorMessageDirective,
        ReactiveFormsModule,
    ],
})
export class ChangeEmailComponent {

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

    public updateEmail(): void {
        this.emailUpdatingForm.markAllAsTouched();
        const { email } = this.emailUpdatingForm.value;
        if (this.emailUpdatingForm.invalid || !email) return;
        this.authService.updateEmail(email).subscribe({
            next: response => {
                console.log(response);
            },
        });
    }

    public hasError(field: string): boolean | null {
        return this.authService.hasError(this.emailUpdatingForm, field);
    }

    public getError(field: string): ValidationErrors | null | undefined {
        return this.emailUpdatingForm.get(field)?.errors;
    }
}
