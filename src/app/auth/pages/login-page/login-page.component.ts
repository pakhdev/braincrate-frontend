import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { emailPattern } from '../../../shared/validators/validators';

@Component({
    selector: 'auth-login-page',
    templateUrl: './login-page.component.html',
    styles: [],
})
export class LoginPageComponent {

    private fb = inject(FormBuilder);
    private router = inject(Router);
    public authService = inject(AuthService);

    public loginForm = this.fb.group({
        email: ['',
            [Validators.required, Validators.pattern(emailPattern)],
        ],
        password: ['',
            [Validators.required, Validators.minLength(6)],
        ],
        repeatPassword: ['',
            [Validators.required, Validators.minLength(6)],
        ],
    });

    login() {
        this.loginForm.markAllAsTouched();
        console.log(this.loginForm.valid);
        // if(!this.registerForm.valid) return;
    }
}
