import { Component, inject } from '@angular/core';
import { NgClass, NgForOf, NgIf } from '@angular/common';

import { NotesService } from '../../services/notes.service';
import { DashboardStateService } from '../../services/dashboard-state.service';
import {
    InfiniteScrollTriggerComponent,
} from '../../components/note-visualization/infinite-scroll-trigger/infinite-scroll-trigger.component';
import {
    NoResultsMessageComponent,
} from '../../components/note-visualization/no-results-message/no-results-message.component';
import { WelcomeMessageComponent } from '../../components/note-visualization/welcome-message/welcome-message.component';
import { ViewNoteComponent } from '../../components/note-visualization/view-note/view-note.component';
import { EditNoteComponent } from '../../components/note-editing/edit-note/edit-note.component';
import { Note } from '../../interfaces/note.interface';

@Component({
    standalone: true,
    selector: 'dashboard-all-notes-page',
    templateUrl: './all-notes-page.component.html',
    imports: [
        NgForOf,
        NgIf,
        NgClass,
        InfiniteScrollTriggerComponent,
        NoResultsMessageComponent,
        WelcomeMessageComponent,
        ViewNoteComponent,
        EditNoteComponent,
    ],
})
export class AllNotesPageComponent {

    private readonly dashboardStateService = inject(DashboardStateService);
    private readonly notesService = inject(NotesService);

    get notes(): Note[] {
        return this.notesService.notesList();
    }

    public showWelcomeMessage(): boolean {
        return !this.dashboardStateService.dashboardState().searchWord
            && !this.notesService.isLoading()
            && this.notesService.notesList().length === 0;
    }

    public showEmptySearchResult(): boolean {
        return this.dashboardStateService.dashboardState().searchWord.length !== 0
            && !this.notesService.isLoading()
            && this.notesService.notesList().length === 0;
    }

}
