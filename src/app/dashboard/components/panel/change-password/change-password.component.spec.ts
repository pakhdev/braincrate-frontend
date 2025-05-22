import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockDirective } from 'ng-mocks';
import { of } from 'rxjs';

import { AuthService } from '../../../../auth/services/auth.service';
import { ChangePasswordComponent } from './change-password.component';
import { DynamicButtonTextDirective } from '../../../../shared/directives/dynamic-button-text.directive';
import { ErrorMessageDirective } from '../../../../shared/directives/error-message.directive';
import { authServiceMock } from '../../../../../mocks/auth.service.mock';

describe('ChangePasswordComponent', () => {

    @Component({
    imports: [ChangePasswordComponent],
    template: `
            <change-password
                    [showCurrentPasswordInput]="showCurrentPasswordInput"/>`
})
    class TestHostComponent {
        public showCurrentPasswordInput = false;
        @ViewChild(ChangePasswordComponent) public readonly component!: ChangePasswordComponent;
    }

    let hostComponent: TestHostComponent;
    let hostFixture: ComponentFixture<TestHostComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestHostComponent, ChangePasswordComponent],
            providers: [
                { provide: AuthService, useValue: { ...authServiceMock } },
            ],
            declarations: [
                MockDirective(ErrorMessageDirective),
                MockDirective(DynamicButtonTextDirective),
            ],
        }).compileComponents();
        hostFixture = TestBed.createComponent(TestHostComponent);
        hostComponent = hostFixture.componentInstance;
        hostFixture.detectChanges();
    });

    it('validar la contraseña actual si showCurrentPasswordInput está en true', () => {
        hostComponent.showCurrentPasswordInput = true;
        hostFixture.detectChanges();
        const control = hostComponent.component.passwordUpdatingForm.get('currentPassword')!;
        control.setValue('');
        expect(control.valid).toBeFalsy();
        control.setValue('123456');
        expect(control.valid).toBeTruthy();
    });

    it('no validar la contraseña actual si showCurrentPasswordInput está en false', () => {
        hostComponent.showCurrentPasswordInput = false;
        hostFixture.detectChanges();
        const control = hostComponent.component.passwordUpdatingForm.get('currentPassword')!;
        control.setValue('');
        expect(control.valid).toBeTruthy();
    });

    it('mostrar el input de contraseña actual si showCurrentPasswordInput está en true', () => {
        hostComponent.showCurrentPasswordInput = true;
        hostFixture.detectChanges();

        const currentPasswordInput = hostFixture.nativeElement.querySelector(
            'input[formControlName="currentPassword"]',
        );
        expect(currentPasswordInput).toBeTruthy();
    });

    it('ocultar el input de contraseña actual si showCurrentPasswordInput está en false', () => {
        hostComponent.showCurrentPasswordInput = false;
        hostFixture.detectChanges();

        const currentPasswordInput = hostFixture.nativeElement.querySelector(
            'input[formControlName="currentPassword"]',
        );
        expect(currentPasswordInput).toBeFalsy();
    });

    it('se valida correctamente la contraseña nueva', () => {
        const newPasswordControl = hostComponent.component.passwordUpdatingForm.get('newPassword')!;
        newPasswordControl.setValue('');
        expect(newPasswordControl.valid).toBeFalsy();
        newPasswordControl.setValue('123456');
        expect(newPasswordControl.valid).toBeTruthy();

        const repeatNewPasswordControl = hostComponent.component.passwordUpdatingForm.get('repeatNewPassword')!;
        repeatNewPasswordControl.setValue('');
        expect(repeatNewPasswordControl.valid).toBeFalsy();
        repeatNewPasswordControl.setValue('123456');
        expect(repeatNewPasswordControl.valid).toBeTruthy();

        newPasswordControl.setValue('123456');
        repeatNewPasswordControl.setValue('123457');
        expect(hostComponent.component.passwordUpdatingForm.valid).toBeFalsy();

        repeatNewPasswordControl.setValue('123456');
        expect(hostComponent.component.passwordUpdatingForm.valid).toBeTruthy();
    });

    it('updatePassword() actualiza correctamente el estado y llama el método del authService', () => {
        hostComponent.showCurrentPasswordInput = false;
        hostFixture.detectChanges();
        const spySet = spyOn(hostComponent.component.isLoading, 'set').and.callThrough();
        authServiceMock.updatePassword.and.returnValue(of(true));
        hostComponent.component.backendError.set('error');

        hostComponent.component.passwordUpdatingForm.patchValue({ newPassword: '123456', repeatNewPassword: '123456' });
        hostComponent.component.passwordUpdatingForm.markAllAsTouched();

        hostComponent.component.updatePassword();
        hostFixture.detectChanges();

        expect(spySet).toHaveBeenCalledTimes(2);
        expect(spySet).toHaveBeenCalledWith(true);
        expect(spySet).toHaveBeenCalledWith(false);
        expect(hostComponent.component.backendError()).toBe(null);
    });
});