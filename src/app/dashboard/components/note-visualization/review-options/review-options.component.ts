import { Component, computed, inject, Input, Signal, signal, WritableSignal } from '@angular/core';
import { DatePipe } from '@angular/common';

import { NotesService } from '../../../services/notes.service';
import { Note } from '../../../interfaces/note.interface';
import { Difficulty } from '../../../enums/difficulty.enum';
import { DynamicButtonTextDirective } from '../../../../shared/directives/dynamic-button-text.directive';

@Component({
    selector: 'review-options',
    templateUrl: './review-options.component.html',
    imports: [
        DatePipe,
        DynamicButtonTextDirective,
    ],
})
export class ReviewOptionsComponent {
    private readonly notesService = inject(NotesService);
    @Input({ required: true }) public note!: Note;
    public readonly isResettingReviews: WritableSignal<boolean> = signal(false);
    public readonly isCancelingReviews: WritableSignal<boolean> = signal(false);
    public readonly showCancelReviewsButton: Signal<boolean> = computed(() => this.hasProgrammedReviews() && !this.note.removeAfterReviews);
    public readonly showResetReviewsButton: Signal<boolean> = computed(() => this.hasProgrammedReviews());
    public readonly reviewsCount: Signal<string> = computed(() => {
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
    private readonly hasProgrammedReviews: Signal<boolean> = computed(() => {
        return this.note.nextReviewAt !== null
            && this.note.reviewsLeft > 0
            && this.note.removedAt === null;
    });

    public resetReviews(): void {
        if (this.isResettingReviews()) return;
        this.isResettingReviews.set(true);
        this.notesService.resetReviews(this.note.id).subscribe({
            complete: () => this.isResettingReviews.set(false),
            error: () => this.isResettingReviews.set(false),
        });
    }

    public cancelReviews() {
        if (this.isCancelingReviews()) return;
        this.isCancelingReviews.set(true);
        this.notesService.cancelReviews(this.note.id).subscribe({
            complete: () => this.isCancelingReviews.set(false),
            error: () => this.isCancelingReviews.set(false),
        });
    }
}
