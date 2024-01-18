import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractControl } from '@angular/forms';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { MockDirective } from 'ng-mocks';

import { LoginPageComponent } from './login-page.component';
import { AuthService } from '../../services/auth.service';
import { authServiceMock } from '../../../../mocks/auth.service.mock';
import { routerMock } from '../../../../mocks/router.mock';
import { ErrorMessageDirective } from '../../../shared/directives/error-message.directive';
import { DynamicButtonTextDirective } from '../../../shared/directives/dynamic-button-text.directive';

describe('LoginPageComponent', () => {
    let component: LoginPageComponent;
    let fixture: ComponentFixture<LoginPageComponent>;

    let emailControl: AbstractControl;
    let passwordControl: AbstractControl;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                LoginPageComponent,
                NoopAnimationsModule,
            ],
            providers: [
                { provide: AuthService, useValue: authServiceMock },
                { provide: Router, useValue: { ...routerMock } },
                MockDirective(ErrorMessageDirective),
                MockDirective(DynamicButtonTextDirective),
            ],
        }).compileComponents();
        fixture = TestBed.createComponent(LoginPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        emailControl = component.loginForm.get('email')!;
        passwordControl = component.loginForm.get('password')!;
        authServiceMock.login.and.returnValue(of(null));
    });

    it('login() llama el método login() del servicio auth, si los datos son correctos', () => {
        spyOn(component.isLoading, 'set').and.callThrough();
        emailControl.setValue('mail@mail.es');
        passwordControl.setValue('123456');

        component.login();

        expect(component.loginForm.valid).toBeTrue();
        expect(authServiceMock.login).toHaveBeenCalled();
        expect(component.isLoading.set).toHaveBeenCalledWith(true);
        expect(component.isLoading.set).toHaveBeenCalledTimes(1);
        expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/dashboard');
    });

    it('el formulario es inválido si el email no es válido', () => {
        emailControl.setValue('mail');
        expect(component.loginForm.valid).toBeFalse();
    });

    it('el formulario es inválido si la contraseña es menor de 6 caracteres', () => {
        passwordControl.setValue('12345');
        expect(component.loginForm.valid).toBeFalse();
    });

    it('hasError() llama el método hasError() del servicio auth', () => {
        component.hasError('email');
        expect(authServiceMock.hasError).toHaveBeenCalledWith(component.loginForm, 'email');
    });

    it('getError() devuelve los errores del campo', () => {
        emailControl.setValue('mail');
        expect(component.getError('email')).toBeTruthy();
    });

    it('getError() devuelve null si no hay errores en el campo', () => {
        emailControl.setValue('mail@mail.es');
        expect(component.getError('email')).toBeNull();
    });
});