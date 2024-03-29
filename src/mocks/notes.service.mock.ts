import { of } from 'rxjs';

export const createNotesServiceMock = () => ({
    createNoteQuery: jasmine.createSpy('createNoteQuery').and.returnValue(of(createNoteResponse())),
    updateNoteQuery: jasmine.createSpy('updateNoteQuery').and.returnValue(of(createNoteResponse())),
    prependNoteToList: jasmine.createSpy('prependNoteToList').and.stub(),
    updateNoteList: jasmine.createSpy('updateNoteList').and.stub(),
    resetReviews: jasmine.createSpy('resetReviews').and.returnValue(of({})),
    cancelReviews: jasmine.createSpy('cancelReviews').and.returnValue(of({})),
    remove: jasmine.createSpy('remove').and.returnValue(of({})),
    restore: jasmine.createSpy('restore').and.returnValue(of({})),
    markAsReviewed: jasmine.createSpy('markAsReviewed').and.returnValue(of({})),
    isLoading: jasmine.createSpy('isLoading').and.returnValue(() => false),
    allNotesLoaded: jasmine.createSpy('allNotesLoaded').and.returnValue(() => false),
    notesList: jasmine.createSpy('notesList').and.returnValue([]),
});

function createNoteResponse() {
    return {
        note: { id: 1 },
        tags: [
            { id: 1, name: 'Etiqueta1' },
            { id: 2, name: 'Etiqueta2' },
        ],
    };
}