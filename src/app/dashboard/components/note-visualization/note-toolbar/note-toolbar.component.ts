import { Component, inject, Input, signal } from '@angular/core';
import { NgIf } from '@angular/common';

import { Note } from '../../../interfaces/note.interface';
import { NotesService } from '../../../services/notes.service';
import { NoteRemovalPromptComponent } from '../note-removal-prompt/note-removal-prompt.component';
import { ReviewOptionsComponent } from '../review-options/review-options.component';
import { ClickOutsideDirective } from '../../../../shared/directives/click-outside.directive';

@Component({
    imports: [
        NgIf,
        NoteRemovalPromptComponent,
        ReviewOptionsComponent,
        ClickOutsideDirective,
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

    remove(): void {
        this.notesService.remove(this.note.id);
    }

    markAsReviewed(): void {
        this.notesService.markAsReviewed(this.note.id);
    }

    restore(): void {
        this.notesService.restore(this.note.id);
    }

    edit(): void {
        this.notesService.updateNoteList(this.note.id, { editMode: true });
    }
}
