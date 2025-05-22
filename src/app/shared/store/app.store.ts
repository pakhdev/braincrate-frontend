import { signalStore, withState } from '@ngrx/signals';
import { AppState } from './interfaces';
import { initialDashboardState, initialNotesState, initialTagsState } from './initial';

export const AppStore = signalStore(
    { providedIn: 'root' },
    withState<AppState>({ dashboard: initialDashboardState, notes: initialNotesState, tags: initialTagsState }),
);