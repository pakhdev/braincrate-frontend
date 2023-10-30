import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'note-remove-confirmation',
    templateUrl: './remove-confirmation.component.html',
})
export class RemoveConfirmationComponent {
    @Input({ required: true }) public visible!: boolean;

    @Output()
    public closeConfirmation: EventEmitter<void> = new EventEmitter<void>();

    @Output()
    public removeNote: EventEmitter<void> = new EventEmitter<void>();

    close() {
        this.closeConfirmation.emit();
    }

    remove() {
        this.removeNote.emit();
        this.closeConfirmation.emit();
    }
}
