import { NotesState } from './notes-state.interface';

export const notesState: NotesState = {
    list: [],
    isLoading: false,
    allNotesLoaded: true,
    notesForReviewCounter: 0,
    notesOffsetCorrection: 0,
};
