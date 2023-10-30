import { Note } from './note.interface';
import { Tag } from './tag.interface';

export interface NoteUpdateResponse {
    errors: string | null;
    note: Note | null;
    tags: Tag[] | null;
}