import { Component, inject, Input, OnInit } from '@angular/core';

import { Note } from '../../../interfaces/note.interface';
import { TagsService } from '../../../services/tags.service';

@Component({
    selector: 'dashboard-edit-note',
    templateUrl: './edit-note.component.html',
})
export class EditNoteComponent implements OnInit {

    @Input() public note?: Note;

    private readonly tagsService = inject(TagsService);

    public title: string = '';
    public tagNames: string[] = [];
    public content: string = '';

    ngOnInit(): void {
        if (!this.note) {
            this.tagNames = [...this.tagsService.selectedTags.map(tag => tag.name)];
            return;
        }
        this.title = this.note.title;
        this.tagNames = this.note.tags.map(tag => tag.name);
        this.content = this.note.content;
    }

    public removeTag(name: string): void {
        this.tagNames = this.tagNames.filter(tag => tag !== name);
    }

    insertTag(name: string) {
        if (!name || this.tagNames.includes(name)) return;
        this.tagNames.push(name);
    }
}
