import { AccountManagementComponent } from './account-management.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AuthService } from '../../../../auth/services/auth.service';
import { ChangeEmailComponent } from '../change-email/change-email.component';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { LinkGoogleComponent } from '../link-google/link-google.component';

describe('AccountManagementComponent', () => {
    let component: AccountManagementComponent;
    let fixture: ComponentFixture<AccountManagementComponent>;
    const fakeAuthService = jasmine.createSpyObj('AuthService', ['currentUser']);

    beforeEach(async () => {

        TestBed.overrideComponent(AccountManagementComponent, {
            remove: {
                imports: [
                    ChangePasswordComponent,
                    ChangeEmailComponent,
                    LinkGoogleComponent,
                ],
            },
            add: {
                schemas: [CUSTOM_ELEMENTS_SCHEMA],
            },
        });

        await TestBed.configureTestingModule({
            imports: [AccountManagementComponent],
            providers: [
                { provide: AuthService, useValue: fakeAuthService },
            ],
        })
            .compileComponents();
        fixture = TestBed.createComponent(AccountManagementComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('deben existir contenedores email, password y google', () => {
        const compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector('.user-settings__email')).toBeTruthy();
        expect(compiled.querySelector('.user-settings__google')).toBeTruthy();
        expect(compiled.querySelector('.user-settings__password')).toBeTruthy();
    });

    it('debe existir el título Cambiar la contraseña si el usuario tiene contraseña', () => {
        fakeAuthService.currentUser.and.returnValue({ hasPass: true });
        const compiled = fixture.debugElement.nativeElement;
        fixture.detectChanges();
        const passwordTitleContainer = compiled.querySelector('.user-settings__password .panel__section-name');
        expect(passwordTitleContainer.textContent).toContain('Cambiar la contraseña');
    });

    it('debe existir el título Crear una contraseña si el usuario no tiene contraseña', () => {
        fakeAuthService.currentUser.and.returnValue({ hasPass: false });
        const compiled = fixture.debugElement.nativeElement;
        fixture.detectChanges();
        const passwordTitleContainer = compiled.querySelector('.user-settings__password .panel__section-name');
        expect(passwordTitleContainer.textContent).toContain('Crear una contraseña');
    });

});