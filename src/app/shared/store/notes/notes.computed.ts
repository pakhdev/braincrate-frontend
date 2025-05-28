import { computed } from '@angular/core';
import { StateSignals } from '@ngrx/signals';
import { AppState } from '../app-state.interface';

export function notesComputed(store: StateSignals<AppState>) {
    return {
        showWelcomeMessage: computed((): boolean => {
            return !store.dashboard.searchNotesTerm()
                && !store.notes.isLoading()
                && store.notes.list().length === 0;
        }),
        showEmptySearchResult: computed((): boolean => {
            return store.dashboard.searchNotesTerm().length !== 0
                && !store.notes.isLoading()
                && store.notes.list().length === 0;
        }),
    };
}