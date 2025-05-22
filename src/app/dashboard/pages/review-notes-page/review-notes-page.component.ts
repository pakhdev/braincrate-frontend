import { Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';

import { NotesService } from '../../services/notes.service';
import {
    InfiniteScrollTriggerComponent,
} from '../../components/note-visualization/infinite-scroll-trigger/infinite-scroll-trigger.component';
import {
    ReviewsCompletedMessageComponent,
} from '../../components/note-visualization/reviews-completed-message/reviews-completed-message.component';
import { ViewNoteComponent } from '../../components/note-visualization/view-note/view-note.component';
import { EditNoteComponent } from '../../components/note-editing/edit-note/edit-note.component';
import { Note } from '../../interfaces/note.interface';

@Component({
    selector: 'dashboard-review-notes-page',
    templateUrl: './review-notes-page.component.html',
    imports: [
        NgClass,
        InfiniteScrollTriggerComponent,
        ReviewsCompletedMessageComponent,
        ViewNoteComponent,
        EditNoteComponent,
    ]
})
export class ReviewNotesPageComponent {

    private readonly notesService = inject(NotesService);

    get notes(): Note[] {
        return this.notesService.notesList();
    }

    showReviewsCompleted(): boolean {
        return !this.notesService.isLoading()
            && this.notesService.notesList().length === 0;
    }
}
