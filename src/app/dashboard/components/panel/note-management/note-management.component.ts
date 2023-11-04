import { Component, inject } from '@angular/core';
import { DashboardStateService } from '../../../services/dashboard-state.service';

@Component({
    selector: 'panel-note-management',
    templateUrl: './note-management.component.html',
})
export class NoteManagementComponent {

    private readonly dashboardStateService = inject(DashboardStateService);

    public showSearchForm(): boolean {
        return this.dashboardStateService.dashboardState().notesType === 'all';
    }
}
