import { Component, computed, inject, Signal } from '@angular/core';
import { NgClass } from '@angular/common';

import {
    InfiniteScrollTriggerComponent,
} from '../../components/note-visualization/infinite-scroll-trigger/infinite-scroll-trigger.component';
import {
    ReviewsCompletedMessageComponent,
} from '../../components/note-visualization/reviews-completed-message/reviews-completed-message.component';
import { ViewNoteComponent } from '../../components/note-visualization/view-note/view-note.component';
import { EditNoteComponent } from '../../components/note-editing/edit-note/edit-note.component';
import { Note } from '../../interfaces/note.interface';
import { AppStore } from '../../../shared/store/app.store';

@Component({
    selector: 'dashboard-review-notes-page',
    templateUrl: './review-notes-page.component.html',
    imports: [
        NgClass,
        InfiniteScrollTriggerComponent,
        ReviewsCompletedMessageComponent,
        ViewNoteComponent,
        EditNoteComponent,
    ],
})
export class ReviewNotesPageComponent {
    private readonly appStore = inject(AppStore);
    public readonly notes: Signal<Note[]> = computed(() => this.appStore.notes.list());
    public readonly areAllNotesReviewed: Signal<boolean> = computed(() => {
        return !this.appStore.notes.isLoading()
            && this.appStore.notes.list().length === 0;
    });
}
