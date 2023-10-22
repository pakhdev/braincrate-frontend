import { Component, Input, signal } from '@angular/core';
import { Note } from '../../../interfaces/note.interface';

@Component({
    selector: 'dashboard-view-note',
    templateUrl: './view-note.component.html',
})
export class ViewNoteComponent {

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
}
