import { SearchAndPickTagsComponent } from './search-and-pick-tags.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TagsService } from '../../../services/tags.service';
import { DashboardStateService } from '../../../services/dashboard-state.service';
import { DashboardState } from '../../../interfaces/dashboard-state.interface';
import { of, pairwise } from 'rxjs';
import { signal } from '@angular/core';

xdescribe('SearchAndPickTagsComponent', () => {
    let component: SearchAndPickTagsComponent;
    let fixture: ComponentFixture<SearchAndPickTagsComponent>;

    const fakeTagsService: Partial<TagsService> = {
        selectedTags: [],
        notSelectedTags: [],
        tags: signal([]),
        isLoading: signal(false),
    };
    const baseDashboardState: DashboardState = {
        selectedTags: [],
        searchWord: '',
        notesType: '',
        page: 0,
    };
    const fakeDashboardStateService = {
        dashboardState$: of([{ ...baseDashboardState }]).pipe(pairwise()),
        dashboardState: { ...baseDashboardState },
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SearchAndPickTagsComponent],
            providers: [
                { provide: TagsService, useValue: fakeTagsService },
                { provide: DashboardStateService, useValue: fakeDashboardStateService },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(SearchAndPickTagsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});