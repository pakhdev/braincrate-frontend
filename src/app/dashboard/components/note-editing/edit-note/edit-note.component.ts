import { Component, inject, Input, OnInit } from '@angular/core';
import { NgForOf } from '@angular/common';

import { Note } from '../../../interfaces/note.interface';
import { TagsService } from '../../../services/tags.service';
import { Difficulty } from '../../../enums/difficulty.enum';
import { TagInputWithSuggestionsComponent } from '../tag-input-with-suggestions/tag-input-with-suggestions.component';
import { SelectedTagComponent } from '../selected-tag/selected-tag.component';
import { ReviewPlanSelectorComponent } from '../review-plan-selector/review-plan-selector.component';

@Component({
    standalone: true,
    selector: 'edit-note',
    templateUrl: './edit-note.component.html',
    imports: [
        NgForOf,
        TagInputWithSuggestionsComponent,
        SelectedTagComponent,
        ReviewPlanSelectorComponent,
    ],
})
export class EditNoteComponent implements OnInit {

    @Input() public note?: Note;

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
