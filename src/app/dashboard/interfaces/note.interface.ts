import { Tag } from './tag.interface';

export interface Note {
    id: number;
    title: string;
    content: string;
    difficulty: number;
    reviewsLeft: number;
    nextReviewAt: string | null;
    reviewedAt: string | null;
    createdAt: string | null;
    tags: Tag[];
}