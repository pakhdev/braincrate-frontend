import { Component, computed, inject, Input } from '@angular/core';

import { NotesService } from '../../../services/notes.service';
import { Note } from '../../../interfaces/note.interface';
import { Difficulty } from '../../../enums/difficulty.enum';

@Component({
    selector: 'note-review-options',
    templateUrl: './review-options.component.html',
})
export class ReviewOptionsComponent {
    @Input({ required: true }) public visible!: boolean;
    @Input({ required: true }) public note!: Note;

    private readonly notesService = inject(NotesService);

    public reviewsCount = computed(() => {
        let totalReviews: number;

        switch (this.note.difficulty) {
            case Difficulty.Hard:
                totalReviews = 7;
                break;
            case Difficulty.Medium:
                totalReviews = 5;
                break;
            case Difficulty.Easy:
                totalReviews = 4;
                break;
            case Difficulty.None:
                totalReviews = 0;
                break;
            default:
                totalReviews = 0;
        }
        return totalReviews === 0
            ? 'Nada pendiente'
            : totalReviews - this.note.reviewsLeft + '/' + totalReviews;
    });

    public showCancelReviewsButton(): boolean {
        return this.areProgrammedReviews() && !this.note.removeAfterReviews;
    }

    public showResetReviewsButton(): boolean {
        return this.areProgrammedReviews();
    }

    public resetReviews(): void {
        this.notesService.resetReviews(this.note.id);
    }

    public cancelReviews() {
        this.notesService.cancelReviews(this.note.id);
    }

    private areProgrammedReviews(): boolean {
        return this.note.nextReviewAt !== null
            && this.note.reviewsLeft > 0
            && this.note.removedAt === null;
    }
}
