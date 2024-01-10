import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchNotesComponent } from './search-notes.component';
import { dashboardStateServiceMock } from '../../../../../mocks/dashboard-state.service.mock';
import { DashboardStateService } from '../../../services/dashboard-state.service';
import { DashboardState } from '../../../interfaces/dashboard-state.interface';

describe('SearchNotesComponent', () => {
    let component: SearchNotesComponent;
    let fixture: ComponentFixture<SearchNotesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SearchNotesComponent],
            providers: [
                { provide: DashboardStateService, useValue: dashboardStateServiceMock },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(SearchNotesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('no llama setState si el valor de input coincide con el valor de búsqueda en el estado', () => {
        spyOnProperty(dashboardStateServiceMock.dashboardState$, 'value').and.returnValue({
            searchWord: 'valor de búsqueda',
        } as DashboardState);
        component['searchInput']!.nativeElement.value = 'valor de búsqueda';
        spyOn(dashboardStateServiceMock, 'setState');

        component.searchNotes();

        expect(dashboardStateServiceMock.setState).not.toHaveBeenCalled();
    });

    it('llama setState con parámetros correctos si el valor de input no coincide con el valor de búsqueda en el' +
        ' estado', () => {
        spyOnProperty(dashboardStateServiceMock.dashboardState$, 'value').and.returnValue({
            searchWord: 'valor de búsqueda',
        } as DashboardState);
        component['searchInput']!.nativeElement.value = 'valor de búsqueda 2';
        spyOn(dashboardStateServiceMock, 'setState');

        component.searchNotes();

        expect(dashboardStateServiceMock.setState).toHaveBeenCalledWith({
            notesType: 'all',
            selectedTags: [],
            searchWord: 'valor de búsqueda 2',
            page: 1,
        });
    });

});