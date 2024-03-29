import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';

import { NotesService } from '../../../services/notes.service';
import { DashboardStateService } from '../../../services/dashboard-state.service';

@Component({
    standalone: true,
    selector: 'infinite-scroll-trigger',
    templateUrl: './infinite-scroll-trigger.component.html',
})
export class InfiniteScrollTriggerComponent implements OnInit, OnDestroy {

    @ViewChild('infiniteScrollTrigger')
    private readonly infiniteScrollTrigger!: ElementRef;
    private readonly notesService = inject(NotesService);
    private readonly dashboardStateService = inject(DashboardStateService);
    private readonly thresholdToTrigger = 150;
    private readonly scroll$ = fromEvent(window, 'scroll');
    private scrollSubscription: Subscription | undefined;

    ngOnInit(): void {
        this.scrollSubscription = this.scroll$.subscribe(() => this.loadNextPage());
    }

    ngOnDestroy() {
        this.scrollSubscription?.unsubscribe();
    }

    public showLoadingTrigger(): boolean {
        return !this.notesService.isLoading()
            && !this.notesService.allNotesLoaded()
            && this.notesService.notesList().length > 0;
    }

    private loadNextPage(): void {
        if (!this.infiniteScrollTrigger?.nativeElement) return;

        const triggerOnScreen = this.infiniteScrollTrigger.nativeElement.getBoundingClientRect().top;
        const viewportHeight = window.innerHeight;
        if (triggerOnScreen - this.thresholdToTrigger <= viewportHeight) {
            this.dashboardStateService.nextPage();
        }
    }
}
