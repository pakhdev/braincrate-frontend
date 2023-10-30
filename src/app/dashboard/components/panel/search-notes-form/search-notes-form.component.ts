import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';

import { DashboardStateService } from '../../../services/dashboard-state.service';

@Component({
    selector: 'dashboard-search-notes-form',
    templateUrl: './search-notes-form.component.html',
})
export class SearchNotesFormComponent implements OnInit {

    @ViewChild('searchInput') private readonly searchInput: ElementRef | undefined;
    private readonly dashboardStateService = inject(DashboardStateService);
    private readonly dashboardState$ = toObservable(this.dashboardStateService.dashboardState);

    constructor() {

    }

    public searchNotes(): void {
        const stateSearchWord = this.dashboardStateService.dashboardState().searchWord;
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
