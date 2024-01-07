import { TestBed } from '@angular/core/testing';

import { DashboardStateService } from './dashboard-state.service';

describe('DashboardStateService', () => {
    let service: DashboardStateService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                DashboardStateService,
            ],
        });
        service = TestBed.inject(DashboardStateService);
    });

    it('setState tiene que actualizar el estado o resetear todo si existe notesType', () => {
        const oldNotesType = service.dashboardState$.value.notesType;
        service.setState({
            selectedTags: [1],
            searchWord: 'search',
            page: 1,
        });
        expect(service.dashboardState$.value).toEqual({
            selectedTags: [1],
            searchWord: 'search',
            notesType: oldNotesType,
            page: 1,
        });
        service.setState({
            notesType: 'all',
        });
        expect(service.dashboardState$.value).toEqual({
            selectedTags: [],
            searchWord: '',
            notesType: 'all',
            page: 1,
        });

    });

    it('nextPage tiene que incrementar la página', () => {
        service.nextPage();
        expect(service.dashboardState$.value.page).toBe(1);
    });

    it('dashboardState tiene que devolver el estado', () => {
        expect(service.dashboardState.notesType).toBeDefined();
        expect(service.dashboardState.selectedTags).toBeDefined();
        expect(service.dashboardState.searchWord).toBeDefined();
        expect(service.dashboardState.page).toBeDefined();
    });

    it('selectedTags tiene que devolver los tags seleccionados', () => {
        service.setState({
            selectedTags: [1, 2],
        });
        expect(service.selectedTags).toEqual([1, 2]);
    });

    it('selectedSection tiene que devolver la sección seleccionada', () => {
        service.setState({
            notesType: 'all',
        });
        expect(service.selectedSection).toBe('all');
    });
});