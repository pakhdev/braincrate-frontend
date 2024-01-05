import { ChangeEmailComponent } from './change-email.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { MockDirective } from 'ng-mocks';

import { AuthService } from '../../../../auth/services/auth.service';
import { ErrorMessageDirective } from '../../../../shared/directives/error-message.directive';
import { DynamicButtonTextDirective } from '../../../../shared/directives/dynamic-button-text.directive';

describe('ChangeEmailComponent', () => {
    let component: ChangeEmailComponent;
    let fixture: ComponentFixture<ChangeEmailComponent>;
    const fakeAuthService = jasmine.createSpyObj('AuthService', ['currentUser', 'hasError', 'updateEmail']);

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                ChangeEmailComponent,
            ],
            providers: [
                { provide: AuthService, useValue: fakeAuthService },
            ],
            declarations: [
                MockDirective(ErrorMessageDirective),
                MockDirective(DynamicButtonTextDirective),
            ],
        }).compileComponents();
        fixture = TestBed.createComponent(ChangeEmailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('el campo email se valida correctamente', () => {
        component.emailUpdatingForm.patchValue({ email: '' });
        expect(component.emailUpdatingForm.valid).toBeFalsy();

        component.emailUpdatingForm.patchValue({ email: 'abc' });
        expect(component.emailUpdatingForm.valid).toBeFalsy();

        component.emailUpdatingForm.patchValue({ email: 'abc@abc' });
        expect(component.emailUpdatingForm.valid).toBeFalsy();

        component.emailUpdatingForm.patchValue({ email: 'abc@abc.com' });
        expect(component.emailUpdatingForm.valid).toBeTruthy();
    });

    it('updateEmail actualiza correctamente el estado y llama el método del authService', () => {
        const spySet = spyOn(component.isLoading, 'set').and.callThrough();
        fakeAuthService.updateEmail.and.returnValue(of(true));
        component.backendError.set('error');

        component.emailUpdatingForm.patchValue({ email: 'abc@abc.com' });
        component.emailUpdatingForm.markAllAsTouched();

        component.updateEmail();
        fixture.detectChanges();

        expect(spySet).toHaveBeenCalledTimes(2);
        expect(spySet).toHaveBeenCalledWith(true);
        expect(spySet).toHaveBeenCalledWith(false);
        expect(component.backendError()).toBe(null);

    });
});