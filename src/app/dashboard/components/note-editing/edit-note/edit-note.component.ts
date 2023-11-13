import { Component, ElementRef, inject, Input, OnInit, ViewChild } from '@angular/core';
import { NgForOf } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Note } from '../../../interfaces/note.interface';
import { TagsService } from '../../../services/tags.service';
import { Difficulty } from '../../../enums/difficulty.enum';
import { TagInputWithSuggestionsComponent } from '../tag-input-with-suggestions/tag-input-with-suggestions.component';
import { SelectedTagComponent } from '../selected-tag/selected-tag.component';
import { ReviewPlanSelectorComponent } from '../review-plan-selector/review-plan-selector.component';
import { ContenteditableEditor } from '../../../../shared/directives/contenteditable-editor.directive';

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

    private readonly tagsService = inject(TagsService);

    public title: string = '';
    public tagNames: string[] = [];
    public content: string = '';
    public difficulty: Difficulty = Difficulty.Easy;
    public removeAfterReviews: boolean = false;

    ngOnInit(): void {
        if (!this.note) {
            this.tagNames = [...this.tagsService.selectedTags.map(tag => tag.name)];
            return;
        }
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
}
