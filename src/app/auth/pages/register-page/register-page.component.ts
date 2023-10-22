import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { emailPattern } from '../../../shared/validators/validators';
import { EmailValidator } from '../../../shared/validators/email-validator.service';

@Component({
    selector: 'auth-register-page',
    templateUrl: './register-page.component.html',
})
export class RegisterPageComponent {

    private fb = inject(FormBuilder);
    private router = inject(Router);
    private emailValidator = inject(EmailValidator);
    public authService = inject(AuthService);
    public backendError: string | null = null;

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
            this.isFieldOneEqualFieldTwo('password', 'repeatPassword'),
        ],
    });

    isFieldOneEqualFieldTwo(field1: string, field2: string) {
        return (formGroup: AbstractControl): ValidationErrors | null => {

            const fieldValue1 = formGroup.get(field1)?.value;
            const fieldValue2 = formGroup.get(field2)?.value;

            if (fieldValue1 !== fieldValue2) {
                formGroup.get(field2)?.setErrors({ notEqual: true });
                return { notEqual: true };
            }

            formGroup.get(field2)?.setErrors(null);
            return null;
        };
    }

    register() {
        this.registerForm.markAllAsTouched();
        if (!this.registerForm.valid) return;
        const email: string = this.registerForm.value.email!.toString().trim();
        const password: string = this.registerForm.value.password!;

        this.authService.register(email, password).subscribe({
            next: () => this.router.navigateByUrl('/dashboard'),
            error: (message) => {
                this.backendError = message;
            },
        });
    }
}
