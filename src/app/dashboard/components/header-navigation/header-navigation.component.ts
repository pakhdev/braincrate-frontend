import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

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
    private readonly router = inject(Router);
    private readonly notesService = inject(NotesService);
    private readonly dashboardStateService = inject(DashboardStateService);

    @Output()
    public openMobilePanel: EventEmitter<void> = new EventEmitter();

    get isReviewSectionActive() {
        return this.dashboardStateService.selectedSection === 'for-review';
    }

    get isNoteCreationActive() {
        return this.router.url === '/dashboard/new-note';
    }

    get currentSection() {
        return this.dashboardStateService.dashboardState().notesType;
    }

    cancelNoteCreation() {
        const currentSection = this.dashboardStateService.dashboardState().notesType;
        this.router.navigate(['dashboard', currentSection], { queryParams: { preserveState: 'true' } });
    }

    get notesForReviewCount() {
        const notesForReviewCount = this.notesService.countNotesForReview();
        return notesForReviewCount > 0 ? `(${ notesForReviewCount })` : null;
    }

    public openMobilePanelHandler(): void {
        this.openMobilePanel.emit();
    }

}
