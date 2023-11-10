import { Component, ElementRef, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Tag } from '../../../interfaces/tag.interface';
import { TagsService } from '../../../services/tags.service';

@Component({
    standalone: true,
    selector: 'tag-input-with-suggestions',
    templateUrl: './tag-input-with-suggestions.component.html',
    imports: [
        NgClass,
        NgForOf,
        NgIf,
        FormsModule,
    ],
})
export class TagInputWithSuggestionsComponent implements OnInit {

    @Output() public onInsertTag: EventEmitter<string> = new EventEmitter<string>();
    @Input() public selectedTags: string[] = [];
    @ViewChild('tagInputElement') public tagInputElement!: ElementRef<HTMLInputElement>;

    private readonly tagsService: TagsService = inject(TagsService);
    private readonly tagsList: Tag[] = [];

    public selectedSuggestionIdx: number = -1;
    public inputText = '';

    ngOnInit(): void {
        this.tagsService.getTags([], '', 'all').subscribe(tags => {
            this.tagsList.push(...tags);
        });
    }

    get suggestedTags(): Tag[] {
        if (!this.inputText.length) return [];
        const suggestedTags = this.tagsList
            .filter(
                tag => tag.name
                    .toLowerCase()
                    .startsWith(this.inputText.toLowerCase()),
            ).filter(tag => !this.selectedTags.includes(tag.name))
            .slice(0, 5);
        if (suggestedTags.length === 1 && suggestedTags[0].name === this.inputText) return [];
        return suggestedTags;
    }

    public isSelectedSuggestion(name: string): boolean {
        if (!this.suggestedTags.length || !this.suggestedTags[this.selectedSuggestionIdx])
            return false;
        return name === this.suggestedTags[this.selectedSuggestionIdx].name;
    }

    public manageKeyPress(event: KeyboardEvent): void {
        if (event.key === 'ArrowUp') {
            event.preventDefault();
            this.selectPreviousSuggestion();
            return;
        } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            this.selectNextSuggestion();
            return;
        } else if (event.key === 'Enter') {
            this.onEnter();
            return;
        }

        if (!this.suggestedTags.length) return;
        this.selectedSuggestionIdx = -1;
    }

    public onEnter(): void {
        if (this.selectedSuggestionIdx !== -1) {
            this.onInsertTag.emit(this.suggestedTags[this.selectedSuggestionIdx].name);
        } else if (this.inputText.length > 1) {
            this.onInsertTag.emit(this.inputText);
        } else {
            return;
        }
        this.inputText = '';
        this.selectedSuggestionIdx = -1;
    }

    public selectSuggestion(name: string): void {
        this.onInsertTag.emit(name);
        this.resetState();
    }

    private selectNextSuggestion(): void {
        const nextIdx = this.selectedSuggestionIdx + 1;
        if (nextIdx < this.suggestedTags.length) {
            this.selectedSuggestionIdx = nextIdx;
        }
    }

    private selectPreviousSuggestion(): void {
        const previousIdx = this.selectedSuggestionIdx - 1;
        if (previousIdx >= 0) {
            this.selectedSuggestionIdx = previousIdx;
        }
    }

    private resetState(): void {
        this.selectedSuggestionIdx = -1;
        this.inputText = '';
        this.tagInputElement.nativeElement.focus();
    }

}
