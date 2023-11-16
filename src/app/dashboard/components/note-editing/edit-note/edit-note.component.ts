import { Component, ElementRef, inject, Input, OnInit, ViewChild } from '@angular/core';
import { NgForOf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Note } from '../../../interfaces/note.interface';
import { TagsService } from '../../../services/tags.service';
import { Difficulty } from '../../../enums/difficulty.enum';
import { TagInputWithSuggestionsComponent } from '../tag-input-with-suggestions/tag-input-with-suggestions.component';
import { SelectedTagComponent } from '../selected-tag/selected-tag.component';
import { ReviewPlanSelectorComponent } from '../review-plan-selector/review-plan-selector.component';
import { ContenteditableEditor } from '../../../../shared/directives/contenteditable-editor.directive';
import { NotesService } from '../../../services/notes.service';
import { NoteManipulationBody } from '../../../interfaces/note-manipulation-body.interface';
import { DashboardStateService } from '../../../services/dashboard-state.service';

@Component({
    standalone: true,
    selector: 'edit-note',
    templateUrl: './edit-note.component.html',
    imports: [
        NgForOf,
        TagInputWithSuggestionsComponent,
        SelectedTagComponent,
        ReviewPlanSelectorComponent,
        FormsModule,
        ContenteditableEditor,
    ],
})
export class EditNoteComponent implements OnInit {

    @Input() public note?: Note;
    @ViewChild('iconsContainer') public readonly iconsContainer!: ElementRef;

    private readonly dashboardStateService = inject(DashboardStateService);
    private readonly tagsService = inject(TagsService);
    private readonly notesService = inject(NotesService);
    private readonly router = inject(Router);

    private isNewNote: boolean = false;
    private id: number = 0;
    public title: string = '';
    public tagNames: string[] = [];
    public content: string = '';
    public difficulty: Difficulty = Difficulty.Easy;
    public removeAfterReviews: boolean = false;

    ngOnInit(): void {
        if (!this.note) {
            this.tagNames = [...this.tagsService.selectedTags.map(tag => tag.name)];
            this.isNewNote = true;
            return;
        }
        this.id = this.note.id;
        this.title = this.note.title;
        this.tagNames = this.note.tags.map(tag => tag.name);
        this.content = this.note.content;
        this.difficulty = this.note.difficulty;
        this.removeAfterReviews = this.note.removeAfterReviews;
    }

    public removeTag(name: string): void {
        this.tagNames = this.tagNames.filter(tag => tag !== name);
    }

    public insertTag(name: string): void {
        if (!name || this.tagNames.includes(name)) return;
        this.tagNames.push(name);
    }

    public changeRemoveAfterReviews(event: boolean): void {
        this.removeAfterReviews = event;
    }

    public changeDifficulty(event: Difficulty): void {
        this.difficulty = event;
    }

    public saveNote(): void {

        if (this.title.length < 2
            || this.tagNames.length < 1
            || this.tagNames.length > 13
            || this.content.length < 5
        ) return;

        const body: NoteManipulationBody = {
            title: this.title,
            tags: this.tagNames,
            content: this.content,
            difficulty: this.difficulty,
            removeAfterReviews: this.removeAfterReviews,
        };

        if (this.isNewNote) {
            this.createNote(body);
        } else {
            this.updateNote(body);
        }
    }

    private createNote(body: NoteManipulationBody): void {
        this.notesService.createNoteQuery(body).subscribe((response) => {

            const currentSection = this.dashboardStateService.dashboardState().notesType;

            if (response.errors) {
                console.error(response.errors);
                return;
            }

            if (currentSection === 'for-review') {
                this.router.navigate(['dashboard', 'all']);
                return;
            }

            if (response.note)
                this.notesService.prependNoteToList(response.note);
            if (response.tags)
                this.tagsService.updateTags(response.tags);

            this.router.navigate(['dashboard', 'all'], { queryParams: { preserveState: 'true' } });
        });
    }

    private updateNote(body: NoteManipulationBody): void {
        this.notesService.updateNoteQuery(this.id, null, body).subscribe((response) => {
            if (response.errors) {
                console.error(response.errors);
                return;
            }
            if (response.note)
                this.notesService.updateNoteList(this.id, {
                    title: response.note.title,
                    content: response.note.content,
                    difficulty: response.note.difficulty,
                    removeAfterReviews: response.note.removeAfterReviews,
                    tags: response.note.tags,
                    editMode: false,
                });
            if (response.tags)
                this.tagsService.updateTags(response.tags);
        });
    }
}
