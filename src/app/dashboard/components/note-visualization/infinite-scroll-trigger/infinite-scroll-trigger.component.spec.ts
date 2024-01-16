import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfiniteScrollTriggerComponent } from './infinite-scroll-trigger.component';
import { NotesService } from '../../../services/notes.service';
import { createNotesServiceMock } from '../../../../../mocks/notes.service.mock';

describe('InfiniteScrollTriggerComponent', () => {
    let component: InfiniteScrollTriggerComponent;
    let fixture: ComponentFixture<InfiniteScrollTriggerComponent>;
    const notesServiceMock = createNotesServiceMock();

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [InfiniteScrollTriggerComponent],
            providers: [
                { provide: NotesService, useValue: notesServiceMock },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(InfiniteScrollTriggerComponent);
        component = fixture.componentInstance;
        notesServiceMock.isLoading.and.returnValue(false);
        notesServiceMock.allNotesLoaded.and.returnValue(false);
        notesServiceMock.notesList.and.returnValue([{}]);
        fixture.detectChanges();
    });

    it('el elemento trigger debe aparecer si se cumplen todas las condiciones', () => {
        expect(component['infiniteScrollTrigger']).toBeTruthy();
    });

    it('el elemento trigger no debe aparecer si las notas están cargando', () => {
        notesServiceMock.isLoading.and.returnValue(true);
        fixture.detectChanges();
        expect(component['infiniteScrollTrigger']).toBeFalsy();
    });

    it('el elemento trigger no debe aparecer si todas las notas están cargadas', () => {
        notesServiceMock.allNotesLoaded.and.returnValue(true);
        fixture.detectChanges();
        expect(component['infiniteScrollTrigger']).toBeFalsy();
    });

    it('el elemento trigger no debe aparecer si todavía no hay notas cargadas', () => {
        notesServiceMock.notesList.and.returnValue([]);
        fixture.detectChanges();
        expect(component['infiniteScrollTrigger']).toBeFalsy();
    });

});