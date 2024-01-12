import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagInputWithSuggestionsComponent } from './tag-input-with-suggestions.component';
import { TagsService } from '../../../services/tags.service';
import { tagsServiceMock } from '../../../../../mocks/tags.service.mock';
import { Tag } from '../../../interfaces/tag.interface';

describe('TagInputWithSuggestionsComponent', () => {
    let component: TagInputWithSuggestionsComponent;
    let fixture: ComponentFixture<TagInputWithSuggestionsComponent>;
    const tagsListMock: Tag[] = [
        { id: 1, name: 'Integration', notesCount: 5 },
        { id: 2, name: 'Interface', notesCount: 7 },
        { id: 3, name: 'Implementation', notesCount: 9 },
        { id: 4, name: 'Inheritance', notesCount: 5 },
        { id: 5, name: 'Initialization', notesCount: 7 },
        { id: 6, name: 'Invocation', notesCount: 9 },
        { id: 7, name: 'Isolation', notesCount: 5 },
    ];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TagInputWithSuggestionsComponent],
            providers: [
                { provide: TagsService, useValue: tagsServiceMock },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(TagInputWithSuggestionsComponent);
        component = fixture.componentInstance;
        component['tagsList'].push(...tagsListMock);
        fixture.detectChanges();
    });

    it('suggestedTags() devuelve 5 sugerencias de etiquetas que no se encuentran en seleccionados', () => {
        component.inputText = 'i';
        const suggestedTags = component.suggestedTags;
        const resultTags = [...tagsListMock].splice(0, 5);
        expect(suggestedTags).toEqual(resultTags);
    });

    it('isSelectedSuggestion() devuelve true si el nombre de la etiqueta coincide con el nombre de la etiqueta seleccionada', () => {
        const name = tagsListMock[0].name;
        component.inputText = 'i';
        component.selectedSuggestionIdx = 0;
        const isSelectedSuggestion = component.isSelectedSuggestion(name);
        expect(isSelectedSuggestion).toBeTruthy();
    });

    it('manageKeyPress() selecciona la sugerencia anterior si se presiona la flecha hacia arriba', () => {
        component.inputText = 'i';
        component.selectedSuggestionIdx = 1;
        const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
        component.manageKeyPress(event);
        expect(component.selectedSuggestionIdx).toBe(0);
    });

    it('manageKeyPress() selecciona la sugerencia siguiente si se presiona la flecha hacia abajo', () => {
        component.inputText = 'i';
        component.selectedSuggestionIdx = 1;
        const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
        component.manageKeyPress(event);
        expect(component.selectedSuggestionIdx).toBe(2);
    });

    it('manageKeyPress() llama onEnter()', () => {
        const event = new KeyboardEvent('keydown', { key: 'Enter' });
        spyOn(component, 'onEnter');
        component.manageKeyPress(event);
        expect(component.onEnter).toHaveBeenCalled();
    });

    it('onEnter() emite el evento onInsertTag con el valor de una sugerencia', () => {
        spyOn(component.onInsertTag, 'emit');
        component.inputText = 'i';
        component.selectedSuggestionIdx = 1;
        component.onEnter();
        expect(component.onInsertTag.emit).toHaveBeenCalledWith(tagsListMock[1].name);
    });

    it('onEnter() emite el evento onInsertTag con el valor del input', () => {
        spyOn(component.onInsertTag, 'emit');
        component.selectedSuggestionIdx = -1;
        component.inputText = 'ejemplo';
        component.onEnter();
        expect(component.onInsertTag.emit).toHaveBeenCalledWith('ejemplo');
    });

    it('onEnter() no emite el evento onInsertTag si el valor del input contiene menos de 2 caractéres', () => {
        spyOn(component.onInsertTag, 'emit');
        component.selectedSuggestionIdx = -1;
        component.inputText = 'e';
        component.onEnter();
        expect(component.onInsertTag.emit).not.toHaveBeenCalled();
    });

    it('selectSuggestion() emite el evento onInsertTag con el valor de la sugerencia', () => {
        spyOn(component.onInsertTag, 'emit');
        component.selectSuggestion(tagsListMock[0].name);
        expect(component.onInsertTag.emit).toHaveBeenCalledWith(tagsListMock[0].name);
    });
});