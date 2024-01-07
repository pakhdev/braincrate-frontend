import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';

import { NotesManagementComponent } from './notes-management.component';
import { SearchAndPickTagsComponent } from '../search-and-pick-tags/search-and-pick-tags.component';
import { SearchNotesComponent } from '../search-notes/search-notes.component';

describe('NotesManagementComponent', () => {
    let component: NotesManagementComponent;
    let fixture: ComponentFixture<NotesManagementComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                NotesManagementComponent,
                MockComponent(SearchNotesComponent),
                MockComponent(SearchAndPickTagsComponent),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(NotesManagementComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('tiene que contener el componente search-notes', () => {
        const searchNotesElement = fixture.nativeElement.querySelector('search-notes');
        expect(searchNotesElement).toBeTruthy();
    });

    it('tiene que contener el componente SearchAndPickTagsComponent', () => {
        const searchAndPickTagsElement = fixture.nativeElement.querySelector('search-and-pick-tags');
        expect(searchAndPickTagsElement).toBeTruthy();
    });
});