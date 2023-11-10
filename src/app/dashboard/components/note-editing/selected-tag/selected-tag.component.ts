import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    standalone: true,
    selector: 'selected-tag',
    templateUrl: './selected-tag.component.html',
})
export class SelectedTagComponent {
    @Input({ required: true }) public tagName!: string;
    @Output() public onRemoveTag: EventEmitter<string> = new EventEmitter<string>();

    public removeTag(name: string): void {
        this.onRemoveTag.emit(name);
    }
}
