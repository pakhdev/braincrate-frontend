import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { HeaderNavigationComponent } from './header-navigation.component';
import { NotesService } from '../../../services/notes.service';
import { DashboardStateService } from '../../../services/dashboard-state.service';
import { routerMock } from '../../../../../mocks/router.mock';
import { createDashboardStateServiceMock } from '../../../../../mocks/dashboard-state.service.mock';
import { createDashboardStateMock } from '../../../../../mocks/dashboard-state.mock';

describe('HeaderNavigationComponent', () => {

    let component: HeaderNavigationComponent;
    let fixture: ComponentFixture<HeaderNavigationComponent>;
    const dashboardStateServiceMock = createDashboardStateServiceMock();

    const fakeNotesService = jasmine.createSpyObj('NotesService', ['countNotesForReview']);

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HeaderNavigationComponent],
            providers: [
                { provide: Router, useValue: routerMock },
                { provide: ActivatedRoute, useValue: {} },
                { provide: NotesService, useValue: fakeNotesService },
                { provide: DashboardStateService, useValue: dashboardStateServiceMock },
            ],
        }).compileComponents();
        fixture = TestBed.createComponent(HeaderNavigationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('ocultar el contenedor de botones si showButtons está en false', () => {
        component.showButtons = false;
        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('.primary-buttons')).toBeNull();
    });

    it('mostrar el contenedor de botones si showButtons está en true', () => {
        component.showButtons = true;
        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('.primary-buttons')).not.toBeNull();
    });

    it('ocultar el botón burger si mobile está en false', () => {
        component.mobile = false;
        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('.icon-menu')).toBeNull();
    });

    it('mostrar el botón burger si mobile está en true', () => {
        component.mobile = true;
        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('.icon-menu')).not.toBeNull();
    });

    it('ocultar el botón de cancelar y mostrar el de crear si isNoteCreationActive es false', () => {
        routerMock.url = '/dashboard/notes';
        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('.button-close-form')).toBeNull();
        expect(compiled.querySelector('.button-open-form')).not.toBeNull();
    });

    it('mostrar el botón de cancelar y ocultar el de crear si isNoteCreationActive es true', () => {
        routerMock.url = '/dashboard/new-note';
        fixture.detectChanges();
        console.log(component.isNoteCreationActive);
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('.button-close-form')).not.toBeNull();
        expect(compiled.querySelector('.button-open-form')).toBeNull();
    });

    it('mostrar el botón de mostrar todas las notas si isReviewSectionActive es true', () => {
        component.showButtons = true;
        dashboardStateServiceMock.selectedSection = 'for-review';
        fixture.detectChanges();

        const buttonElement = fixture.debugElement.nativeElement.querySelector('.button-review-notes');
        expect(buttonElement.getAttribute('routerLink')).toBe('/dashboard/all');
    });

    it('mostrar el botón de mostrar notas para repasar si isReviewSectionActive es false', () => {
        component.showButtons = true;
        dashboardStateServiceMock.selectedSection = 'all';
        fixture.detectChanges();

        const buttonElement = fixture.debugElement.nativeElement.querySelector('.button-review-notes');
        expect(buttonElement.getAttribute('routerLink')).toBe('/dashboard/for-review');
    });

    it('notesForReviewCount devuelve correctamente la cantidad de notas para repasar', () => {
        fakeNotesService.countNotesForReview.and.returnValue(0);
        fixture.detectChanges();
        expect(component.notesForReviewCount).toBeNull();

        fakeNotesService.countNotesForReview.and.returnValue(1);
        fixture.detectChanges();
        expect(component.notesForReviewCount).toEqual('(1)');
    });

    it('cancelNoteCreation redirige a la sección actual', () => {
        spyOnProperty(dashboardStateServiceMock.dashboardState$, 'value').and.returnValue({
            ...createDashboardStateMock(),
            notesType: 'all',
        });
        component.cancelNoteCreation();
        expect(routerMock.navigate).toHaveBeenCalledWith(['dashboard', 'all'], { queryParams: { preserveState: 'true' } });
    });

    it('openMobilePanelHandler emite un evento', () => {
        spyOn(component.openMobilePanel, 'emit');
        component.openMobilePanelHandler();
        expect(component.openMobilePanel.emit).toHaveBeenCalled();
    });
});