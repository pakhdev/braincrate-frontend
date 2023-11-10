import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
import { NgIf } from '@angular/common';

import { NotesService } from '../../../services/notes.service';
import { DashboardStateService } from '../../../services/dashboard-state.service';

@Component({
    standalone: true,
    selector: 'infinite-scroll-trigger',
    templateUrl: './infinite-scroll-trigger.component.html',
    imports: [
        NgIf,
    ],
})
export class InfiniteScrollTriggerComponent implements OnInit {

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

    private loadNextPage(): void {
        if (!this.infiniteScrollTrigger?.nativeElement) return;

        const triggerOnScreen = this.infiniteScrollTrigger.nativeElement.getBoundingClientRect().top;
        const viewportHeight = window.innerHeight;
        if (triggerOnScreen - this.thresholdToTrigger <= viewportHeight) {
            this.dashboardStateService.nextPage();
        }
    }
}
