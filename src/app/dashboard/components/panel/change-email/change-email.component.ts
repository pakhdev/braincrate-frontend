import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';

import { AuthService } from '../../../../auth/services/auth.service';
import { DynamicButtonTextDirective } from '../../../../shared/directives/dynamic-button-text.directive';
import { ErrorMessageDirective } from '../../../../shared/directives/error-message.directive';
import { emailPattern } from '../../../../shared/validators/validators';

@Component({
    standalone: true,
    selector: 'change-email',
    templateUrl: './change-email.component.html',
    imports: [
        ErrorMessageDirective,
        ReactiveFormsModule,
        DynamicButtonTextDirective,
    ],
})
export class ChangeEmailComponent {

    public readonly authService = inject(AuthService);
    private readonly fb = inject(FormBuilder);
    public readonly backendError: WritableSignal<string | null> = signal(null);
    public readonly isLoading = signal(false);

    public readonly emailUpdatingForm = this.fb.group({
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
