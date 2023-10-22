import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'dashboard-header-navigation',
    templateUrl: './header-navigation.component.html',
})
export class HeaderNavigationComponent {
    @Input() public mobile: boolean = false;
    @Input() public logoMode: 'dark' | 'light' = 'light';

    @Output()
    public openMobilePanel: EventEmitter<void> = new EventEmitter();

    public openMobilePanelHandler(): void {
        this.openMobilePanel.emit();
    }
}
