import { Component, Input, signal } from '@angular/core';
import { Note } from '../../../interfaces/note.interface';

@Component({
    selector: 'note-view-toolbar',
    templateUrl: './view-toolbar.component.html',
})
export class ViewToolbarComponent {
    @Input({ required: true }) public note!: Note;

    public isRemoveConfirmationVisible = signal(false);
    public isReviewOptionsVisible = signal(false);

    public get tags(): string {
        return this.note.tags.map(tag => tag.name).join(', ');
    }

    public toggleRemoveConfirmation(): void {
        this.isRemoveConfirmationVisible.set(!this.isRemoveConfirmationVisible());
        this.isReviewOptionsVisible.set(false);
    }

    public toggleReviewOptions(): void {
        this.isReviewOptionsVisible.set(!this.isReviewOptionsVisible());
        this.isRemoveConfirmationVisible.set(false);
    }

    public showMarkAsReviewedButton(): boolean {
        if (!this.note.nextReviewAt) return false;
        return new Date(this.note.nextReviewAt) <= new Date()
            && this.note.reviewsLeft > 0
            && this.note.removedAt === null
            && !this.showDeleteInsteadReview();
    }

    public showDeleteInsteadReview(): boolean {
        if (!this.note.nextReviewAt) return false;
        return new Date(this.note.nextReviewAt) <= new Date()
            && this.note.reviewsLeft === 1
            && this.note.removedAt === null
            && this.note.removeAfterReviews;
    }

    remove() {
        console.log('remove');
    }

    markAsReviewed() {
        console.log('markAsReviewed');
    }
}
