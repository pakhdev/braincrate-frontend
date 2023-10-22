import { Component, Input } from '@angular/core';

@Component({
    selector: 'note-review-options',
    templateUrl: './review-options.component.html',
})
export class ReviewOptionsComponent {
    @Input({ required: true }) public visible!: boolean;
}
