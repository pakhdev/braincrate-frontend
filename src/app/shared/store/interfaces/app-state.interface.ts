import { DashboardState } from './dashboard-state.interface';
import { NotesState } from './notes-state.interface';
import { TagsState } from './tags-state.interface';

export interface AppState {
    dashboard: DashboardState;
    notes: NotesState;
    tags: TagsState;
}