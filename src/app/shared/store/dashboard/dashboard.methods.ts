import { patchState } from '@ngrx/signals';
import { AppState } from '../app-state.interface';
import { updateNested } from '../app.store';

export function dashboardMethods(store: any) {
    return {
        resetDashboard(): void {
            patchState(store, (state: AppState) => updateNested(state, 'dashboard', {
                selectedTags: [],
                searchNotesTerm: '',
                searchTagsTerm: '',
                notesType: '',
                page: 0,
                preserveState: false,
            }));
        },
        resetSelectedTags(): void {
            patchState(store, (state: AppState) => updateNested(state, 'dashboard', { selectedTags: [] }));
        },
        resetSearchTagsTerm: (): void => {
            patchState(store, (state: AppState) => updateNested(state, 'dashboard', { searchTagsTerm: '' }));
        },
        setNotesType(notesType: 'all' | 'for-review'): void {
            patchState(store, (state: AppState) => updateNested(state, 'dashboard', { notesType }));
        },
        setPreserveState(preserveState: boolean): void {
            patchState(store, (state: AppState) => updateNested(state, 'dashboard', { preserveState }));
        },
        setSearchTagsTerm(searchTagsTerm: string): void {
            patchState(store, (state: AppState) => updateNested(state, 'dashboard', { searchTagsTerm }));
        },
        setSearchNotesTerm(searchNotesTerm: string): void {
            patchState(store, (state: AppState) => updateNested(state, 'dashboard', { searchNotesTerm }));
        },
        setPage(page: number): void {
            patchState(store, (state: AppState) => updateNested(state, 'dashboard', { page }));
        },
        nextPage(): void {
            patchState(store, (state: AppState) => updateNested(state, 'dashboard', { page: state.dashboard.page + 1 }));
        },
        selectTag(tagId: number): void {
            if (store.dashboard.selectedTags().includes(tagId)) return;
            patchState(store, (state: AppState) => updateNested(state,
                'dashboard', { selectedTags: [...state.dashboard.selectedTags, tagId] }));
        },
        unselectTag(tagId: number): void {
            patchState(store, (state: AppState) => updateNested(state,
                'dashboard', { selectedTags: state.dashboard.selectedTags.filter(id => id !== tagId) },
            ));
        },
    };
}