import { Difficulty } from '../enums/difficulty.enum';

export interface NoteManipulationBody {
    title: string,
    tags: string[],
    content: string,
    difficulty: Difficulty,
    removeAfterReviews: boolean,
}