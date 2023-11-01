import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';

import { NotesService } from '../../services/notes.service';
import { fromEvent } from 'rxjs';
import { DashboardStateService } from '../../services/dashboard-state.service';

@Component({
    selector: 'dashboard-infinite-scroll',
    templateUrl: './infinite-scroll.component.html',
})
export class InfiniteScrollComponent implements OnInit {

    @ViewChild('infiniteScrollTrigger')
    private readonly infiniteScrollTrigger!: ElementRef;
    private readonly notesService = inject(NotesService);
    private readonly dashboardStateService = inject(DashboardStateService);
    private readonly thresholdToTrigger = 150;

    public showLoadingTrigger(): boolean {
        return !this.notesService.isLoading()
            && !this.notesService.allNotesLoaded()
            && this.notesService.notesList().length > 0;
    }

    ngOnInit(): void {
        const scroll$ = fromEvent(window, 'scroll');
        scroll$.subscribe(() => this.loadNextPage());
    }

    private loadNextPage() {
        if (!this.infiniteScrollTrigger?.nativeElement) return;

        const triggerOnScreen = this.infiniteScrollTrigger.nativeElement.getBoundingClientRect().top;
        const viewportHeight = window.innerHeight;
        if (triggerOnScreen - this.thresholdToTrigger <= viewportHeight) {
            this.dashboardStateService.nextPage();
        }
    }
}
