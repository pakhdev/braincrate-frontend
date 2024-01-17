import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';

import { AllNotesPageComponent } from './all-notes-page.component';
import { ViewNoteComponent } from '../../components/note-visualization/view-note/view-note.component';
import {
    InfiniteScrollTriggerComponent,
} from '../../components/note-visualization/infinite-scroll-trigger/infinite-scroll-trigger.component';
import {
    ReviewsCompletedMessageComponent,
} from '../../components/note-visualization/reviews-completed-message/reviews-completed-message.component';
import { EditNoteComponent } from '../../components/note-editing/edit-note/edit-note.component';
import { createNotesServiceMock } from '../../../../mocks/notes.service.mock';
import { NotesService } from '../../services/notes.service';
import { createNoteMock } from '../../../../mocks/note.mock';
import { createDashboardStateServiceMock } from '../../../../mocks/dashboard-state.service.mock';
import { createDashboardStateMock } from '../../../../mocks/dashboard-state.mock';
import { DashboardStateService } from '../../services/dashboard-state.service';

describe('AllNotesPageComponent', () => {
    let component: AllNotesPageComponent;
    let fixture: ComponentFixture<AllNotesPageComponent>;
    const notesServiceMock = createNotesServiceMock();
    const dashboardStateServiceMock = createDashboardStateServiceMock();
    const noteMock = createNoteMock();

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                AllNotesPageComponent,
                MockComponent(ReviewsCompletedMessageComponent),
                MockComponent(InfiniteScrollTriggerComponent),
                MockComponent(ViewNoteComponent),
                MockComponent(EditNoteComponent),
            ],
            providers: [
                { provide: NotesService, useValue: notesServiceMock },
                { provide: DashboardStateService, useValue: dashboardStateServiceMock },
            ],
        }).compileComponents();
        fixture = TestBed.createComponent(AllNotesPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('notes() debe devolver la lista de notas del servicio de notas', () => {
        notesServiceMock.notesList.and.returnValue([noteMock]);
        expect(component.notes).toEqual([noteMock]);
    });

    it('showWelcomeMessage() debe devolver true si no hay término de búsqueda, no se están cargando notas y no hay notas', () => {
        spyOnProperty(dashboardStateServiceMock.dashboardState$, 'value').and.returnValue({
            ...createDashboardStateMock(),
            searchWord: '',
        });
        notesServiceMock.isLoading.and.returnValue(false);
        notesServiceMock.notesList.and.returnValue([]);
        expect(component.showWelcomeMessage()).toBeTrue();
    });

    it('showWelcomeMessage() debe devolver false si hay término de búsqueda', () => {
        spyOnProperty(dashboardStateServiceMock.dashboardState$, 'value').and.returnValue({
            ...createDashboardStateMock(),
            searchWord: 'término de búsqueda',
        });
        notesServiceMock.isLoading.and.returnValue(false);
        notesServiceMock.notesList.and.returnValue([]);
        expect(component.showWelcomeMessage()).toBeFalse();
    });

    it('showWelcomeMessage() debe devolver false si se están cargando notas', () => {
        spyOnProperty(dashboardStateServiceMock.dashboardState$, 'value').and.returnValue({
            ...createDashboardStateMock(),
            searchWord: '',
        });
        notesServiceMock.isLoading.and.returnValue(true);
        notesServiceMock.notesList.and.returnValue([]);
        expect(component.showWelcomeMessage()).toBeFalse();
    });

    it('showWelcomeMessage() debe devolver false si hay notas', () => {
        spyOnProperty(dashboardStateServiceMock.dashboardState$, 'value').and.returnValue({
            ...createDashboardStateMock(),
            searchWord: '',
        });
        notesServiceMock.isLoading.and.returnValue(false);
        notesServiceMock.notesList.and.returnValue([noteMock]);
        expect(component.showWelcomeMessage()).toBeFalse();
    });

    it('showEmptySearchResult() debe devolver true si hay término de búsqueda, no se están cargando notas y no hay' +
        ' notas', () => {
        spyOnProperty(dashboardStateServiceMock.dashboardState$, 'value').and.returnValue({
            ...createDashboardStateMock(),
            searchWord: 'término de búsqueda',
        });
        notesServiceMock.isLoading.and.returnValue(false);
        notesServiceMock.notesList.and.returnValue([]);
        expect(component.showEmptySearchResult()).toBeTrue();
    });

    it('showEmptySearchResult() debe devolver false si no hay término de búsqueda', () => {
        spyOnProperty(dashboardStateServiceMock.dashboardState$, 'value').and.returnValue({
            ...createDashboardStateMock(),
            searchWord: '',
        });
        notesServiceMock.isLoading.and.returnValue(false);
        notesServiceMock.notesList.and.returnValue([]);
        expect(component.showEmptySearchResult()).toBeFalse();
    });

    it('showEmptySearchResult() debe devolver false si se están cargando notas', () => {
        spyOnProperty(dashboardStateServiceMock.dashboardState$, 'value').and.returnValue({
            ...createDashboardStateMock(),
            searchWord: 'término de búsqueda',
        });
        notesServiceMock.isLoading.and.returnValue(true);
        notesServiceMock.notesList.and.returnValue([]);
        expect(component.showEmptySearchResult()).toBeFalse();
    });

    it('showEmptySearchResult() debe devolver false si hay notas', () => {
        spyOnProperty(dashboardStateServiceMock.dashboardState$, 'value').and.returnValue({
            ...createDashboardStateMock(),
            searchWord: 'término de búsqueda',
        });
        notesServiceMock.isLoading.and.returnValue(false);
        notesServiceMock.notesList.and.returnValue([noteMock]);
        expect(component.showEmptySearchResult()).toBeFalse();
    });

});