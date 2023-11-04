import { Component, inject, OnInit } from '@angular/core';

import { NotesService } from '../../services/notes.service';
import { DashboardStateService } from '../../services/dashboard-state.service';

@Component({
    selector: 'dashboard-all-notes-page',
    templateUrl: './all-notes-page.component.html',
})
export class AllNotesPageComponent implements OnInit {

    private readonly dashboardStateService = inject(DashboardStateService);
    private readonly notesService = inject(NotesService);

    ngOnInit(): void {
        this.dashboardStateService.setState({ notesType: 'all' });
    }

    get notes() {
        return this.notesService.notesList();
    }

    public showWelcomeMessage() {
        return !this.dashboardStateService.dashboardState().searchWord
            && !this.notesService.isLoading()
            && this.notesService.notesList().length === 0;
    }

    public showEmptySearchResult() {
        return this.dashboardStateService.dashboardState().searchWord
            && !this.notesService.isLoading()
            && this.notesService.notesList().length === 0;
    }

}
