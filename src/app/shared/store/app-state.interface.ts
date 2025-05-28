import { DashboardState } from './dashboard/dashboard-state.interface';
import { NotesState } from './notes/notes-state.interface';
import { TagsState } from './tags/tags-state.interface';
import { AuthState } from './auth/auth-state.interface';

export interface AppState {
    auth: AuthState;
    dashboard: DashboardState;
    notes: NotesState;
    tags: TagsState;
}
