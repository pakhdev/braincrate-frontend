import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { AboutPageComponent } from './pages/about-page/about-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { AuthRoutingModule } from './auth-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    declarations: [
        AuthLayoutComponent,
        AboutPageComponent,
        RegisterPageComponent,
        LoginPageComponent,
    ],
    imports: [
        CommonModule,
        AuthRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        SharedModule,
    ],
})
export class AuthModule {
}
