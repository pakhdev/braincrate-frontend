import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkGoogleComponent } from './link-google.component';
import { AuthService } from '../../../../auth/services/auth.service';
import { environments } from '../../../../../environments/environment';

describe('LinkGoogleComponent', () => {
    let component: LinkGoogleComponent;
    let fixture: ComponentFixture<LinkGoogleComponent>;
    const fakeAuthService = jasmine.createSpyObj('AuthService', ['currentUser', 'setAuthentication']);

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LinkGoogleComponent],
            providers: [{ provide: AuthService, useValue: fakeAuthService }],
        }).compileComponents();

        fixture = TestBed.createComponent(LinkGoogleComponent);
        component = fixture.componentInstance;
    });

    it('tiene que abrirse la ventana de autorización con Google', () => {
        spyOn(window, 'open');
        component.linkGoogle();
        expect(window.open).toHaveBeenCalledOnceWith(
            environments.backendUrl + '/auth/link-google-account',
            'Google Auth',
            'width=500,height=600',
        );
    });

    it('tiene que devolver true si el usuario tiene cuenta de Google', () => {
        fakeAuthService.currentUser.and.returnValue({ hasGoogleAccount: true });
        expect(component.isGoogleLinked()).toBeTrue();
    });

    it('tiene que devolver false si el usuario no tiene cuenta de Google', () => {
        fakeAuthService.currentUser.and.returnValue({ hasGoogleAccount: false });
        expect(component.isGoogleLinked()).toBeFalse();
    });

    it('Vinculación correcta llama setAuthentication y muestra un mensaje', () => {
        fakeAuthService.setAuthentication.calls.reset();
        const event = new MessageEvent('message', {
            data: { message: 'success' },
            origin: new URL(environments.backendUrl).origin,
            source: window,
        });
        component['handleMessage'](event);
        expect(fakeAuthService.setAuthentication).toHaveBeenCalled();
        expect(component.successMessage()).not.toBeNull();
        expect(component.errorMessage()).toBeNull();
    });

    it('Vinculación correcta con cambio de email llama setAuthentication y muestra un mensaje', () => {
        fakeAuthService.setAuthentication.calls.reset();
        const event = new MessageEvent('message', {
            data: { message: 'emailChanged' },
            origin: new URL(environments.backendUrl).origin,
            source: window,
        });
        component['handleMessage'](event);
        expect(fakeAuthService.setAuthentication).toHaveBeenCalled();
        expect(component.successMessage()).not.toBeNull();
        expect(component.errorMessage()).toBeNull();
    });

    it('Vinculación con email ya registrado muestra un mensaje de error', () => {
        fakeAuthService.setAuthentication.calls.reset();
        const event = new MessageEvent('message', {
            data: { message: 'emailTaken' },
            origin: new URL(environments.backendUrl).origin,
            source: window,
        });
        component['handleMessage'](event);
        expect(fakeAuthService.setAuthentication).not.toHaveBeenCalled();
        expect(component.successMessage()).toBeNull();
        expect(component.errorMessage()).not.toBeNull();
    });

});