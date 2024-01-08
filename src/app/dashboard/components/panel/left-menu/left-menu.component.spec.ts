import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftMenuComponent } from './left-menu.component';
import { AuthService } from '../../../../auth/services/auth.service';
import { authServiceMock } from '../../../../../mocks/auth.service.mock';

describe('LeftMenuComponent', () => {
    let component: LeftMenuComponent;
    let fixture: ComponentFixture<LeftMenuComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LeftMenuComponent],
            providers: [
                { provide: AuthService, useValue: authServiceMock },
            ],
        }).compileComponents();
        fixture = TestBed.createComponent(LeftMenuComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('logout tiene que llamar el método logout en authService', () => {
        component.logout();
        expect(authServiceMock.logout).toHaveBeenCalled();
    });

    it('activateManagementViewHandler tiene que emitir el evento activateManagementView', () => {
        spyOn(component.activateManagementView, 'emit');
        component.activateManagementViewHandler('notes');
        expect(component.activateManagementView.emit).toHaveBeenCalledWith('notes');
    });
});