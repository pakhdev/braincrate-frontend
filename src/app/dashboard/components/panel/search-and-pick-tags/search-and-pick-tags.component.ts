import { AppStore } from '../../../../shared/store/app.store';
import { Component, computed, effect, inject, Signal } from '@angular/core';
import { NgStyle } from '@angular/common';
import { NoResultsTagComponent } from '../no-results-tag/no-results-tag.component';
import { Tag } from '../../../interfaces/tag.interface';
import { WelcomeTagComponent } from '../welcome-tag/welcome-tag.component';

@Component({
    selector: 'search-and-pick-tags',
    templateUrl: './search-and-pick-tags.component.html',
    imports: [
        NgStyle,
        WelcomeTagComponent,
        NoResultsTagComponent,
    ],
})
export class SearchAndPickTagsComponent {
    private appStore = inject(AppStore);
    private visibleTagLimit = 30;

    public searchTagsTerm: Signal<string> = computed(() => this.appStore.dashboard.searchTagsTerm());
    public areTagsLoading: Signal<boolean> = computed(() => this.appStore.tags.isLoading());
    public selectedTags: Signal<Tag[]> = computed(() => this.appStore.selectedTags());
    public notSelectedTags: Signal<Tag[]> = computed(() => this.appStore.notSelectedTags());
    public filteredNotSelectedTags: Signal<Tag[]> = computed(() => {
        return this.notSelectedTags()
            .filter(tag => tag.name.toLowerCase().includes(this.appStore.dashboard.searchTagsTerm()))
            .splice(0, this.visibleTagLimit);
    });
    public showNoResultsTag: Signal<boolean> = computed((): boolean => {
        return (!this.appStore.dashboard.searchTagsTerm() || !this.appStore.dashboard.searchNotesTerm())
            && !this.appStore.selectedTags().length
            && !this.filteredNotSelectedTags().length
            && !this.appStore.tags.isLoading();
    });
    public showWelcomeTag = computed((): boolean => {
            return !this.appStore.tags.list().length
                && !this.appStore.tags.isLoading()
                && !this.appStore.dashboard.searchNotesTerm()
                && this.appStore.dashboard.notesType() === 'all';
        },
    );

    public selectTag = (tagId: number) => this.appStore.selectTag(tagId);
    public unselectTag = (tagId: number) => this.appStore.unselectTag(tagId);
    public setSearchTagsTerm = (event: Event) => {
        const searchTerm = (event.target as HTMLInputElement).value;
        if (!searchTerm && !this.appStore.dashboard.searchTagsTerm()) return;
        this.appStore.setSearchTagsTerm(searchTerm.toLowerCase());
    };
}
