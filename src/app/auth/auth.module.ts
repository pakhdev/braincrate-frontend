import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { AboutPageComponent } from './pages/about-page/about-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { AuthRoutingModule } from './auth-routing.module';
import { ErrorMessageDirective } from '../shared/directives/error-message.directive';

@NgModule({
    declarations: [
        AuthLayoutComponent,
        AboutPageComponent,
        RegisterPageComponent,
        LoginPageComponent,
        ErrorMessageDirective,
    ],
    imports: [
        CommonModule,
        AuthRoutingModule,
        ReactiveFormsModule,
        FormsModule,
    ],
})
export class AuthModule {
}
