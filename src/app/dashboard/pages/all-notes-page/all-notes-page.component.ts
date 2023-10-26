import { Component, inject, OnInit } from '@angular/core';

import { NotesService } from '../../services/notes.service';
import { DashboardStateService } from '../../services/dashboard-state.service';

@Component({
    selector: 'dashboard-all-notes-page',
    templateUrl: './all-notes-page.component.html',
})
export class AllNotesPageComponent implements OnInit {

    private dashboardStateService = inject(DashboardStateService);
    public notesService = inject(NotesService);

    ngOnInit(): void {
        this.dashboardStateService.setState({ notesType: 'all' });
    }

    get notes() {
        return this.notesService.notes();
    }

}
