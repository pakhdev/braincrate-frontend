import { signal } from '@angular/core';

import { TagsService } from '../app/dashboard/services/tags.service';
import { of } from 'rxjs';

export const tagsServiceMock: Partial<TagsService> = {
    get selectedTags() {
        return [
            { id: 1, name: 'tag1', notesCount: 5 },
        ];
    },
    get notSelectedTags() {
        return [
            { id: 2, name: 'tag2', notesCount: 7 },
            { id: 3, name: 'tag3', notesCount: 9 },
            { id: 4, name: 'tag4', notesCount: 5 },
        ];
    },
    getTags() {
        return of([
            { id: 1, name: 'tag1', notesCount: 5 },
            { id: 2, name: 'tag2', notesCount: 7 },
            { id: 3, name: 'tag3', notesCount: 9 },
            { id: 4, name: 'tag4', notesCount: 5 },
        ]);
    },
    tags: signal([]),
    isLoading: signal(false),
    updateTags: jasmine.createSpy('updateTags'),
    removeTagsFromList: jasmine.createSpy('updateTags'),
};