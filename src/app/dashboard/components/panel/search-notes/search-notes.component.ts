import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';

import { DashboardStateService } from '../../../services/dashboard-state.service';

@Component({
    standalone: true,
    selector: 'search-notes',
    templateUrl: './search-notes.component.html',
})
export class SearchNotesComponent implements OnInit {

    @ViewChild('searchInput') private readonly searchInput: ElementRef | undefined;
    private readonly dashboardStateService = inject(DashboardStateService);
    private readonly dashboardState$ = this.dashboardStateService.dashboardState$;

    public searchNotes(): void {
        const stateSearchWord = this.dashboardState$.value.searchWord;
        if (this.searchInput?.nativeElement.value === stateSearchWord) return;

        this.dashboardStateService.setState({
            notesType: 'all',
            selectedTags: [],
            searchWord: this.searchInput?.nativeElement.value,
            page: 1,
        });

    }

    ngOnInit(): void {
        this.dashboardState$.subscribe(state => {
            if (this.searchInput && !state.searchWord) this.searchInput.nativeElement.value = '';
        });
    }
}
