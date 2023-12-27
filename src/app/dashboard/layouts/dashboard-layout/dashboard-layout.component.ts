import {
    AfterViewChecked,
    AfterViewInit,
    Component,
    ElementRef,
    OnInit,
    ViewChild,
    inject,
    Inject,
    NgZone,
} from '@angular/core';
import { fromEvent } from 'rxjs';
import { DOCUMENT, NgClass, NgIf } from '@angular/common';
import { toObservable } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';

import { DashboardStateService } from '../../services/dashboard-state.service';
import { NotesService } from '../../services/notes.service';
import {
    NotesLoadingIndicatorComponent,
} from '../../components/note-visualization/notes-loading-indicator/notes-loading-indicator.component';
import { NotesManagementComponent } from '../../components/panel/notes-management/notes-management.component';
import { LeftMenuComponent } from '../../components/panel/left-menu/left-menu.component';
import { AccountManagementComponent } from '../../components/panel/account-management/account-management.component';
import { SearchAndPickTagsComponent } from '../../components/panel/search-and-pick-tags/search-and-pick-tags.component';
import { HeaderNavigationComponent } from '../../components/panel/header-navigation/header-navigation.component';

@Component({
    standalone: true,
    selector: 'app-dashboard-layout',
    templateUrl: './dashboard-layout.component.html',
    imports: [
        RouterOutlet,
        NgIf,
        NotesLoadingIndicatorComponent,
        NotesManagementComponent,
        LeftMenuComponent,
        AccountManagementComponent,
        SearchAndPickTagsComponent,
        HeaderNavigationComponent,
        NgClass,
    ],
})
export class DashboardLayoutComponent implements OnInit, AfterViewChecked, AfterViewInit {

    @ViewChild('panelTopMargin') private readonly panelTopMarginDiv!: ElementRef;
    @ViewChild('stickyPanelContainer') private readonly stickyPanelContainerDiv!: ElementRef;
    @ViewChild('panelCopyright') private readonly panelCopyrightDiv!: ElementRef;
    @ViewChild('notesContainer') private readonly notesContainerDiv!: ElementRef;
    @ViewChild('contentMobileHeader') private readonly contentMobileHeaderDiv!: ElementRef;
    @ViewChild('mobilePanelFixer') private readonly mobilePanelFixerDiv!: ElementRef;
    private readonly documentBody!: HTMLElement;
    private readonly ngZone = inject(NgZone);
    private readonly notesService = inject(NotesService);
    private readonly dashboardStateService = inject(DashboardStateService);
    private readonly dashboardState$ = toObservable(this.dashboardStateService.dashboardState);

    private lastScrollPos = 0;
    private panelMinHeightCorrection: null | number = null;
    private panelState: 'bottom' | 'up' | 'margin' | boolean = false;
    public openedSection: 'notes' | 'account' = 'notes';

    constructor(@Inject(DOCUMENT) private document: Document) {
        this.documentBody = document.body;
        this.dashboardState$.subscribe((dashboardState) => {
            if (!dashboardState.notesType) return;
            if (dashboardState.page === 1) window.scrollTo(0, 0);
        });
    }

    private handlePanelClasses(): void {
        const notesContainerHeight = this.notesContainerDiv.nativeElement.clientHeight;
        const stickyPanelHeight = this.stickyPanelContainerDiv.nativeElement.clientHeight;
        const viewPortHeight = window.innerHeight;

        if (viewPortHeight >= stickyPanelHeight) {
            let minHeightCorrection = viewPortHeight - notesContainerHeight + 10;
            if (minHeightCorrection < 30) minHeightCorrection = 30;
            if (minHeightCorrection > 100) minHeightCorrection = 100;
            if (minHeightCorrection !== this.panelMinHeightCorrection)
                this.stickyPanelContainerDiv.nativeElement.style.minHeight = `calc(100vh - ${ minHeightCorrection }px)`;
            this.panelMinHeightCorrection = minHeightCorrection;
            this.panelCopyrightDiv.nativeElement.style.position = 'sticky';
            this.panelCopyrightDiv.nativeElement.style.bottom = '35px';
        } else if (this.panelMinHeightCorrection !== null) {
            this.stickyPanelContainerDiv.nativeElement.removeAttribute('style');
            this.panelCopyrightDiv.nativeElement.removeAttribute('style');
            this.panelMinHeightCorrection = null;
        }

        if (stickyPanelHeight > notesContainerHeight) return;

        const direction = this.scrollDirection();

        if (direction === 'down') {
            const copyrightOnScreen = this.panelCopyrightDiv.nativeElement.getBoundingClientRect().top;
            if (this.panelState !== 'bottom' && copyrightOnScreen + 50 <= viewPortHeight) {
                this.stickyPanelContainerDiv.nativeElement.className = 'panel-bottom-sticky';
                this.panelTopMarginDiv.nativeElement.className = 'flex-it';
                this.panelState = 'bottom';
                return;
            } else if (this.panelState === 'bottom') return;
        } else if (direction === 'up') {
            const panelOnScreen = this.stickyPanelContainerDiv.nativeElement.getBoundingClientRect().top;
            if (this.panelState !== 'up' && panelOnScreen - 20 >= 0) {
                this.stickyPanelContainerDiv.nativeElement.className = 'panel-top-sticky';
                this.panelTopMarginDiv.nativeElement.removeAttribute('class');
                this.panelTopMarginDiv.nativeElement.removeAttribute('style');
                this.panelState = 'up';
                return;
            } else if (this.panelState === 'up') return;
        }

        if (this.panelState !== 'margin') {
            const extraOffset = this.stickyPanelContainerDiv.nativeElement.offsetTop - this.panelTopMarginDiv.nativeElement.offsetTop;
            if (extraOffset > 0) {
                this.panelTopMarginDiv.nativeElement.style.height = `${ extraOffset }px`;
                this.panelTopMarginDiv.nativeElement.removeAttribute('class');
                this.stickyPanelContainerDiv.nativeElement.removeAttribute('class');
                this.panelState = 'margin';
            }
        }
    }

    private scrollDirection(): 'down' | 'up' {
        const direction =
            this.lastScrollPos === undefined ||
            this.lastScrollPos === 0 ||
            this.lastScrollPos < window.scrollY
                ? 'down' : 'up';
        this.lastScrollPos = window.scrollY;
        return direction;
    }

    public ngOnInit(): void {
        this.ngZone.runOutsideAngular(() => {
            const scroll$ = fromEvent(window, 'scroll');
            scroll$.subscribe(() => {
                this.handlePanelClasses();
            });
        });
    }

    public ngAfterViewChecked(): void {
        this.handlePanelClasses();
    }

    public ngAfterViewInit(): void {
        if (window.innerHeight + window.scrollY > this.stickyPanelContainerDiv.nativeElement.clientHeight) {
            this.panelCopyrightDiv.nativeElement.style.position = 'sticky';
            this.panelCopyrightDiv.nativeElement.style.bottom = '35px';
        }

        if (window.innerHeight + window.scrollY > this.notesContainerDiv.nativeElement.clientHeight) {
            this.stickyPanelContainerDiv.nativeElement.style.minHeight = 'calc(100vh - 160px)';
        }
    }

    public openMobilePanel(): void {
        this.documentBody.style.overflow = 'hidden';
        this.contentMobileHeaderDiv.nativeElement.style.visibility = 'hidden';
        this.mobilePanelFixerDiv.nativeElement.style.display = 'flex';
        this.panelCopyrightDiv.nativeElement.style = '';
    }

    public closeMobilePanel(): void {
        this.documentBody.removeAttribute('style');
        this.contentMobileHeaderDiv.nativeElement.removeAttribute('style');
        this.mobilePanelFixerDiv.nativeElement.removeAttribute('style');
    }

    public showLoadingNotes(): boolean {
        return this.notesService.isLoading();
    }

    public activateManagementViewHandler(view: 'notes' | 'account'): void {
        this.openedSection = view;
    }

}
