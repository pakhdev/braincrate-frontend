import { Component, Input, signal } from '@angular/core';

import { Note } from '../../../interfaces/note.interface';

@Component({
    selector: 'dashboard-view-note',
    templateUrl: './view-note.component.html',
})
export class ViewNoteComponent {

    @Input({ required: true }) public note!: Note;

    public get tags(): string {
        return this.note.tags.map(tag => tag.name).join(', ');
    }

}
