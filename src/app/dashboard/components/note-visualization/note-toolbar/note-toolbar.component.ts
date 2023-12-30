import { Component, inject, Input, signal } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { Note } from '../../../interfaces/note.interface';
import { NotesService } from '../../../services/notes.service';
import { NoteRemovalPromptComponent } from '../note-removal-prompt/note-removal-prompt.component';
import { ReviewOptionsComponent } from '../review-options/review-options.component';
import { ClickOutsideDirective } from '../../../../shared/directives/click-outside.directive';
import { DynamicButtonTextDirective } from '../../../../shared/directives/dynamic-button-text.directive';

@Component({
    imports: [
        NoteRemovalPromptComponent,
        ReviewOptionsComponent,
        ClickOutsideDirective,
        DynamicButtonTextDirective,
    ],
    animations: [
        trigger('popup', [
            state('void', style({ opacity: 0, transform: 'scale(0.3)' })),
            state('*', style({ opacity: 1, transform: 'scale(1)', zIndex: 1 })),
            transition('void <=> *', animate('100ms ease-in-out')),
        ]),
    ],
    selector: 'note-toolbar',
    standalone: true,
    templateUrl: './note-toolbar.component.html',
})
export class NoteToolbarComponent {
    @Input({ required: true }) public note!: Note;

    private readonly notesService = inject(NotesService);
    public isRemoveConfirmationVisible = signal(false);
    public isReviewOptionsVisible = signal(false);

    public isRestoring = signal(false);
    public isMarkingReviewed = signal(false);
    public isDeleting = signal(false);

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

    public isNoteRemoved(): boolean {
        return this.note.removedAt !== null;
    }

    public showMarkAsReviewedButton(): boolean {
        if (!this.note.nextReviewAt) return false;
        return new Date(this.note.nextReviewAt) <= new Date()
            && !this.isNoteRemoved()
            && this.note.reviewsLeft > 0
            && !this.showDeleteInsteadReview();
    }

    public showDeleteInsteadReview(): boolean {
        if (!this.note.nextReviewAt) return false;
        return new Date(this.note.nextReviewAt) <= new Date()
            && !this.isNoteRemoved()
            && this.note.reviewsLeft === 1
            && this.note.removeAfterReviews;
    }

    public remove(): void {
        this.isDeleting.set(true);
        this.notesService.remove(this.note.id).subscribe({
            complete: () => this.isDeleting.set(false),
            error: () => this.isDeleting.set(false),
        });
    }

    public markAsReviewed(): void {
        this.isMarkingReviewed.set(true);
        this.notesService.markAsReviewed(this.note.id).subscribe({
            complete: () => this.isMarkingReviewed.set(false),
            error: () => this.isMarkingReviewed.set(false),
        });
    }

    public restore(): void {
        this.isRestoring.set(true);
        this.notesService.restore(this.note.id).subscribe({
            complete: () => this.isRestoring.set(false),
            error: () => this.isRestoring.set(false),
        });
    }

    public edit(): void {
        this.notesService.updateNoteList(this.note.id, { editMode: true });
    }
}
