import { Component, inject } from '@angular/core';

import { NotesService } from '../../services/notes.service';

@Component({
    selector: 'dashboard-review-notes-page',
    templateUrl: './review-notes-page.component.html',
})
export class ReviewNotesPageComponent {

    private readonly notesService = inject(NotesService);

    get notes() {
        return this.notesService.notesList();
    }

    showReviewsCompleted() {
        return !this.notesService.isLoading()
            && this.notesService.notesList().length === 0;
    }
}
