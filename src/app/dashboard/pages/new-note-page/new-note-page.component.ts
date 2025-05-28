import { Component } from '@angular/core';

import { EditNoteComponent } from '../../components/note-editing/edit-note/edit-note.component';

@Component({
    selector: 'dashboard-new-note-page',
    templateUrl: './new-note-page.component.html',
    imports: [EditNoteComponent],
})
export class NewNotePageComponent {

}
