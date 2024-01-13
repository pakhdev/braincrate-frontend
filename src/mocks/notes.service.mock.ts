import { of } from 'rxjs';

export const notesServiceMock = {
    createNoteQuery: jasmine.createSpy('createNoteQuery').and.callFake(
        () => of({
            note: { id: 1 },
            tags: [
                { id: 1, name: 'Etiqueta1' },
                { id: 2, name: 'Etiqueta2' },
            ],
        }),
    ),
    updateNoteQuery: jasmine.createSpy('updateNoteQuery').and.callFake(
        () => of({
            note: { id: 1 },
            tags: [
                { id: 1, name: 'Etiqueta1' },
                { id: 2, name: 'Etiqueta2' },
            ],
        }),
    ),
    prependNoteToList: jasmine.createSpy('prependNoteToList').and.callFake(
        () => { },
    ),
    updateNoteList: jasmine.createSpy('updateNoteList').and.callFake(
        () => { },
    ),
    resetReviews: jasmine.createSpy('resetReviews').and.callFake(
        () => of({}),
    ),
    cancelReviews: jasmine.createSpy('cancelReviews').and.callFake(
        () => of({}),
    ),
};