import { Component, inject } from '@angular/core';

import { TagsService } from '../../../services/tags.service';
import { DashboardStateService } from '../../../services/dashboard-state.service';

@Component({
    selector: 'dashboard-tag-picker',
    templateUrl: './tag-picker.component.html',
})
export class TagPickerComponent {

    private dashboardStateService = inject(DashboardStateService);
    public tagsService = inject(TagsService);

    get selectedTags() {
        return this.tagsService.tags()
            .filter(tag => this.dashboardStateService.selectedTags.includes(tag.id))
            .sort((a, b) => b.notesCount - a.notesCount);
    }

    get notSelectedTags() {
        return this.tagsService.tags()
            .filter(tag => !this.dashboardStateService.selectedTags.includes(tag.id))
            .sort((a, b) => b.notesCount - a.notesCount);
    }

    get areTagsLoading() {
        return this.tagsService.isLoading();
    }

    public selectTag(tagId: number) {
        const selectedTags = this.dashboardStateService.selectedTags;
        if (selectedTags.includes(tagId)) return;

        this.dashboardStateService.setState({
            selectedTags: [
                ...selectedTags,
                tagId,
            ],
        });
    }

    public unselectTag(tagId: number) {
        const selectedTags = this.dashboardStateService.selectedTags;
        if (!selectedTags.includes(tagId)) return;

        this.dashboardStateService.setState({
            selectedTags: selectedTags.filter(id => id !== tagId),
        });
    }

}
