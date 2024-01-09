import { NotesService } from './notes.service';
import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

import { DashboardStateService } from './dashboard-state.service';
import { Note } from '../interfaces/note.interface';
import { NoteManipulationBody } from '../interfaces/note-manipulation-body.interface';
import { TagsService } from './tags.service';
import { dashboardStateMock } from '../../../mocks/dashboard-state.mock';
import { dashboardStateServiceMock } from '../../../mocks/dashboard-state.service.mock';
import { httpMock } from '../../../mocks/http.mock';
import { noteMock } from '../../../mocks/note.mock';
import { tagsServiceMock } from '../../../mocks/tags.service.mock';

describe('NotesService', () => {

    let service: NotesService;
    const fakeTags = [{ id: 1, name: 'tag1', notesCount: 3 }, { id: 2, name: 'tag2', notesCount: 2 }];

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                NotesService,
                { provide: HttpClient, useValue: httpMock },
                { provide: TagsService, useValue: tagsServiceMock },
                { provide: DashboardStateService, useValue: dashboardStateServiceMock },
            ],
        });
        service = TestBed.inject(NotesService);
    });

    it('remove() debe de hacer la petición, actualizar el estado y llamar updateTags', () => {
        service.notesOffsetCorrection.set(0);
        service.countNotesForReview.set(5);
        service.notesList.set([noteMock]);
        httpMock.delete.and.returnValue(of({ note: noteMock, tags: fakeTags }));

        service.remove(1).subscribe();

        expect(httpMock.delete).toHaveBeenCalledWith('/notes/1');
        expect(service.countNotesForReview()).toBe(4);
        expect(service.notesOffsetCorrection()).toBe(-1);
        expect(service.notesList()[0].removedAt).toBeDefined();
        expect(tagsServiceMock.updateTags).toHaveBeenCalledWith(fakeTags);
    });

    it('restore() debe llamar a updateNoteQuery(), actualizar el estado y llamar updateTags()', () => {
        spyOn(service, 'updateNoteQuery').and.returnValue(of({
            errors: null,
            note: noteMock,
            tags: fakeTags,
        }));
        spyOn(service, 'updateNoteList');
        service.notesOffsetCorrection.set(0);
        service.countNotesForReview.set(5);
        service.notesList.set([noteMock]);

        service.restore(1).subscribe();

        expect(service.updateNoteQuery).toHaveBeenCalledWith(1, 'restore');
        expect(service.countNotesForReview()).toBe(6);
        expect(service.updateNoteList).toHaveBeenCalledWith(1, { removedAt: null });
        expect(tagsServiceMock.updateTags).toHaveBeenCalledWith(fakeTags);
        expect(service.notesOffsetCorrection()).toBe(1);
    });

    it('markAsReviewed() en la sección "for-review" debe llamar a updateNoteQuery(), removeTagsFromList() y actualizar el estado', () => {
        spyOn(service, 'updateNoteQuery').and.returnValue(of({
            errors: null,
            note: noteMock,
            tags: fakeTags,
        }));
        spyOnProperty(dashboardStateServiceMock.dashboardState$, 'value').and.returnValue({
            ...dashboardStateMock,
            notesType: 'for-review',
        });
        service.countNotesForReview.set(5);
        service.notesList.set([noteMock]);

        service.markAsReviewed(1).subscribe();

        expect(service.updateNoteQuery).toHaveBeenCalledWith(1, 'mark-as-reviewed');
        expect(service.countNotesForReview()).toBe(4);
        expect(tagsServiceMock.removeTagsFromList).toHaveBeenCalledWith(fakeTags);
        expect(service.notesList().some((note: Note) => note.id === 1)).toBe(false);
    });

    it('markAsReviewed() en la sección "all" debe llamar a updateNoteQuery(), actualizar el estado y llamar updateTags()', () => {
        spyOn(service, 'updateNoteQuery').and.returnValue(of({
            errors: null,
            note: noteMock,
            tags: fakeTags,
        }));
        spyOn(service, 'updateNoteList');
        spyOnProperty(dashboardStateServiceMock.dashboardState$, 'value').and.returnValue({
            ...dashboardStateMock,
            notesType: 'all',
        });
        service.countNotesForReview.set(5);
        service.notesList.set([noteMock]);

        service.markAsReviewed(1).subscribe();

        expect(service.updateNoteQuery).toHaveBeenCalledWith(1, 'mark-as-reviewed');
        expect(service.countNotesForReview()).toBe(4);
        expect(service.updateNoteList).toHaveBeenCalled();
    });

    it('cancelReview() en la sección "for-review" debe llamar a updateNoteQuery() y actualizar el estado', () => {
        spyOn(service, 'updateNoteQuery').and.returnValue(of({
            errors: null,
            note: noteMock,
            tags: fakeTags,
        }));
        spyOnProperty(dashboardStateServiceMock.dashboardState$, 'value').and.returnValue({
            ...dashboardStateMock,
            notesType: 'for-review',
        });
        service.countNotesForReview.set(5);
        service.notesList.set([noteMock]);
        service.cancelReviews(1).subscribe();

        expect(service.updateNoteQuery).toHaveBeenCalledWith(1, 'cancel-reviews');
        expect(service.countNotesForReview()).toBe(4);
        expect(service.notesList().some((note: Note) => note.id === 1)).toBe(false);
    });

    it('cancelReview() en la sección "all" debe llamar a updateNoteQuery(), updateTags() y actualizar el estado', () => {
        spyOn(service, 'updateNoteQuery').and.returnValue(of({
            errors: null,
            note: noteMock,
            tags: fakeTags,
        }));
        spyOn(service, 'updateNoteList');
        spyOnProperty(dashboardStateServiceMock.dashboardState$, 'value').and.returnValue({
            ...dashboardStateMock,
            notesType: 'all',
        });
        service.countNotesForReview.set(5);
        service.notesList.set([noteMock]);

        service.cancelReviews(1).subscribe();

        expect(service.updateNoteQuery).toHaveBeenCalledWith(1, 'cancel-reviews');
        expect(service.countNotesForReview()).toBe(4);
        expect(service.updateNoteList).toHaveBeenCalled();
    });

    it('resetReviews() debe llamar a updateNoteQuery() y actualizar el estado', () => {
        spyOn(service, 'updateNoteQuery').and.returnValue(of({
            errors: null,
            note: noteMock,
            tags: fakeTags,
        }));
        spyOn(service, 'updateNoteList');

        service.resetReviews(1).subscribe();

        expect(service.updateNoteQuery).toHaveBeenCalledWith(1, 'reset-reviews');
        expect(service.updateNoteList).toHaveBeenCalled();
    });

    it('createNoteQuery() debe hacer la petición', () => {
        httpMock.post.and.returnValue(of({}));

        service.createNoteQuery({} as NoteManipulationBody).subscribe();

        expect(httpMock.post).toHaveBeenCalledWith('/notes', {});
    });

    it('updateNoteQuery() debe hacer la petición con parámetros correctos', () => {
        httpMock.patch.and.returnValue(of({}));

        service.updateNoteQuery(1, 'mark-as-reviewed', { title: 'Test title' } as NoteManipulationBody).subscribe();
        expect(httpMock.patch).toHaveBeenCalledWith('/notes/mark-as-reviewed/1', { title: 'Test title' });

        service.updateNoteQuery(1, null, { title: 'Test title' } as NoteManipulationBody).subscribe();
        expect(httpMock.patch).toHaveBeenCalledWith('/notes/1', { title: 'Test title' });
    });

    it('prependNoteToList() debe agregar la nota al inicio de la lista', () => {
        service.notesList.set([noteMock]);
        const newNote = { ...noteMock, id: 2 };

        service.prependNoteToList(newNote);

        expect(service.notesList()[0]).toEqual(newNote);
    });
});