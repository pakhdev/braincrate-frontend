import { Note } from '../../../dashboard/interfaces/note.interface';
import { patchState } from '@ngrx/signals';
import { AppState } from '../app-state.interface';
import { updateNested } from '../app.store';
import { removeNoteFromList, updateNoteInList } from './notes.utils';

export function notesMethods(store: any) {
    return {
        incrementNotesForReviewCounter: (): void => patchState(store,
            (state: AppState) => updateNested(state, 'notes', {
                notesForReviewCounter: state.notes.notesForReviewCounter + 1,
            })),
        decrementNotesForReviewCounter: (): void => patchState(store,
            (state: AppState) => updateNested(state, 'notes', {
                notesForReviewCounter: state.notes.notesForReviewCounter - 1,
            })),
        setNotesForReviewCounter: (notesForReviewCounter: number): void => patchState(store,
            (state: AppState) => updateNested(state, 'notes', { notesForReviewCounter })),
        incrementNotesOffsetCorrection: (): void => patchState(store,
            (state: AppState) => updateNested(state, 'notes', {
                notesOffsetCorrection: state.notes.notesOffsetCorrection + 1,
            })),
        decrementNotesOffsetCorrection: (): void => patchState(store,
            (state: AppState) => updateNested(state, 'notes', {
                notesOffsetCorrection: state.notes.notesOffsetCorrection - 1,
            })),
        setNotesOffsetCorrection: (notesOffsetCorrection: number): void => patchState(store,
            (state: AppState) => updateNested(state, 'notes', { notesOffsetCorrection })),
        setAllNotesLoaded: (allNotesLoaded: boolean): void => patchState(store,
            (state: AppState) => updateNested(state, 'notes', { allNotesLoaded })),
        setNotesList: (list: Note[]): void => patchState(store,
            (state: AppState) => updateNested(state, 'notes', { list })),
        setNotesLoading: (isLoading: boolean): void => patchState(store,
            (state: AppState) => updateNested(state, 'notes', { isLoading })),
        appendNotesToList: (notes: Note[]): void => patchState(store,
            (state: AppState) => updateNested(state, 'notes', {
                list: [...state.notes.list, ...notes],
            })),
        prependNoteToList: (note: Note): void => patchState(store,
            (state: AppState) => updateNested(state, 'notes', {
                list: [note, ...state.notes.list],
            })),
        removeNoteFromList: (id: number): void => patchState(store,
            (state: AppState) => updateNested(state, 'notes', { list: removeNoteFromList(id, state.notes.list) })),
        updateNote: (id: number, properties: Partial<Note>): void => patchState(store,
            (state: AppState) => updateNested(state, 'notes', {
                list: updateNoteInList(state.notes.list, id, properties),
            })),
    };
}