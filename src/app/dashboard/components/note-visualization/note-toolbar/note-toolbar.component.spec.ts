import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { NoteToolbarComponent } from './note-toolbar.component';
import { NotesService } from '../../../services/notes.service';
import { createNoteMock } from '../../../../../mocks/note.mock';
import { createNotesServiceMock } from '../../../../../mocks/notes.service.mock';

describe('NoteToolbarComponent', () => {
    let component: NoteToolbarComponent;
    let fixture: ComponentFixture<NoteToolbarComponent>;
    const noteMock = createNoteMock();
    const notesServiceMock = createNotesServiceMock();

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                NoteToolbarComponent,
                NoopAnimationsModule,
            ],
            providers: [
                { provide: NotesService, useValue: { ...notesServiceMock } },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(NoteToolbarComponent);
        component = fixture.componentInstance;
        component.note = { ...noteMock };
        fixture.detectChanges();
    });

    it('tags() debe devolver solo los nombres de las etiquetas separador por coma', () => {
        component.note.tags = [
            { id: 1, name: 'tag1', notesCount: 1 },
            { id: 2, name: 'tag2', notesCount: 1 },
        ];
        expect(component.tags).toBe('tag1, tag2');
    });

    it('toggleRemoveConfirmation() debe cambiar el estado y ocultar el menú de opciones de repaso', () => {
        component.isRemoveConfirmationVisible.set(false);
        spyOn(component.isRemoveConfirmationVisible, 'set');
        spyOn(component.isReviewOptionsVisible, 'set');
        component.toggleRemoveConfirmation();
        expect(component.isRemoveConfirmationVisible.set).toHaveBeenCalledWith(true);
        expect(component.isReviewOptionsVisible.set).toHaveBeenCalledWith(false);
    });

    it('toggleReviewOptions() debe cambiar el estado y ocultar el menú de confirmación de eliminación', () => {
        component.isReviewOptionsVisible.set(false);
        spyOn(component.isReviewOptionsVisible, 'set');
        spyOn(component.isRemoveConfirmationVisible, 'set');
        component.toggleReviewOptions();
        expect(component.isReviewOptionsVisible.set).toHaveBeenCalledWith(true);
        expect(component.isRemoveConfirmationVisible.set).toHaveBeenCalledWith(false);
    });

    it('isNoteRemoved() debe devolver true si la nota está eliminada', () => {
        component.note.removedAt = '2023-01-01 00:00:01';
        expect(component.isNoteRemoved()).toBe(true);
    });

    it('showMarkAsReviewedButton() debe devolver true si se cumplen todas las condiciones', () => {
        spyOn(component, 'isNoteRemoved').and.returnValue(false);
        component.note.nextReviewAt = '2023-01-01 00:00:01';
        component.note.reviewsLeft = 1;
        expect(component.showMarkAsReviewedButton()).toBe(true);
    });

    it('showMarkAsReviewedButton() debe devolver false si la nota está eliminada', () => {
        spyOn(component, 'isNoteRemoved').and.returnValue(true);
        component.note.nextReviewAt = '2023-01-01 00:00:01';
        component.note.reviewsLeft = 1;
        expect(component.showMarkAsReviewedButton()).toBe(false);
    });

    it('showMarkAsReviewedButton() debe devolver false si la fecha del siguiente repaso es superior a la actual', () => {
        spyOn(component, 'isNoteRemoved').and.returnValue(false);
        component.note.nextReviewAt = '2033-01-01 00:00:01';
        component.note.reviewsLeft = 1;
        expect(component.showMarkAsReviewedButton()).toBe(false);
    });

    it('showMarkAsReviewedButton() debe devolver false si no quedan repasos', () => {
        spyOn(component, 'isNoteRemoved').and.returnValue(false);
        component.note.nextReviewAt = '2023-01-01 00:00:01';
        component.note.reviewsLeft = 0;
        expect(component.showMarkAsReviewedButton()).toBe(false);
    });

    it('showDeleteInsteadReview() debe devolver true si se cumplen todas las condiciones', () => {
        spyOn(component, 'isNoteRemoved').and.returnValue(false);
        component.note.nextReviewAt = '2023-01-01 00:00:01';
        component.note.reviewsLeft = 1;
        component.note.removeAfterReviews = true;
        expect(component.showDeleteInsteadReview()).toBe(true);
    });

    it('showDeleteInsteadReview() debe devolver false si la nota está eliminada', () => {
        spyOn(component, 'isNoteRemoved').and.returnValue(true);
        component.note.nextReviewAt = '2023-01-01 00:00:01';
        component.note.reviewsLeft = 1;
        component.note.removeAfterReviews = true;
        expect(component.showDeleteInsteadReview()).toBe(false);
    });

    it('showDeleteInsteadReview() debe devolver false si la fecha del siguiente repaso es superior a la actual', () => {
        spyOn(component, 'isNoteRemoved').and.returnValue(false);
        component.note.nextReviewAt = '2033-01-01 00:00:01';
        component.note.reviewsLeft = 1;
        component.note.removeAfterReviews = true;
        expect(component.showDeleteInsteadReview()).toBe(false);
    });

    it('showDeleteInsteadReview() debe devolver false si no queda un solo repaso', () => {
        spyOn(component, 'isNoteRemoved').and.returnValue(false);
        component.note.nextReviewAt = '2023-01-01 00:00:01';
        component.note.reviewsLeft = 2;
        component.note.removeAfterReviews = true;
        expect(component.showDeleteInsteadReview()).toBe(false);
    });

    it('showDeleteInsteadReview() debe devolver false si la nota no está marcada para eliminar después de los repasos', () => {
        spyOn(component, 'isNoteRemoved').and.returnValue(false);
        component.note.nextReviewAt = '2023-01-01 00:00:01';
        component.note.reviewsLeft = 1;
        component.note.removeAfterReviews = false;
        expect(component.showDeleteInsteadReview()).toBe(false);
    });

    it('remove() debe llamar al método remove del servicio de notas y asignar el estado de isDeleting', () => {
        spyOn(component.isDeleting, 'set');
        component.remove();
        expect(component.isDeleting.set).toHaveBeenCalledWith(true);
        expect(component.isDeleting.set).toHaveBeenCalledWith(false);
        expect(component.isDeleting.set).toHaveBeenCalledTimes(2);
        expect(notesServiceMock.remove).toHaveBeenCalledWith(component.note.id);
    });

    it('markAsReviewed() debe llamar al método markAsReviewed del servicio de notas y asignar el estado de isMarkingReviewed', () => {
        spyOn(component.isMarkingReviewed, 'set');
        component.markAsReviewed();
        expect(component.isMarkingReviewed.set).toHaveBeenCalledWith(true);
        expect(component.isMarkingReviewed.set).toHaveBeenCalledWith(false);
        expect(component.isMarkingReviewed.set).toHaveBeenCalledTimes(2);
        expect(notesServiceMock.markAsReviewed).toHaveBeenCalledWith(component.note.id);
    });

    it('restore() debe llamar al método restore del servicio de notas y asignar el estado de isRestoring', () => {
        spyOn(component.isRestoring, 'set');
        component.restore();
        expect(component.isRestoring.set).toHaveBeenCalledWith(true);
        expect(component.isRestoring.set).toHaveBeenCalledWith(false);
        expect(component.isRestoring.set).toHaveBeenCalledTimes(2);
        expect(notesServiceMock.restore).toHaveBeenCalledWith(component.note.id);
    });

    it('edit() debe llamar al método updateNoteList del servicio de notas con parámetros correctos', () => {
        component.edit();
        expect(notesServiceMock.updateNoteList).toHaveBeenCalledWith(component.note.id, { editMode: true });
    });
});