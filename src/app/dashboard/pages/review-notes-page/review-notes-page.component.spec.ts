import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';

import { EditNoteComponent } from '../../components/note-editing/edit-note/edit-note.component';
import {
    InfiniteScrollTriggerComponent,
} from '../../components/note-visualization/infinite-scroll-trigger/infinite-scroll-trigger.component';
import { NotesService } from '../../services/notes.service';
import { ReviewNotesPageComponent } from './review-notes-page.component';
import {
    ReviewsCompletedMessageComponent,
} from '../../components/note-visualization/reviews-completed-message/reviews-completed-message.component';
import { ViewNoteComponent } from '../../components/note-visualization/view-note/view-note.component';
import { createNoteMock } from '../../../../mocks/note.mock';
import { createNotesServiceMock } from '../../../../mocks/notes.service.mock';

describe('ReviewNotesPageComponent', () => {
    let component: ReviewNotesPageComponent;
    let fixture: ComponentFixture<ReviewNotesPageComponent>;
    const notesServiceMock = createNotesServiceMock();
    const noteMock = createNoteMock();

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                ReviewNotesPageComponent,
                MockComponent(InfiniteScrollTriggerComponent),
                MockComponent(ReviewsCompletedMessageComponent),
                MockComponent(ViewNoteComponent),
                MockComponent(EditNoteComponent),
            ],
            providers: [
                { provide: NotesService, useValue: notesServiceMock },
            ],
        }).compileComponents();
        fixture = TestBed.createComponent(ReviewNotesPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('notes() debe devolver la lista de notas del servicio de notas', () => {
        notesServiceMock.notesList.and.returnValue([noteMock]);
        expect(component.notes).toEqual([noteMock]);
    });

    it('showReviewsCompleted() debe devolver true cuando no hay notas y no se está cargando', () => {
        notesServiceMock.isLoading.and.returnValue(false);
        notesServiceMock.notesList.and.returnValue([]);
        expect(component.showReviewsCompleted()).toBeTrue();
    });

    it('showReviewsCompleted() debe devolver false cuando hay notas', () => {
        notesServiceMock.isLoading.and.returnValue(false);
        notesServiceMock.notesList.and.returnValue([noteMock]);
        expect(component.showReviewsCompleted()).toBeFalse();
    });

    it('showReviewsCompleted() debe devolver false cuando las notas se están cargando', () => {
        notesServiceMock.isLoading.and.returnValue(true);
        notesServiceMock.notesList.and.returnValue([]);
        expect(component.showReviewsCompleted()).toBeFalse();
    });

    it('se debe de mostrar el componente edit-note si la nota está en modo edición', () => {
        notesServiceMock.notesList.and.returnValue([{ ...noteMock, editMode: true }]);
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('edit-note')).toBeTruthy();
    });

    it('se debe de mostrar el componente view-note si la nota no está en modo edición', () => {
        notesServiceMock.notesList.and.returnValue([{ ...noteMock, editMode: false }]);
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('view-note')).toBeTruthy();
    });
});