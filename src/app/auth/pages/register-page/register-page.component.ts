import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { emailPattern, isFieldOneEqualFieldTwo } from '../../../shared/validators/validators';
import { EmailValidator } from '../../../shared/validators/email-validator.service';
import { ErrorMessageDirective } from '../../../shared/directives/error-message.directive';
import { NgIf } from '@angular/common';
import { DynamicButtonTextDirective } from '../../../shared/directives/dynamic-button-text.directive';
import { environments } from '../../../../environments/environment';

@Component({
    standalone: true,
    selector: 'auth-register-page',
    templateUrl: './register-page.component.html',
    imports: [
        ReactiveFormsModule,
        FormsModule,
        ErrorMessageDirective,
        NgIf,
        DynamicButtonTextDirective,
    ],
})
export class RegisterPageComponent {

    private fb = inject(FormBuilder);
    private router = inject(Router);
    private emailValidator = inject(EmailValidator);
    private authService = inject(AuthService);
    public backendError: WritableSignal<string | null> = signal(null);
    public isLoading = signal(false);

    public registerForm = this.fb.group({
        email: ['',
            [Validators.required, Validators.pattern(emailPattern)],
            [this.emailValidator],
        ],
        password: ['',
            [Validators.required, Validators.minLength(6)],
        ],
        repeatPassword: ['',
            [Validators.required, Validators.minLength(6)],
        ],
    }, {
        validators: [
            isFieldOneEqualFieldTwo('password', 'repeatPassword'),
        ],
    });

    public register(): void {
        this.registerForm.markAllAsTouched();
        if (!this.registerForm.valid) return;
        const email: string = this.registerForm.value.email!.toString().trim();
        const password: string = this.registerForm.value.password!;

        this.isLoading.set(true);
        this.authService.register(email, password).subscribe({
            next: () => this.router.navigateByUrl('/dashboard'),
            error: errorCode => {
                this.backendError.set(errorCode);
                this.isLoading.set(false);
            },
        });
    }

    public hasError(field: string): boolean | null {
        return this.authService.hasError(this.registerForm, field);
    }

    public getError(field: string): ValidationErrors | null | undefined {
        return this.registerForm.get(field)?.errors;
    }

    public registerWithGoogle(event: Event): void {
        event.preventDefault();
        window.location.href = environments.baseUrl + '/auth/google-login';
    }

}
