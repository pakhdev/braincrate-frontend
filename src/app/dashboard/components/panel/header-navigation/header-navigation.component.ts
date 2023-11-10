import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';

import { NotesService } from '../../../services/notes.service';
import { DashboardStateService } from '../../../services/dashboard-state.service';

@Component({
    standalone: true,
    selector: 'header-navigation',
    templateUrl: './header-navigation.component.html',
    imports: [
        NgIf,
        RouterLink,
    ],
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

    get isReviewSectionActive(): boolean {
        return this.dashboardStateService.selectedSection === 'for-review';
    }

    get isNoteCreationActive(): boolean {
        return this.router.url === '/dashboard/new-note';
    }

    cancelNoteCreation(): void {
        const currentSection = this.dashboardStateService.dashboardState().notesType;
        this.router.navigate(['dashboard', currentSection], { queryParams: { preserveState: 'true' } });
    }

    get notesForReviewCount(): string | null {
        const notesForReviewCount = this.notesService.countNotesForReview();
        return notesForReviewCount > 0 ? `(${ notesForReviewCount })` : null;
    }

    public openMobilePanelHandler(): void {
        this.openMobilePanel.emit();
    }

}
