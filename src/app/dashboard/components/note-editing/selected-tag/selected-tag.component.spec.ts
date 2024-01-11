import { SelectedTagComponent } from './selected-tag.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('SelectedTagComponents', () => {
    let component: SelectedTagComponent;
    let fixture: ComponentFixture<SelectedTagComponent>;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [SelectedTagComponent],
        });
        fixture = TestBed.createComponent(SelectedTagComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('debe emitir evento onRemoveTag al hacer click en el botón', () => {
        const closeButton = fixture.nativeElement.querySelector('.note-edition__tag-remove');
        spyOn(component.onRemoveTag, 'emit');

        closeButton.click();
        fixture.detectChanges();

        expect(component.onRemoveTag.emit).toHaveBeenCalledTimes(1);
    });

    it('debe mostrar el nombre de la etiqueta', () => {
        const nameContainer = fixture.nativeElement.querySelector('.note-edition__tag-text');

        component.tagName = 'etiqueta';
        fixture.detectChanges();

        expect(nameContainer.textContent).toContain('etiqueta');
    });

});