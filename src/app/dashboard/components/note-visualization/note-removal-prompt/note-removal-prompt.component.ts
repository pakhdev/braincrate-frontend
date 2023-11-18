import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
    standalone: true,
    selector: 'note-removal-prompt',
    templateUrl: './note-removal-prompt.component.html',
    imports: [
        NgIf,
    ],
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
