import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

import { Note } from '../../../interfaces/note.interface';
import { NoteToolbarComponent } from '../note-toolbar/note-toolbar.component';
import { ReviewOptionsComponent } from '../review-options/review-options.component';

@Component({
    standalone: true,
    selector: 'view-note',
    templateUrl: './view-note.component.html',
    imports: [
        NgClass,
        NoteToolbarComponent,
        ReviewOptionsComponent,
    ],
})
export class ViewNoteComponent {

    @Input({ required: true }) public note!: Note;

    public get tags(): string {
        return this.note.tags.map(tag => tag.name).join(', ');
    }

}
