import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpParams } from '@angular/common/http';
import { of } from 'rxjs';

import { DashboardState } from '../interfaces/dashboard-state.interface';
import { DashboardStateService } from './dashboard-state.service';
import { TagsService } from './tags.service';
import { createDashboardStateMock } from '../../../mocks/dashboard-state.mock';
import { createDashboardStateServiceMock } from '../../../mocks/dashboard-state.service.mock';
import { httpMock } from '../../../mocks/http.mock';

describe('TagsService', () => {
    let service: TagsService;
    const dashboardStateMock = createDashboardStateMock();
    const dashboardStateServiceMock = createDashboardStateServiceMock();

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                TagsService,
                { provide: HttpClient, useValue: httpMock },
                { provide: DashboardStateService, useValue: dashboardStateServiceMock },
            ],
        });
        service = TestBed.inject(TagsService);
    });

    it('selectedTags() devuelve los tags ordenados que se encuentran seleccionados en dashboardStateService ', () => {
        service.tags.set([
            { id: 1, name: 'tag1', notesCount: 5 },
            { id: 2, name: 'tag2', notesCount: 7 },
            { id: 3, name: 'tag3', notesCount: 9 },
        ]);
        expect(service.selectedTags).toEqual([
            { id: 2, name: 'tag2', notesCount: 7 },
            { id: 1, name: 'tag1', notesCount: 5 },
        ]);
    });

    it('notSelectedTags() devuelve los tags ordenados que no se encuentran seleccionados en dashboardStateService ', () => {
        service.tags.set([
            { id: 1, name: 'tag1', notesCount: 5 },
            { id: 3, name: 'tag3', notesCount: 7 },
            { id: 4, name: 'tag4', notesCount: 9 },
        ]);
        expect(service.notSelectedTags).toEqual([
            { id: 4, name: 'tag4', notesCount: 9 },
            { id: 3, name: 'tag3', notesCount: 7 },
        ]);
    });

    it('getTags() llama a http.get con los parámetros correctos y asigna isLoading', () => {
        const spySet = spyOn(service.isLoading, 'set').and.callThrough();
        httpMock.get.and.returnValue(of([]));
        service.getTags([1, 2], 'search word', 'all').subscribe();
        const params = new HttpParams()
            .append('searchTerm', 'search word')
            .append('parentTagIds[]', '1')
            .append('parentTagIds[]', '2');

        expect(httpMock.get).toHaveBeenCalledWith('/tags', { params });
        expect(spySet).toHaveBeenCalledTimes(2);
        expect(spySet).toHaveBeenCalledWith(true);
        expect(spySet).toHaveBeenCalledWith(false);
    });

    it('updateTags() actualiza los tags existentes con los nuevos', () => {
        const existingTags = [
            { id: 1, name: 'tag1', notesCount: 5 },
            { id: 2, name: 'tag2', notesCount: 7 },
            { id: 3, name: 'tag3', notesCount: 9 },
        ];
        service.tags.set(existingTags);
        const tagsToUpdate = [
            { id: 1, name: 'tag1', notesCount: 6 },
            { id: 3, name: 'tag3', notesCount: 10 },
            { id: 4, name: 'tag4', notesCount: 15 },
        ];
        service.updateTags(tagsToUpdate);
        expect(service.tags()).toEqual([
            { id: 1, name: 'tag1', notesCount: 6 },
            { id: 2, name: 'tag2', notesCount: 7 },
            { id: 3, name: 'tag3', notesCount: 10 },
            { id: 4, name: 'tag4', notesCount: 15 },
        ]);
    });

    it('removeTagsFromList() elimina los tags de la lista', () => {
        service.tags.set([
            { id: 1, name: 'tag1', notesCount: 5 },
            { id: 2, name: 'tag2', notesCount: 7 },
        ]);
        service.removeTagsFromList([{ id: 1, name: 'tag1', notesCount: 5 }]);
        expect(service.tags()).toEqual([{ id: 2, name: 'tag2', notesCount: 7 }]);
    });

    it('isTagsLoadRequired() devuelve true si notesType ha cambiado', () => {
        const previous: DashboardState = { ...dashboardStateMock, notesType: 'all' };
        const current: DashboardState = { ...dashboardStateMock, notesType: 'for-review' };
        expect(service['isTagsLoadRequired'](previous, current)).toBeTrue();
    });

    it('isTagsLoadRequired() devuelve false si no ha cambiado selectedTags, notesType o searchWord', () => {
        const previous: DashboardState = { ...dashboardStateMock };
        const current: DashboardState = { ...dashboardStateMock };
        expect(service['isTagsLoadRequired'](previous, current)).toBeFalse();
    });

    it('isTagsLoadRequired() devuelve true si searchWord ha cambiado', () => {
        const previous: DashboardState = { ...dashboardStateMock, searchWord: '' };
        const current: DashboardState = { ...dashboardStateMock, searchWord: 'new search word' };
        expect(service['isTagsLoadRequired'](previous, current)).toBeTrue();
    });

    it('isTagsLoadRequired() devuelve true si selectedTags ha cambiado', () => {
        const previous: DashboardState = { ...dashboardStateMock, selectedTags: [] };
        const current: DashboardState = { ...dashboardStateMock, selectedTags: [1] };
        expect(service['isTagsLoadRequired'](previous, current)).toBeTrue();
    });

});