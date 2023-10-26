import { Component, EventEmitter, inject, Input, Output } from '@angular/core';

import { DashboardStateService } from '../../services/dashboard-state.service';

@Component({
    selector: 'dashboard-header-navigation',
    templateUrl: './header-navigation.component.html',
})
export class HeaderNavigationComponent {

    @Input() public mobile: boolean = false;
    @Input() public logoMode: 'dark' | 'light' = 'light';

    @Output()
    public openMobilePanel: EventEmitter<void> = new EventEmitter();

    private dashboardStateService = inject(DashboardStateService);

    get isReviewSectionActive() {
        return this.dashboardStateService.selectedSection === 'for-review';
    }

    public openMobilePanelHandler(): void {
        this.openMobilePanel.emit();
    }
}
