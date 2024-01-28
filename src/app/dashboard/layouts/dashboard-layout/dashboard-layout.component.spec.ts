import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';

import { DashboardLayoutComponent } from './dashboard-layout.component';
import { createDashboardStateServiceMock } from '../../../../mocks/dashboard-state.service.mock';
import { createNotesServiceMock } from '../../../../mocks/notes.service.mock';
import { DashboardStateService } from '../../services/dashboard-state.service';
import { NotesService } from '../../services/notes.service';
import { AccountManagementComponent } from '../../components/panel/account-management/account-management.component';
import { SearchAndPickTagsComponent } from '../../components/panel/search-and-pick-tags/search-and-pick-tags.component';
import { NotesManagementComponent } from '../../components/panel/notes-management/notes-management.component';
import {
    NotesLoadingIndicatorComponent,
} from '../../components/note-visualization/notes-loading-indicator/notes-loading-indicator.component';
import { LeftMenuComponent } from '../../components/panel/left-menu/left-menu.component';
import { HeaderNavigationComponent } from '../../components/panel/header-navigation/header-navigation.component';

describe('DashboardLayoutComponent', () => {
    let component: DashboardLayoutComponent;
    let fixture: ComponentFixture<DashboardLayoutComponent>;
    const dashboardStateServiceMock = createDashboardStateServiceMock();
    const notesServiceMock = createNotesServiceMock();

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                DashboardLayoutComponent,
                MockComponent(AccountManagementComponent),
                MockComponent(HeaderNavigationComponent),
                MockComponent(LeftMenuComponent),
                MockComponent(NotesLoadingIndicatorComponent),
                MockComponent(NotesManagementComponent),
                MockComponent(SearchAndPickTagsComponent),
            ],
            providers: [
                { provide: DashboardStateService, useValue: dashboardStateServiceMock },
                { provide: NotesService, useValue: notesServiceMock },
            ],
        });
        fixture = TestBed.createComponent(DashboardLayoutComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('openMobilePanel() debe asignar los estilos correctamente', () => {
        component.openMobilePanel();

        expect(component['documentBody'].style.overflow).toBe('hidden');
        expect(component['contentMobileHeaderDiv'].nativeElement.style.visibility).toBe('hidden');
        expect(component['mobilePanelFixerDiv'].nativeElement.style.display).toBe('flex');
        expect(component['panelCopyrightDiv'].nativeElement.getAttribute('style')).toBeFalsy();
    });

    it('closeMobilePanel() debe asignar los estilos correctamente', () => {
        component.closeMobilePanel();

        expect(component['documentBody'].getAttribute('style')).toBeFalsy();
        expect(component['contentMobileHeaderDiv'].nativeElement.getAttribute('style')).toBeFalsy();
        expect(component['mobilePanelFixerDiv'].nativeElement.getAttribute('style')).toBeFalsy();
    });

    it('showLoadingNotes() devuelve el valor del signal isLoading()', () => {
        notesServiceMock.isLoading.and.returnValue(true);
        expect(component.showLoadingNotes()).toBeTrue();
    });

    it('activateManagementViewHandler() debe asignar el valor al signal correctamente', () => {
        spyOn(component.openedSection, 'set');
        component.activateManagementViewHandler('notes');
        expect(component.openedSection.set).toHaveBeenCalledWith('notes');
    });
});