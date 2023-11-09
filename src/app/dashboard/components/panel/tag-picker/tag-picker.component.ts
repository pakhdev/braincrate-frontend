import { Component, ElementRef, inject, ViewChild } from '@angular/core';

import { TagsService } from '../../../services/tags.service';
import { DashboardStateService } from '../../../services/dashboard-state.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { pairwise } from 'rxjs';
import { DashboardState } from '../../../interfaces/dashboard-state.interface';
import { Tag } from '../../../interfaces/tag.interface';

@Component({
    selector: 'dashboard-tag-picker',
    templateUrl: './tag-picker.component.html',
})
export class TagPickerComponent {

    @ViewChild('searchTagsInput') private readonly searchTagsInput!: ElementRef;
    private readonly tagsService = inject(TagsService);
    private readonly dashboardStateService = inject(DashboardStateService);
    private readonly dashboardState$ =
        toObservable(this.dashboardStateService.dashboardState).pipe(pairwise());
    private readonly visibleTagLimit = 30;
    private searchTagsTerm: string = '';

    constructor() {
        this.dashboardState$.subscribe(([previous, current]) => {
            if (this.isSearchTagsInputToBeCleared(previous, current)) {
                this.searchTagsInput.nativeElement.value = '';
                this.searchTagsTerm = '';
            }
        });
    }

    get selectedTags(): Tag[] {
        return this.tagsService.selectedTags;
    }

    get notSelectedTags(): Tag[] {
        let tags = this.tagsService.notSelectedTags;
        if (this.searchTagsTerm) tags = tags.filter(tag => tag.name.toLowerCase().includes(this.searchTagsTerm));
        return tags.splice(0, this.visibleTagLimit);
    }

    get areTagsLoading(): boolean {
        return this.tagsService.isLoading();
    }

    public selectTag(tagId: number): void {
        const selectedTags = this.dashboardStateService.selectedTags;
        if (selectedTags.includes(tagId)) return;

        this.dashboardStateService.setState({
            page: 1,
            selectedTags: [
                ...selectedTags,
                tagId,
            ],
        });
    }

    public unselectTag(tagId: number): void {
        const selectedTags = this.dashboardStateService.selectedTags;
        if (!selectedTags.includes(tagId)) return;

        this.dashboardStateService.setState({
            page: 1,
            selectedTags: selectedTags.filter(id => id !== tagId),
        });
    }

    public searchTags(): void {
        const searchTerm = this.searchTagsInput.nativeElement.value;
        if (!searchTerm && !this.searchTagsTerm) return;
        this.searchTagsTerm = searchTerm.toLowerCase();
    }

    public showWelcomeTag(): boolean {
        return this.tagsService.tags().length === 0
            && !this.searchTagsTerm
            && !this.tagsService.isLoading()
            && !this.dashboardStateService.dashboardState().searchWord
            && this.dashboardStateService.dashboardState().notesType === 'all';
    }

    public showNoResultsTag(): boolean {
        return !(this.tagsService.isLoading()
            || this.notSelectedTags.length > 0
            || (!this.searchTagsTerm && !this.dashboardStateService.dashboardState().searchWord));

    }

    private isSearchTagsInputToBeCleared(previous: DashboardState, current: DashboardState): boolean {
        if (previous.notesType !== current.notesType) return true;
        if (previous.searchWord !== current.searchWord) return true;

        const previousTagIds = previous.selectedTags.slice().sort();
        const currentTagIds = current.selectedTags.slice().sort();
        return JSON.stringify(previousTagIds) !== JSON.stringify(currentTagIds);
    }

}
