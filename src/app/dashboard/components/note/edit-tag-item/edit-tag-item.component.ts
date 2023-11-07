import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'edit-tag-item',
    templateUrl: './edit-tag-item.component.html',
})
export class EditTagItemComponent {
    @Input({ required: true }) public tagName!: string;
    @Output() public onRemoveTag: EventEmitter<string> = new EventEmitter<string>();

    public removeTag(name: string): void {
        this.onRemoveTag.emit(name);
    }
}
