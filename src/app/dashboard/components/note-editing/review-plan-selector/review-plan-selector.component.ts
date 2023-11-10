import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ReviewPlan } from '../../../interfaces/review-plan.interface';
import { Difficulty } from '../../../enums/difficulty.enum';

@Component({
    standalone: true,
    selector: 'review-plan-selector',
    templateUrl: './review-plan-selector.component.html',
    imports: [
        NgIf,
        NgClass,
        NgForOf,
        FormsModule,
    ],
})
export class ReviewPlanSelectorComponent {

    @Input({ required: true }) public selectedDifficulty!: Difficulty;
    @Input({ required: true }) public removeAfterReviews!: boolean;
    @Output() public onDifficultyChange: EventEmitter<Difficulty> = new EventEmitter<Difficulty>();
    @Output() public onRemoveAfterReviewsChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    public reviewPlans: ReviewPlan[] = [
        { name: 'Repaso básico', difficulty: Difficulty.Easy, intervals: [1, 4, 7, 21] },
        { name: 'Repaso estándar', difficulty: Difficulty.Medium, intervals: [1, 3, 7, 21, 60] },
        { name: 'Repaso intensivo', difficulty: Difficulty.Hard, intervals: [1, 3, 7, 21, 60, 90, 182] },
        { name: 'No repasar', difficulty: Difficulty.None, intervals: [] },
    ];

    public isPopupVisible: boolean = false;

    get selectedPlanName(): string {
        return this.reviewPlans.find(plan => plan.difficulty === this.selectedDifficulty)?.name || '';
    }

    public togglePopup(): void {
        this.isPopupVisible = !this.isPopupVisible;
    }

    public isDifficultySelected(difficulty: Difficulty): boolean {
        return this.selectedDifficulty === difficulty;
    }

    public setDifficulty(difficulty: Difficulty): void {
        this.selectedDifficulty = difficulty;
        this.onDifficultyChange.emit(difficulty);
        this.togglePopup();
    }

    changeRemoveAfterReviews(event: boolean): void {
        this.onRemoveAfterReviewsChange.emit(event);
    }
}
