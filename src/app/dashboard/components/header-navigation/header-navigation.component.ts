import { Component, EventEmitter, inject, Input, Output } from '@angular/core';

import { DashboardStateService } from '../../services/dashboard-state.service';
import { NotesService } from '../../services/notes.service';

@Component({
    selector: 'dashboard-header-navigation',
    templateUrl: './header-navigation.component.html',
})
export class HeaderNavigationComponent {

    @Input() public mobile: boolean = false;
    @Input() public logoMode: 'dark' | 'light' = 'light';
    @Input() public showButtons: boolean = true;
    private readonly notesService = inject(NotesService);

    @Output()
    public openMobilePanel: EventEmitter<void> = new EventEmitter();

    private dashboardStateService = inject(DashboardStateService);

    get isReviewSectionActive() {
        return this.dashboardStateService.selectedSection === 'for-review';
    }

    get notesForReviewCount() {
        const notesForReviewCount = this.notesService.countNotesForReview();
        return notesForReviewCount > 0 ? `(${ notesForReviewCount })` : null;
    }

    public openMobilePanelHandler(): void {
        this.openMobilePanel.emit();
    }
}
