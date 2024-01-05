import { ChangePasswordComponent } from './change-password.component';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MockDirective } from 'ng-mocks';
import { ErrorMessageDirective } from '../../../../shared/directives/error-message.directive';
import { DynamicButtonTextDirective } from '../../../../shared/directives/dynamic-button-text.directive';
import { AuthService } from '../../../../auth/services/auth.service';

xdescribe('ChangePasswordComponent', () => {
    let component: ChangePasswordComponent;
    let fixture: ComponentFixture<ChangePasswordComponent>;
    const fakeAuthService = jasmine.createSpyObj('AuthService', ['updatePassword', 'hasError']);

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ChangePasswordComponent],
            providers: [
                { provide: AuthService, useValue: fakeAuthService },
            ],
            declarations: [
                MockDirective(ErrorMessageDirective),
                MockDirective(DynamicButtonTextDirective),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ChangePasswordComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('validar la contraseña actual si showCurrentPasswordInput está en true', done => {
        component.showCurrentPasswordInput = false;
        fixture = TestBed.createComponent(ChangePasswordComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();
        const control = component.passwordUpdatingForm.get('currentPassword')!;
        control.setValue('');
        expect(control.valid).toBeFalsy();
    });
});