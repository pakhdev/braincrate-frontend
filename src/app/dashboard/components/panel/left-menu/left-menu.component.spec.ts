import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftMenuComponent } from './left-menu.component';
import { AuthService } from '../../../../auth/services/auth.service';

describe('LeftMenuComponent', () => {
    let component: LeftMenuComponent;
    let fixture: ComponentFixture<LeftMenuComponent>;
    const fakeAuthService = jasmine.createSpyObj('AuthService', ['logout']);

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LeftMenuComponent],
            providers: [
                { provide: AuthService, useValue: fakeAuthService },
            ],
        }).compileComponents();
        fixture = TestBed.createComponent(LeftMenuComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('logout tiene que llamar el método logout en authService', () => {
        component.logout();
        expect(fakeAuthService.logout).toHaveBeenCalled();
    });

    it('activateManagementViewHandler tiene que emitir el evento activateManagementView', () => {
        spyOn(component.activateManagementView, 'emit');
        component.activateManagementViewHandler('notes');
        expect(component.activateManagementView.emit).toHaveBeenCalledWith('notes');
    });
});