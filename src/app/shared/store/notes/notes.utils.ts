import { Note } from '../../../dashboard/interfaces/note.interface';

export function findNoteById(id: number, notes: Note[]): Note | undefined {
    return notes.find(note => note.id === id);
}

export function updateNoteInList(
    notes: Note[],
    id: number,
    properties: Partial<Note>,
): Note[] {
    const note = findNoteById(id, notes);
    if (!note) return notes;
    return notes.map(note =>
        note.id === id ? { ...note, ...properties } : note,
    );
}

export function removeNoteFromList(id: number, notes: Note[]): Note[] {
    return notes.filter(note => note.id !== id);
}
