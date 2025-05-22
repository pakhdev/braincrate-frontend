import { NotesState } from '../interfaces';

export const initialNotesState: NotesState = {
    notesList: [],
    isLoading: false,
    allNotesLoaded: false,
    countNotesForReview: 0,
    notesOffsetCorrection: 0,
};
