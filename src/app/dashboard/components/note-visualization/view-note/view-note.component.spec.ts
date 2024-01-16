import { ViewNoteComponent } from './view-note.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent, MockPipe } from 'ng-mocks';
import { NoteToolbarComponent } from '../note-toolbar/note-toolbar.component';
import { ReviewOptionsComponent } from '../review-options/review-options.component';
import { LargeImageModalComponent } from '../large-image-modal/large-image-modal.component';
import { SafeHtmlPipe } from '../../../../shared/pipes/trust-html.pipe';
import { createNoteMock } from '../../../../../mocks/note.mock';

describe('ViewNoteComponent', () => {
    let component: ViewNoteComponent;
    let fixture: ComponentFixture<ViewNoteComponent>;
    const note = createNoteMock();
    note.tags = [
        {
            id: 1,
            name: 'tag',
            notesCount: 1,
        },
    ];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                ViewNoteComponent,
                MockComponent(NoteToolbarComponent),
                MockComponent(ReviewOptionsComponent),
                MockComponent(LargeImageModalComponent),
            ],
            providers: [
                MockPipe(SafeHtmlPipe),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ViewNoteComponent);
        component = fixture.componentInstance;
        component.note = note;
        fixture.detectChanges();
    });

    it('content() debe devolver el contenido', () => {
        expect(component.content).toEqual(note.content);
    });

    it('tags() debe devolver los nombres de las etiquetas separados por coma', () => {
        expect(component.tags).toEqual(note.tags.map(tag => tag.name).join(', '));
    });

    it('enlargeImage() debe emitir la señal openLargeImageSrc con la URL de la imagen', () => {
        const spy = spyOn(component.openLargeImageSrc, 'set');
        component.enlargeImage('url');
        expect(spy).toHaveBeenCalledWith('url');
    });

    it('closeLargeImage() debe emitir la señal openLargeImageSrc con null', () => {
        const spy = spyOn(component.openLargeImageSrc, 'set');
        component.closeLargeImage();
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('debe existir un elemento con clase .note__title-removed si la nota está eliminada', () => {
        component.note.removedAt = '2024-01-01 00:00:01';
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.note__title-removed')).toBeTruthy();
    });

    it('no puede existir ningún elemento con clase .note__title-removed si la nota no está eliminada', () => {
        component.note.removedAt = null;
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.note__content-removed')).toBeFalsy();
    });

    it('debe existir el componente large-image-modal si openLargeImageSrc contiene una URL', () => {
        component.openLargeImageSrc.set('url');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('large-image-modal')).toBeTruthy();
    });

    it('no puede existir el componente large-image-modal si openLargeImageSrc no contiene una URL', () => {
        component.openLargeImageSrc.set(null);
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('large-image-modal')).toBeFalsy();
    });
});