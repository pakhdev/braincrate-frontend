import { Component, computed, inject, Signal } from '@angular/core';
import { NgClass } from '@angular/common';

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
import { AppStore } from '../../../shared/store/app.store';

@Component({
    selector: 'dashboard-all-notes-page',
    templateUrl: './all-notes-page.component.html',
    imports: [
        NgClass,
        InfiniteScrollTriggerComponent,
        NoResultsMessageComponent,
        WelcomeMessageComponent,
        ViewNoteComponent,
        EditNoteComponent,
    ],
})
export class AllNotesPageComponent {
    private readonly appStore = inject(AppStore);
    public readonly notes: Signal<Note[]> = computed(() => this.appStore.notes.list());
    public readonly showWelcomeMessage: Signal<boolean> = computed(() => this.appStore.showWelcomeMessage());
    public readonly showEmptySearchResult: Signal<boolean> = computed(() => this.appStore.showEmptySearchResult());
}
