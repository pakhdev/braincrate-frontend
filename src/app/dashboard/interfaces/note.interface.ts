import { Tag } from './tag.interface';

export interface Note {
    id: number;
    title: string;
    content: string;
    difficulty: number;
    reviewsLeft: number;
    nextReviewAt: string | null;
    reviewedAt: string | null;
    removeAfterReviews: boolean;
    createdAt: string | null;
    updatedAt: string | null;
    removedAt: string | null;
    tags: Tag[];
    editMode?: boolean;
}