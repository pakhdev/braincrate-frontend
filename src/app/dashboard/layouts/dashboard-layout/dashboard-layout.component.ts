import {
    AfterViewChecked,
    AfterViewInit,
    Component,
    ElementRef, Inject,
    inject, NgZone,
    OnInit,
    ViewChild,
} from '@angular/core';
import { fromEvent } from 'rxjs';
import { DOCUMENT } from '@angular/common';

import { TagsService } from '../../services/tags.service';

@Component({
    selector: 'app-dashboard-layout',
    templateUrl: './dashboard-layout.component.html',
})
export class DashboardLayoutComponent implements OnInit, AfterViewChecked, AfterViewInit {

    @ViewChild('panelTopMargin') private readonly panelTopMarginDiv!: ElementRef;
    @ViewChild('stickyPanelContainer') private readonly stickyPanelContainerDiv!: ElementRef;
    @ViewChild('panelCopyright') private readonly panelCopyrightDiv!: ElementRef;
    @ViewChild('notesContainer') private readonly notesContainerDiv!: ElementRef;
    @ViewChild('contentMobileHeader') private readonly contentMobileHeaderDiv!: ElementRef;
    @ViewChild('mobilePanelFixer') private readonly mobilePanelFixerDiv!: ElementRef;
    private documentBody!: HTMLElement;

    public openedSection: 'notes' | 'account' = 'notes';
    private lastScrollPos = 0;
    private panelState: 'bottom' | 'up' | 'margin' | boolean = false;

    private ngZone = inject(NgZone);
    private tagsService = inject(TagsService);

    constructor(@Inject(DOCUMENT) private document: Document) {
        this.documentBody = document.body;
    }

    private handlePanelClasses() {
        const viewPortHeight = window.innerHeight + window.scrollY - window.scrollY;

        const direction = this.scrollDirection();
        console.log(direction);

        const panelHeight = this.stickyPanelContainerDiv.nativeElement.clientHeight;
        const contentHeight = this.notesContainerDiv.nativeElement.clientHeight;
        if (panelHeight > contentHeight) return;

        if (viewPortHeight > this.stickyPanelContainerDiv.nativeElement.clientHeight) {
            this.stickyPanelContainerDiv.nativeElement.className = 'panel-top-sticky';
            this.panelTopMarginDiv.nativeElement.removeAttribute('style');
            this.panelCopyrightDiv.nativeElement.style.position = 'sticky';
            this.panelCopyrightDiv.nativeElement.style.bottom = '35px';
            return;
        } else {
            this.panelCopyrightDiv.nativeElement.removeAttribute('style');
        }

        if (direction === 'down') {
            const copyrightOnScreen = this.panelCopyrightDiv.nativeElement.getBoundingClientRect().top;
            if (this.panelState !== 'bottom' && copyrightOnScreen <= viewPortHeight) {
                this.stickyPanelContainerDiv.nativeElement.className = 'panel-bottom-sticky';
                this.panelTopMarginDiv.nativeElement.className = 'flex-it';
                this.panelState = 'bottom';
                return;
            } else if (this.panelState === 'bottom') return;
        } else if (direction === 'up') {
            const panelOnScreen = this.stickyPanelContainerDiv.nativeElement.getBoundingClientRect().top;
            if (this.panelState !== 'up' && panelOnScreen >= 0) {
                this.stickyPanelContainerDiv.nativeElement.className = 'panel-top-sticky';
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

    private scrollDirection() {
        const direction =
            this.lastScrollPos === undefined ||
            this.lastScrollPos === 0 ||
            this.lastScrollPos < window.scrollY
                ? 'down' : 'up';
        this.lastScrollPos = window.scrollY;
        return direction;
    }

    ngOnInit(): void {
        this.ngZone.runOutsideAngular(() => {
            const scroll$ = fromEvent(window, 'scroll');
            scroll$.subscribe(event => {
                this.handlePanelClasses();
            });
        });
    }

    ngAfterViewChecked(): void {
        this.handlePanelClasses();
    }

    ngAfterViewInit(): void {
        if (window.innerHeight + window.scrollY > this.stickyPanelContainerDiv.nativeElement.clientHeight) {
            this.panelCopyrightDiv.nativeElement.style.position = 'sticky';
            this.panelCopyrightDiv.nativeElement.style.bottom = '35px';
        }

        if (window.innerHeight + window.scrollY > this.notesContainerDiv.nativeElement.clientHeight) {
            this.stickyPanelContainerDiv.nativeElement.style.minHeight = 'calc(100vh - 160px)';
        }
    }

    openMobilePanel() {
        this.documentBody.style.overflow = 'hidden';
        this.contentMobileHeaderDiv.nativeElement.style.visibility = 'hidden';
        this.mobilePanelFixerDiv.nativeElement.style.display = 'flex';
        this.panelCopyrightDiv.nativeElement.style = '';
    }

    closeMobilePanel() {
        this.documentBody.removeAttribute('style');
        this.contentMobileHeaderDiv.nativeElement.removeAttribute('style');
        this.mobilePanelFixerDiv.nativeElement.removeAttribute('style');
    }
}
