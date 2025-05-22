import { Component } from '@angular/core';

import { SearchNotesComponent } from '../search-notes/search-notes.component';
import { SearchAndPickTagsComponent } from '../search-and-pick-tags/search-and-pick-tags.component';

@Component({
    selector: 'notes-management',
    templateUrl: './notes-management.component.html',
    imports: [
        SearchNotesComponent,
        SearchAndPickTagsComponent,
    ]
})
export class NotesManagementComponent {

}
