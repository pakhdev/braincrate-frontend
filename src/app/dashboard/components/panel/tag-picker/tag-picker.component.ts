import { Component, inject } from '@angular/core';
import { TagsService } from '../../../services/tags.service';

@Component({
    selector: 'dashboard-tag-picker',
    templateUrl: './tag-picker.component.html',
})
export class TagPickerComponent {

    public tagsService = inject(TagsService);

    get tagsList() {
        return this.tagsService.tags().sort((a, b) => b.notesCount - a.notesCount);
    }

}
