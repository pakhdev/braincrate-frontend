import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchAndPickTagsComponent } from './search-and-pick-tags.component';
import { TagsService } from '../../../services/tags.service';
import { DashboardStateService } from '../../../services/dashboard-state.service';
import { createDashboardStateServiceMock } from '../../../../../mocks/dashboard-state.service.mock';
import { createTagsServiceMock } from '../../../../../mocks/tags.service.mock';
import { DashboardState } from '../../../interfaces/dashboard-state.interface';
import { createDashboardStateMock } from '../../../../../mocks/dashboard-state.mock';

describe('SearchAndPickTagsComponent', () => {
    let component: SearchAndPickTagsComponent;
    let fixture: ComponentFixture<SearchAndPickTagsComponent>;
    const tagsServiceMock = createTagsServiceMock();
    const dashboardStateServiceMock = createDashboardStateServiceMock();

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SearchAndPickTagsComponent],
            providers: [
                { provide: TagsService, useValue: tagsServiceMock },
                { provide: DashboardStateService, useValue: dashboardStateServiceMock },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(SearchAndPickTagsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('debe retornar el contenido del getter selectedTags de tagsService', () => {
        expect(component.selectedTags).toEqual([{ id: 1, name: 'tag1', notesCount: 5 }]);
    });

    it('debe retornar el contenido del getter notSelectedTags con término de búsqueda', () => {
        component['searchTagsTerm'] = 'tag2';
        expect(component.notSelectedTags).toEqual([{ id: 2, name: 'tag2', notesCount: 7 }]);
    });

    it('areTagsLoading debe retornar el valor isLoading de tagsService', () => {
        tagsServiceMock.isLoading?.set(true);
        expect(component.areTagsLoading).toEqual(true);
    });

    it('selectTag debe llamar al método setState de dashboardStateService con parámetros correctos', () => {
        spyOn(dashboardStateServiceMock, 'setState');
        component.selectTag(3);
        expect(dashboardStateServiceMock.setState).toHaveBeenCalledWith({
            page: 1,
            selectedTags: [1, 2, 3],
        });
    });

    it('selectTag no debe llamar al método setState de dashboardStateService si el tag ya está seleccionado', () => {
        spyOn(dashboardStateServiceMock, 'setState');
        component.selectTag(1);
        expect(dashboardStateServiceMock.setState).not.toHaveBeenCalled();
    });

    it('unselectTag debe llamar al método setState de dashboardStateService con parámetros correctos', () => {
        spyOn(dashboardStateServiceMock, 'setState');
        component.unselectTag(1);
        expect(dashboardStateServiceMock.setState).toHaveBeenCalledWith({
            page: 1,
            selectedTags: dashboardStateServiceMock.selectedTags.filter(tagId => tagId !== 1),
        });
    });

    it('unselectTag no debe llamar al método setState de dashboardStateService si el tag no está seleccionado', () => {
        spyOn(dashboardStateServiceMock, 'setState');
        component.unselectTag(3);
        expect(dashboardStateServiceMock.setState).not.toHaveBeenCalled();
    });

    it('searchTags debe asignar el valor del input de búsqueda al atributo searchTagsTerm', () => {
        component['searchTagsInput'].nativeElement.value = 'tag2';
        component.searchTags();
        expect(component['searchTagsTerm']).toEqual('tag2');
    });

    it('isSearchTagsInputToBeCleared devuelve true si ha cambiado notesType', () => {
        const previous: DashboardState = { ...createDashboardStateMock(), notesType: 'all' };
        const current: DashboardState = { ...createDashboardStateMock(), notesType: 'for-review' };
        expect(component['isSearchTagsInputToBeCleared'](previous, current)).toBeTrue();
    });

    it('isSearchTagsInputToBeCleared devuelve true si ha cambiado searchWord', () => {
        const previous: DashboardState = { ...createDashboardStateMock(), searchWord: 'previous' };
        const current: DashboardState = { ...createDashboardStateMock(), searchWord: 'current' };
        expect(component['isSearchTagsInputToBeCleared'](previous, current)).toBeTrue();
    });

    it('isSearchTagsInputToBeCleared devuelve true si ha cambiado selectedTags', () => {
        const previous: DashboardState = { ...createDashboardStateMock(), selectedTags: [1] };
        const current: DashboardState = { ...createDashboardStateMock(), selectedTags: [2] };
        expect(component['isSearchTagsInputToBeCleared'](previous, current)).toBeTrue();
    });

    it('isSearchTagsInputToBeCleared devuelve false si no ha cambiado notesType, searchWord o selectedTags', () => {
        const previous: DashboardState = { ...createDashboardStateMock(), notesType: 'all' };
        const current: DashboardState = { ...createDashboardStateMock(), notesType: 'all' };
        expect(component['isSearchTagsInputToBeCleared'](previous, current)).toBeFalse();
    });

});