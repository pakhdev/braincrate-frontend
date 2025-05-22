import { Note } from '../../../dashboard/interfaces/note.interface';

export interface NotesState {
    notesList: Note[];
    isLoading: boolean;
    allNotesLoaded: boolean;
    countNotesForReview: number;
    notesOffsetCorrection: number;
}
