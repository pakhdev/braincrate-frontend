import { Note } from '../../../dashboard/interfaces/note.interface';

export interface NotesState {
    list: Note[];
    isLoading: boolean;
    allNotesLoaded: boolean;
    notesForReviewCounter: number;
    notesOffsetCorrection: number;
}
