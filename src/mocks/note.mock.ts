import { Note } from '../app/dashboard/interfaces/note.interface';

export const noteMock = {
    id: 1,
    title: 'title',
    content: 'content',
    reviewedAt: '2023-00-00 00:00:00',
    nextReviewAt: '2024-00-00 00:00:00',
    reviewsLeft: 3,
    removedAt: null,
} as Note;