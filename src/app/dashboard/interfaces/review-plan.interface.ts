import { Difficulty } from '../enums/difficulty.enum';

export interface ReviewPlan {
    name: string;
    difficulty: Difficulty;
    intervals: number[];
}