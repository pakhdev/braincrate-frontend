import { Component, computed, EventEmitter, inject, Input, Output, Signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AppStore } from '../../../../shared/store/app.store';

@Component({
    selector: 'header-navigation',
    templateUrl: './header-navigation.component.html',
    imports: [
        RouterLink,
    ],
})
export class HeaderNavigationComponent {

    @Input() public mobile: boolean = false;
    @Input() public logoMode: 'dark' | 'light' = 'light';
    @Input() public showButtons: boolean = true;
    @Output() public openMobilePanel: EventEmitter<void> = new EventEmitter();

    private readonly appStore = inject(AppStore);
    private readonly router = inject(Router);

    public readonly isReviewSectionActive: Signal<boolean> = computed(() => this.appStore.dashboard.notesType() === 'for-review');
    public readonly isNoteCreationActive: Signal<boolean> = computed(() => this.router.url === '/dashboard/new-note');
    public readonly notesForReviewCount: Signal<string | null> = computed(() => {
        const counter = this.appStore.notes.notesForReviewCounter();
        return counter > 0 ? `(${ counter })` : null;
    });

    public cancelNoteCreation(): void {
        const currentSection = this.appStore.dashboard.notesType || 'all';
        this.router.navigate(['dashboard', currentSection], { queryParams: { preserveState: 'true' } });
    }

    public openMobilePanelHandler(): void {
        this.openMobilePanel.emit();
    }

}
