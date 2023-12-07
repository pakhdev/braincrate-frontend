import { NgIf } from '@angular/common';
import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { ErrorMessageDirective } from '../../../shared/directives/error-message.directive';
import { emailPattern } from '../../../shared/validators/validators';
import { DynamicButtonTextDirective } from '../../../shared/directives/dynamic-button-text.directive';

@Component({
    standalone: true,
    selector: 'auth-login-page',
    templateUrl: './login-page.component.html',
    imports: [
        NgIf,
        ErrorMessageDirective,
        FormsModule,
        ReactiveFormsModule,
        DynamicButtonTextDirective,
    ],
})
export class LoginPageComponent {

    private fb = inject(FormBuilder);
    private router = inject(Router);
    private authService = inject(AuthService);
    public backendError: WritableSignal<string | null> = signal(null);
    public isLoading = signal(false);

    public loginForm = this.fb.group({
        email: ['',
            [Validators.required, Validators.pattern(emailPattern)],
        ],
        password: ['',
            [Validators.required, Validators.minLength(6)],
        ],
    });

    public login(): void {
        this.loginForm.markAllAsTouched();
        if (!this.loginForm.valid) return;
        const email: string = this.loginForm.value.email!.toString().trim();
        const password: string = this.loginForm.value.password!;
        this.isLoading.set(true);

        this.authService.login(email, password).subscribe({
            next: () => this.router.navigateByUrl('/dashboard'),
            error: errorCode => {
                this.backendError.set(errorCode);
                this.isLoading.set(false);
            },
        });
    }

    public hasError(field: string): boolean | null {
        return this.authService.hasError(this.loginForm, field);
    }

    public getError(field: string): ValidationErrors | null | undefined {
        return this.loginForm.get(field)?.errors;
    }
}
