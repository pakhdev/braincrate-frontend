import { Component, inject, Input, signal, WritableSignal, booleanAttribute } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';

import { isFieldOneEqualFieldTwo } from '../../../../shared/validators/validators';
import { AuthService } from '../../../../auth/services/auth.service';
import { ErrorMessageDirective } from '../../../../shared/directives/error-message.directive';
import { DynamicButtonTextDirective } from '../../../../shared/directives/dynamic-button-text.directive';

@Component({
    standalone: true,
    selector: 'change-password',
    templateUrl: './change-password.component.html',
    imports: [
        ErrorMessageDirective,
        ReactiveFormsModule,
        DynamicButtonTextDirective,
    ],
})
export class ChangePasswordComponent {

    private readonly fb = inject(FormBuilder);
    public readonly authService = inject(AuthService);
    public readonly backendError: WritableSignal<string | null> = signal(null);
    public readonly isLoading = signal(false);

    private _showCurrentPasswordInput = false;
    @Input({ transform: booleanAttribute })
    public set showCurrentPasswordInput(value: boolean) {
        this._showCurrentPasswordInput = value;
        const currentPasswordControl = this.passwordUpdatingForm.get('currentPassword')!;
        value
            ? currentPasswordControl.setValidators([Validators.required, Validators.minLength(6)])
            : currentPasswordControl.clearValidators();
        currentPasswordControl.updateValueAndValidity();
    }

    public get showCurrentPasswordInput(): boolean {
        return this._showCurrentPasswordInput;
    }

    public readonly passwordUpdatingForm = this.fb.group({
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

    public updatePassword() {
        this.passwordUpdatingForm.markAllAsTouched();
        const { currentPassword, newPassword } = this.passwordUpdatingForm.value;
        if (this.passwordUpdatingForm.invalid || (!currentPassword && this.showCurrentPasswordInput) || !newPassword) return;

        this.isLoading.set(true);
        this.backendError.set(null);

        this.authService.updatePassword(currentPassword, newPassword).subscribe({
            next: () => {
                this.backendError.set(null);
                this.isLoading.set(false);
                this.passwordUpdatingForm.reset();
            },
            error: (error) => {
                this.backendError.set(error);
                this.isLoading.set(false);
            },
        });
    }

    public hasError(field: string): boolean | null {
        return this.authService.hasError(this.passwordUpdatingForm, field);
    }

    public getError(field: string): ValidationErrors | null | undefined {
        return this.passwordUpdatingForm.get(field)?.errors;
    }
}
