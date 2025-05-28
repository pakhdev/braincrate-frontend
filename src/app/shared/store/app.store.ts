import { signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { AppState } from './app-state.interface';
import { authState } from './auth/auth.state';
import { dashboardState } from './dashboard/dashboard.state';
import { tagsComputed, tagsMethods, tagsState } from './tags';
import { dashboardMethods } from './dashboard/dashboard.methods';
import { withEffects } from '@ngrx/signals/events';
import { effect } from '@angular/core';
import { notesComputed, notesMethods, notesState } from './notes';

export const AppStore = signalStore(
    { providedIn: 'root' },
    withState<AppState>({
        auth: authState,
        dashboard: dashboardState,
        notes: notesState,
        tags: tagsState,
    }),
    withComputed(tagsComputed),
    withMethods(tagsMethods),
    withMethods(dashboardMethods),
    withComputed(notesComputed),
    withMethods(notesMethods),
    withEffects((store) => {
        effect(() => { // on tag selection update
            store.dashboard.selectedTags();
            store.setPage(1);
            store.setSearchTagsTerm('');
        });
        effect(() => { // on note search
            store.dashboard.searchNotesTerm();
            store.resetSelectedTags();
        });
        effect(() => { // on note type update
            store.dashboard.notesType();
            store.setSearchNotesTerm('');
            store.resetSearchTagsTerm();
        });
        return {};
    }),
);

export function updateNested<T, K extends keyof T>(
    obj: T,
    key: K,
    changes: Partial<T[K]>,
): T {
    return {
        ...obj,
        [key]: {
            ...obj[key],
            ...changes,
        },
    };
}
