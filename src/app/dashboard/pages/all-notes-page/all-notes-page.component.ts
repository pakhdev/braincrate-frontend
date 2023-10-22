import { Component, inject } from '@angular/core';
import { NotesService } from '../../services/notes.service';

@Component({
    selector: 'dashboard-all-notes-page',
    templateUrl: './all-notes-page.component.html',
})
export class AllNotesPageComponent {

    public notesService = inject(NotesService);
}
