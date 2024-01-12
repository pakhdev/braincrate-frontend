import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent, MockDirective } from 'ng-mocks';
import { Router } from '@angular/router';

import { ContenteditableEditor } from '../../../../shared/directives/contenteditable-editor.directive';
import { DashboardStateService } from '../../../services/dashboard-state.service';
import { DynamicButtonTextDirective } from '../../../../shared/directives/dynamic-button-text.directive';
import { EditNoteComponent } from './edit-note.component';
import { NotesService } from '../../../services/notes.service';
import { ReviewPlanSelectorComponent } from '../review-plan-selector/review-plan-selector.component';
import { SelectedTagComponent } from '../selected-tag/selected-tag.component';
import { TagInputWithSuggestionsComponent } from '../tag-input-with-suggestions/tag-input-with-suggestions.component';
import { TagsService } from '../../../services/tags.service';
import { dashboardStateServiceMock } from '../../../../../mocks/dashboard-state.service.mock';
import { routerMock } from '../../../../../mocks/router.mock';
import { tagsServiceMock } from '../../../../../mocks/tags.service.mock';
import { Difficulty } from '../../../enums/difficulty.enum';
import { notesServiceMock } from '../../../../../mocks/notes.service.mock';

describe('EditNoteComponent', () => {
    let component: EditNoteComponent;
    let fixture: ComponentFixture<EditNoteComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                EditNoteComponent,
                MockComponent(SelectedTagComponent),
                MockComponent(TagInputWithSuggestionsComponent),
                MockComponent(ReviewPlanSelectorComponent),
            ],
            providers: [
                { provide: DashboardStateService, useValue: dashboardStateServiceMock },
                { provide: NotesService, useValue: notesServiceMock },
                { provide: Router, useValue: routerMock },
                { provide: TagsService, useValue: tagsServiceMock },
            ],
            declarations: [
                MockDirective(ContenteditableEditor),
                MockDirective(DynamicButtonTextDirective),
            ],
        });
        fixture = TestBed.createComponent(EditNoteComponent);

        component = fixture.componentInstance;
        component.title = 'Título';
        component.content = 'Contenido';
        component.difficulty = Difficulty.Easy;
        component.tagNames = ['Etiqueta1'];
        component.removeAfterReviews = false;

        notesServiceMock.createNoteQuery.calls.reset();
        notesServiceMock.updateNoteQuery.calls.reset();
        notesServiceMock.prependNoteToList.calls.reset();
        notesServiceMock.updateNoteList.calls.reset();

        fixture.detectChanges();
    });

    it('insertTag() debe añadir una etiqueta en el estado', () => {
        const tagName = 'Etiqueta';
        component.insertTag(tagName);
        expect(component.tagNames).toContain(tagName);
    });

    it('removeTag() debe eliminar una etiqueta del estado', () => {
        const tagName = 'Etiqueta';
        component.tagNames = [tagName];
        expect(component.tagNames).toContain(tagName);
        component.removeTag(tagName);
        expect(component.tagNames).not.toContain(tagName);
    });

    it('changeRemoveAfterReviews() debe cambiar el valor de removeAfterReviews en el estado', () => {
        component.removeAfterReviews = false;
        component.changeRemoveAfterReviews(true);
        expect(component.removeAfterReviews).toBe(true);
    });

    it('changeDifficulty() debe cambiar la dificultad en el estado', () => {
        const difficulty = Difficulty.Easy;
        component.changeDifficulty(difficulty);
        expect(component.difficulty).toBe(difficulty);
    });

    it('saveNote() debe llamar todos los métodos correspondientes para crea una nota', () => {
        spyOn(component.isLoading, 'set');
        component['isNewNote'] = true;

        component.saveNote();

        expect(notesServiceMock.createNoteQuery).toHaveBeenCalledWith({
            title: component.title,
            content: component.content,
            difficulty: component.difficulty,
            removeAfterReviews: component.removeAfterReviews,
            tags: component.tagNames,
        });
        expect(notesServiceMock.prependNoteToList).toHaveBeenCalled();
        expect(tagsServiceMock.updateTags).toHaveBeenCalled();
        expect(component.isLoading.set).toHaveBeenCalledWith(true);
        expect(component.isLoading.set).toHaveBeenCalledWith(false);
        expect(component.isLoading.set).toHaveBeenCalledTimes(2);
    });

    it('saveNote() redirecciona a "Todas las Notas" tras la creación', () => {
        component['dashboardState'].notesType = 'for-review';
        component['isNewNote'] = true;
        fixture.detectChanges();

        component.saveNote();

        expect(routerMock.navigate).toHaveBeenCalledWith(['dashboard', 'all']);
    });

    it('saveNote() redirecciona a "Todas las Notas" y guarda el estado tras la creación si no está en "for-review"', () => {
        component['dashboardState'].notesType = 'all';
        component['isNewNote'] = true;
        fixture.detectChanges();

        component.saveNote();
        expect(routerMock.navigate).toHaveBeenCalledWith(['dashboard', 'all'], { queryParams: { preserveState: 'true' } });
    });

    it('saveNote() debe llamar todos los métodos correspondientes para actualizar una nota', () => {
        spyOn(component.isLoading, 'set');
        component['id'] = 5;
        component['isNewNote'] = false;

        component.saveNote();

        expect(notesServiceMock.updateNoteQuery).toHaveBeenCalledWith(5, null, {
            title: component.title,
            content: component.content,
            difficulty: component.difficulty,
            removeAfterReviews: component.removeAfterReviews,
            tags: component.tagNames,
        });
        expect(notesServiceMock.updateNoteList).toHaveBeenCalled();
        expect(tagsServiceMock.updateTags).toHaveBeenCalled();
        expect(component.isLoading.set).toHaveBeenCalledWith(true);
        expect(component.isLoading.set).toHaveBeenCalledWith(false);
        expect(component.isLoading.set).toHaveBeenCalledTimes(2);
    });

    it('saveNote() no debe llamar a ningún método si el titulo tiene menos de 2 caractéres', () => {
        component['isNewNote'] = true;
        component.title = 'T';

        component.saveNote();

        expect(notesServiceMock.createNoteQuery).not.toHaveBeenCalled();
        expect(notesServiceMock.updateNoteQuery).not.toHaveBeenCalled();
    });

    it('saveNote() no debe llamar a ningún método si existe menos de 1 etiqueta', () => {
        component['isNewNote'] = true;
        component.tagNames = [];

        component.saveNote();

        expect(notesServiceMock.createNoteQuery).not.toHaveBeenCalled();
        expect(notesServiceMock.updateNoteQuery).not.toHaveBeenCalled();
    });

    it('saveNote() no debe llamar a ningún método si existe más de 13 etiquetas', () => {
        component['isNewNote'] = true;
        component.tagNames = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14'];

        component.saveNote();

        expect(notesServiceMock.createNoteQuery).not.toHaveBeenCalled();
        expect(notesServiceMock.updateNoteQuery).not.toHaveBeenCalled();
    });

    it('saveNote() no debe llamar a ningún método si el contenido tiene menos de 5 caractéres', () => {
        component['isNewNote'] = true;
        component.content = '1234';

        component.saveNote();

        expect(notesServiceMock.createNoteQuery).not.toHaveBeenCalled();
        expect(notesServiceMock.updateNoteQuery).not.toHaveBeenCalled();
    });

    it('saveNote() no debe llamar a ningún método si isLoading() es true', () => {
        component['isNewNote'] = true;
        component.isLoading.set(true);

        component.saveNote();

        expect(notesServiceMock.createNoteQuery).not.toHaveBeenCalled();
        expect(notesServiceMock.updateNoteQuery).not.toHaveBeenCalled();
    });

});