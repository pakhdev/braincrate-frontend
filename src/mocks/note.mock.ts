import { Note } from '../app/dashboard/interfaces/note.interface';
import { Difficulty } from '../app/dashboard/enums/difficulty.enum';

export const noteMock = {
    id: 1,
    title: 'title',
    content: 'content',
    difficulty: Difficulty.Easy,
    reviewedAt: '2023-01-01 00:00:01',
    nextReviewAt: '2024-01-01 00:00:01',
    reviewsLeft: 3,
    removedAt: null,
} as Note;