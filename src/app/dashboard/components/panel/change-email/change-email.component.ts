import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';

import { emailPattern } from '../../../../shared/validators/validators';
import { AuthService } from '../../../../auth/services/auth.service';
import { ErrorMessageDirective } from '../../../../shared/directives/error-message.directive';
import { DynamicButtonTextDirective } from '../../../../shared/directives/dynamic-button-text.directive';

@Component({
    standalone: true,
    selector: 'change-email',
    templateUrl: './change-email.component.html',
    imports: [
        NgIf,
        ErrorMessageDirective,
        ReactiveFormsModule,
        DynamicButtonTextDirective,
    ],
})
export class ChangeEmailComponent {

    public readonly authService = inject(AuthService);
    private readonly fb = inject(FormBuilder);
    public backendError: WritableSignal<string | null> = signal(null);
    public isLoading = signal(false);

    public emailUpdatingForm = this.fb.group({
        email: [
            this.authService.currentUser()?.email,
            [
                Validators.required,
                Validators.pattern(emailPattern),
            ],
        ],
    });

    public updateEmail(): void {
        this.emailUpdatingForm.markAllAsTouched();
        const { email } = this.emailUpdatingForm.value;
        if (this.emailUpdatingForm.invalid || !email) return;

        this.isLoading.set(true);
        this.backendError.set(null);

        this.authService.updateEmail(email).subscribe({
            next: () => {
                this.backendError.set(null);
                this.isLoading.set(false);
            },
            error: (error) => {
                this.backendError.set(error);
                this.isLoading.set(false);
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
