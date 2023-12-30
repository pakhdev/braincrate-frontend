import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    standalone: true,
    selector: 'note-removal-prompt',
    templateUrl: './note-removal-prompt.component.html',
})
export class NoteRemovalPromptComponent {
    @Output()
    public closeConfirmation: EventEmitter<void> = new EventEmitter<void>();

    @Output()
    public removeNote: EventEmitter<void> = new EventEmitter<void>();

    close(): void {
        this.closeConfirmation.emit();
    }

    remove(): void {
        this.removeNote.emit();
        this.closeConfirmation.emit();
    }
}
