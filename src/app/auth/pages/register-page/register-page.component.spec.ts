import { AbstractControl } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockDirective } from 'ng-mocks';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { Router } from '@angular/router';

import { RegisterPageComponent } from './register-page.component';
import { AuthService } from '../../services/auth.service';
import { authServiceMock } from '../../../../mocks/auth.service.mock';
import { ErrorMessageDirective } from '../../../shared/directives/error-message.directive';
import { DynamicButtonTextDirective } from '../../../shared/directives/dynamic-button-text.directive';
import { EmailValidator } from '../../../shared/validators/email-validator.service';
import { routerMock } from '../../../../mocks/router.mock';

describe('RegisterPageComponent', () => {
    let component: RegisterPageComponent;
    let fixture: ComponentFixture<RegisterPageComponent>;
    const emailValidatorMock = jasmine.createSpyObj<EmailValidator>('EmailValidator', ['validate']);

    let emailControl: AbstractControl;
    let passwordControl: AbstractControl;
    let repeatPasswordControl: AbstractControl;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                RegisterPageComponent,
                NoopAnimationsModule,
            ],
            providers: [
                { provide: AuthService, useValue: authServiceMock },
                { provide: EmailValidator, useValue: emailValidatorMock },
                { provide: Router, useValue: { ...routerMock } },
                MockDirective(ErrorMessageDirective),
                MockDirective(DynamicButtonTextDirective),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(RegisterPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        emailControl = component.registerForm.get('email')!;
        passwordControl = component.registerForm.get('password')!;
        repeatPasswordControl = component.registerForm.get('repeatPassword')!;
        emailValidatorMock.validate.and.returnValue(of(null));
        authServiceMock.register.and.returnValue(of(null));
    });

    it('register() llama el método register() del servicio auth, si los datos son correctos', () => {
        spyOn(component.isLoading, 'set').and.callThrough();
        emailControl.setValue('mail@mail.es');
        passwordControl.setValue('123456');
        repeatPasswordControl.setValue('123456');

        component.register();

        expect(component.registerForm.valid).toBeTrue();
        expect(authServiceMock.register).toHaveBeenCalled();
        expect(component.isLoading.set).toHaveBeenCalledWith(true);
        expect(component.isLoading.set).toHaveBeenCalledTimes(1);
        expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/dashboard');

    });

    it('el formulario es inválido, si el correo es incorrecto', () => {
        spyOn(component.isLoading, 'set').and.callThrough();
        emailControl.setValue('mail');
        passwordControl.setValue('123456');
        repeatPasswordControl.setValue('123456');
        expect(component.registerForm.valid).toBeFalse();
    });

    it('el formulario es inválido, si la contraseña es corta', () => {
        spyOn(component.isLoading, 'set').and.callThrough();
        emailControl.setValue('mail@mail.es');
        passwordControl.setValue('12345');
        repeatPasswordControl.setValue('12345');
        expect(component.registerForm.valid).toBeFalse();
    });

    it('el formulario es inválido, si las contraseñas no coinciden', () => {
        spyOn(component.isLoading, 'set').and.callThrough();
        emailControl.setValue('mail@mail.es');
        passwordControl.setValue('123456');
        repeatPasswordControl.setValue('123457');
        expect(component.registerForm.valid).toBeFalse();
    });

    it('hasError() llama el método hasError() del servicio auth', () => {
        component.hasError('email');
        expect(authServiceMock.hasError).toHaveBeenCalledWith(component.registerForm, 'email');
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