import { NotesService } from './notes.service';
import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { Note } from '../interfaces/note.interface';
import { TagsService } from './tags.service';

describe('NotesService', () => {

    let service: NotesService;
    const fakeHttp = jasmine.createSpyObj('httpClient', ['get', 'delete']);
    const fakeTagsService = jasmine.createSpyObj('tagsService', ['updateTags']);

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                NotesService,
                { provide: HttpClient, useValue: fakeHttp },
                { provide: TagsService, useValue: fakeTagsService },
            ],
        });
        service = TestBed.inject(NotesService);
    });

    it('remove() debe de hacer la petición, actualizar el estado y llamar updateTags', () => {
        const fakeNote = { id: 1, nextReviewAt: '0000-00-00 00:00:00', reviewsLeft: 3, removedAt: null } as Note;
        const fakeTags = [{ id: 1, name: 'tag1' }, { id: 2, name: 'tag2' }];
        service.notesOffsetCorrection.set(0);
        service.countNotesForReview.set(5);
        service.notesList.update(() => [fakeNote]);

        fakeHttp.delete.and.returnValue(of({ note: fakeNote, tags: fakeTags }));
        service.remove(1).subscribe();

        expect(fakeHttp.delete).toHaveBeenCalledWith('/notes/1');
        expect(service.countNotesForReview()).toBe(4);
        expect(service.notesOffsetCorrection()).toBe(-1);
        expect(service.notesList()[0].removedAt).toBeDefined();
        expect(fakeTagsService.updateTags).toHaveBeenCalledWith(fakeTags);
    });

});