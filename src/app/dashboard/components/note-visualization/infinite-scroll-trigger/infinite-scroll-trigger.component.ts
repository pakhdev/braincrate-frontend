import { Component, computed, effect, ElementRef, inject, OnDestroy, OnInit, Signal, ViewChild } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { AppStore } from '../../../../shared/store/app.store';

@Component({
    standalone: true,
    selector: 'infinite-scroll-trigger',
    templateUrl: './infinite-scroll-trigger.component.html',
})
export class InfiniteScrollTriggerComponent implements OnInit, OnDestroy {
    private readonly appStore = inject(AppStore);
    @ViewChild('infiniteScrollTrigger')
    private readonly infiniteScrollTrigger!: ElementRef;
    private readonly thresholdToTrigger = 150;
    private readonly scroll$ = fromEvent(window, 'scroll');
    private scrollSubscription: Subscription | undefined;

    public showLoadingTrigger: Signal<boolean> = computed(() => {
        return !this.appStore.notes.isLoading()
            && !this.appStore.notes.allNotesLoaded()
            && this.appStore.notes.list().length > 0;
    });

    ngOnInit(): void {
        this.scrollSubscription = this.scroll$.subscribe(() => this.loadNextPage());
    }

    ngOnDestroy() {
        this.scrollSubscription?.unsubscribe();
    }

    private loadNextPage(): void {
        if (!this.infiniteScrollTrigger?.nativeElement) return;

        const triggerOnScreen = this.infiniteScrollTrigger.nativeElement.getBoundingClientRect().top;
        const viewportHeight = window.innerHeight;
        if (triggerOnScreen - this.thresholdToTrigger <= viewportHeight) {
            this.appStore.nextPage();
        }
    }
}
