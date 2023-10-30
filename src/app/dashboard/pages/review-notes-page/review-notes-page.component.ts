import { Component, inject, OnInit } from '@angular/core';

import { DashboardStateService } from '../../services/dashboard-state.service';
import { NotesService } from '../../services/notes.service';

@Component({
    selector: 'dashboard-review-notes-page',
    templateUrl: './review-notes-page.component.html',
})
export class ReviewNotesPageComponent implements OnInit {

    private dashboardStateService = inject(DashboardStateService);
    public notesService = inject(NotesService);

    ngOnInit(): void {
        this.dashboardStateService.setState({ notesType: 'for-review' });
    }

    get notes() {
        return this.notesService.notesList();
    }
}
