import { NoteRemovalPromptComponent } from './note-removal-prompt.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('NoteRemovalPromptComponent', () => {
    let component: NoteRemovalPromptComponent;
    let fixture: ComponentFixture<NoteRemovalPromptComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NoteRemovalPromptComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(NoteRemovalPromptComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('close() emite closeConfirmation()', () => {
        spyOn(component.closeConfirmation, 'emit');
        component.close();
        expect(component.closeConfirmation.emit).toHaveBeenCalled();
    });

    it('remove() emite removeNote() y closeConfirmation()', () => {
        spyOn(component.removeNote, 'emit');
        spyOn(component.closeConfirmation, 'emit');

        component.remove();

        expect(component.removeNote.emit).toHaveBeenCalled();
        expect(component.closeConfirmation.emit).toHaveBeenCalled();
    });

    it('al hacer click "Eliminar" se llama el método remove()', () => {
        spyOn(component, 'remove');
        const button = fixture.debugElement.nativeElement.querySelector('.button-danger');
        button.click();
        expect(component.remove).toHaveBeenCalled();
    });

    it('al hacer click "No eliminar" se llama el método close()', () => {
        spyOn(component, 'close');
        const button = fixture.debugElement.nativeElement.querySelector('.button-success');
        button.click();
        expect(component.close).toHaveBeenCalled();
    });
});