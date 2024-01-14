import { ReviewPlanSelectorComponent } from './review-plan-selector.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Difficulty } from '../../../enums/difficulty.enum';
import { MockDirective } from 'ng-mocks';
import { ClickOutsideDirective } from '../../../../shared/directives/click-outside.directive';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ReviewPlanSelectorComponent', () => {
    let component: ReviewPlanSelectorComponent;
    let fixture: ComponentFixture<ReviewPlanSelectorComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                ReviewPlanSelectorComponent,
                NoopAnimationsModule,
            ],
            declarations: [
                MockDirective(ClickOutsideDirective),
            ],
        });
        fixture = TestBed.createComponent(ReviewPlanSelectorComponent);
        component = fixture.componentInstance;
        component.isPopupVisible.set(true);
        fixture.detectChanges();
    });

    it('selectedPlanName() debe devolver el nombre del plan seleccionado', () => {
        for (const plan of component.reviewPlans) {
            component.selectedDifficulty = plan.difficulty;
            expect(component.selectedPlanName).toBe(plan.name);
        }
    });

    it('togglePopup() debe cambiar el estado al contrario', () => {
        component.isPopupVisible.set(true);
        component.togglePopup();
        expect(component.isPopupVisible()).toBe(false);
        component.togglePopup();
        expect(component.isPopupVisible()).toBe(true);
    });

    it('isDifficultySelected() debe devolver true si la dificultad es la seleccionada', () => {
        component.selectedDifficulty = Difficulty.Easy;
        expect(component.isDifficultySelected(Difficulty.Easy)).toBeTruthy();
        expect(component.isDifficultySelected(Difficulty.Hard)).toBeFalsy();
    });

    it('setDifficulty() debe cambiar la dificultad seleccionada', () => {
        component.setDifficulty(Difficulty.Hard);
        expect(component.selectedDifficulty).toBe(Difficulty.Hard);
    });

    it('al hacer click sobre una dificultad se debe llamar setDifficulty() con parámetros correctos', () => {
        const optionRows = fixture.nativeElement.querySelectorAll('.review-settings__option-row');
        expect(optionRows.length).toBe(component.reviewPlans.length);

        spyOn(component, 'setDifficulty');
        for (let index = 0; index < optionRows.length; index++) {
            const row = optionRows[index];
            row.click();
            fixture.detectChanges();
            expect(component.setDifficulty).toHaveBeenCalledWith(component.reviewPlans[index].difficulty);
        }
    });

    it('al hacer click sobre toggle-checkbox se debe llamar changeRemoveAfterReviews()', () => {
        spyOn(component, 'changeRemoveAfterReviews');
        const toggleCheckbox = fixture.nativeElement.querySelector('.toggle-checkbox');
        toggleCheckbox.click();
        fixture.detectChanges();
        expect(component.changeRemoveAfterReviews).toHaveBeenCalled();
    });

});