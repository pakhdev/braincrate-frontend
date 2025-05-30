import { Component, ElementRef, inject, Input, OnInit, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ContenteditableEditor } from '../../../../shared/directives/contenteditable-editor.directive';
import { Difficulty } from '../../../enums/difficulty.enum';
import { DynamicButtonTextDirective } from '../../../../shared/directives/dynamic-button-text.directive';
import { Note } from '../../../interfaces/note.interface';
import { NoteManipulationBody } from '../../../interfaces/note-manipulation-body.interface';
import { NotesService } from '../../../services/notes.service';
import { ReviewPlanSelectorComponent } from '../review-plan-selector/review-plan-selector.component';
import { SelectedTagComponent } from '../selected-tag/selected-tag.component';
import { TagInputWithSuggestionsComponent } from '../tag-input-with-suggestions/tag-input-with-suggestions.component';
import { environments } from '../../../../../environments/environment';
import { AppStore } from '../../../../shared/store/app.store';

@Component({
    selector: 'edit-note',
    templateUrl: './edit-note.component.html',
    imports: [
        TagInputWithSuggestionsComponent,
        SelectedTagComponent,
        ReviewPlanSelectorComponent,
        FormsModule,
        ContenteditableEditor,
        DynamicButtonTextDirective,
    ],
})
export class EditNoteComponent implements OnInit {
    private readonly appStore = inject(AppStore);
    @Input() public note?: Note;
    @ViewChild('iconsContainer') public readonly iconsContainer!: ElementRef;

    private readonly imagesUrl = environments.imagesUrl;
    private readonly notesService = inject(NotesService);
    private readonly router = inject(Router);

    private isNewNote: boolean = false;
    private id: number = 0;

    public isLoading = signal(false);
    public title: string = '';
    public tagNames: string[] = [];
    public content: string = '';
    public difficulty: Difficulty = Difficulty.Easy;
    public removeAfterReviews: boolean = false;

    ngOnInit(): void {
        if (!this.note) {
            this.tagNames = [...this.appStore.selectedTags().map(tag => tag.name)];
            this.isNewNote = true;
            return;
        }
        this.id = this.note.id;
        this.title = this.note.title;
        this.tagNames = this.note.tags.map(tag => tag.name);
        this.content = this.modifyImageSrc(this.note.content, true);
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
            || this.isLoading()
        ) return;

        const body: NoteManipulationBody = {
            title: this.title,
            tags: this.tagNames,
            content: this.modifyImageSrc(this.content, false),
            difficulty: this.difficulty,
            removeAfterReviews: this.removeAfterReviews,
        };

        this.isLoading.set(true);
        if (this.isNewNote) {
            this.createNote(body);
        } else {
            this.updateNote(body);
        }
    }

    private createNote(body: NoteManipulationBody): void {
        this.notesService.createNoteQuery(body).subscribe((response) => {
            this.isLoading.set(false);
            const currentSection = this.appStore.dashboard.notesType();

            if (response.errors) {
                console.error(response.errors);
                return;
            }

            if (currentSection === 'for-review') {
                this.router.navigate(['dashboard', 'all']);
                return;
            }

            if (response.note)
                this.appStore.prependNoteToList(response.note);
            if (response.tags)
                this.appStore.updateTagsList(response.tags);

            this.appStore.setPreserveState(true);
            this.router.navigate(['dashboard', 'all']);
        });
    }

    private updateNote(body: NoteManipulationBody): void {
        this.notesService.updateNoteQuery(this.id, null, body).subscribe((response) => {
            this.isLoading.set(false);
            if (response.errors) {
                console.error(response.errors);
                return;
            }
            if (response.note)
                this.appStore.updateNote(this.id, {
                    title: response.note.title,
                    content: response.note.content,
                    difficulty: response.note.difficulty,
                    removeAfterReviews: response.note.removeAfterReviews,
                    tags: response.note.tags,
                    editMode: false,
                });
            if (response.tags)
                this.appStore.updateTagsList(response.tags);
        });
    }

    private modifyImageSrc(content: string, isPrepend: boolean): string {
        const regex = /<img\s+([^>]*)\s*\/?>/g;

        return content.replace(regex, (match, attributes) => {
            const srcRegex = isPrepend ? /src="([^"]+)"/ : new RegExp(`src="${ this.imagesUrl }/([^"]+)"`);
            const srcMatch = attributes.match(srcRegex);

            if (srcMatch) {
                const newSrc = isPrepend ? `src="${ this.imagesUrl }/${ srcMatch[1] }"` : `src="${ srcMatch[1] }"`;
                return `<img ${ attributes.replace(srcRegex, newSrc) }>`;
            }

            return match;
        });
    }
}
