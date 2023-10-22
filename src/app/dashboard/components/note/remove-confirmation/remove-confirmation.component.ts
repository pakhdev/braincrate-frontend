import { Component, Input } from '@angular/core';

@Component({
    selector: 'note-remove-confirmation',
    templateUrl: './remove-confirmation.component.html',
})
export class RemoveConfirmationComponent {
    @Input({ required: true }) public visible!: boolean;
}
