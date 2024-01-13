import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockDirective } from 'ng-mocks';

import { DynamicButtonTextDirective } from '../../../../shared/directives/dynamic-button-text.directive';
import { NotesService } from '../../../services/notes.service';
import { ReviewOptionsComponent } from './review-options.component';
import { noteMock } from '../../../../../mocks/note.mock';
import { notesServiceMock } from '../../../../../mocks/notes.service.mock';

describe('ReviewOptionsComponent', () => {
    let component: ReviewOptionsComponent;
    let fixture: ComponentFixture<ReviewOptionsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                ReviewOptionsComponent,
            ],
            providers: [
                { provide: NotesService, useValue: notesServiceMock },
            ],
            declarations: [
                MockDirective(DynamicButtonTextDirective),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ReviewOptionsComponent);
        component = fixture.componentInstance;
        component.note = noteMock;
        component.note.removedAt = null;
        component.note.nextReviewAt = '2024-01-01 00:00:01';
        component.note.reviewsLeft = 3;
        fixture.detectChanges();
    });

    it('showCancelReviewsButton() devuelve false si la nota se eliminará después del último repaso', () => {
        component.note.removeAfterReviews = true;
        expect(component.showCancelReviewsButton()).toBeFalse();
    });

    it('showResetReviewsButton() devuelve true si se cumplen los requisitos', () => {
        expect(component.showResetReviewsButton()).toBeTrue();
    });

    it('showCancelReviewsButton() devuelve false si la nota está eliminada', () => {
        component.note.removedAt = '2021-01-01 00:00:01';
        expect(component.showResetReviewsButton()).toBeFalse();
    });

    it('showCancelReviewsButton() devuelve false si la nota no tiene repaso programado', () => {
        component.note.nextReviewAt = null;
        expect(component.showResetReviewsButton()).toBeFalse();
    });

    it('showCancelReviewsButton() devuelve false si no hay repasos pendientes', () => {
        component.note.reviewsLeft = 0;
        expect(component.showResetReviewsButton()).toBeFalse();
    });

    it('resetReviews() llama a notesService.resetReviews() con el id de la nota', () => {
        component.isResettingReviews.set(false);
        spyOn(component.isResettingReviews, 'set');

        component.resetReviews();
        expect(component.isResettingReviews.set).toHaveBeenCalledWith(true);
        expect(component.isResettingReviews.set).toHaveBeenCalledWith(false);
        expect(component.isResettingReviews.set).toHaveBeenCalledTimes(2);
        expect(notesServiceMock.resetReviews).toHaveBeenCalledWith(noteMock.id);
    });

    it('cancelReviews() llama a notesService.cancelReviews() con el id de la nota', () => {
        component.isCancelingReviews.set(false);
        spyOn(component.isCancelingReviews, 'set');

        component.cancelReviews();
        expect(component.isCancelingReviews.set).toHaveBeenCalledWith(true);
        expect(component.isCancelingReviews.set).toHaveBeenCalledWith(false);
        expect(component.isCancelingReviews.set).toHaveBeenCalledTimes(2);
        expect(notesServiceMock.cancelReviews).toHaveBeenCalledWith(noteMock.id);
    });

});