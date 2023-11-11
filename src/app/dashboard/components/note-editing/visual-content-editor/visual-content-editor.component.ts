import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { EditorInitializer } from './tools/editor-Initializer';

@Component({
    standalone: true,
    selector: 'visual-content-editor',
    templateUrl: './visual-content-editor.component.html',
})
export class VisualContentEditorComponent implements AfterViewInit {

    @Input({ required: true }) public content!: string;
    @Input({ required: true }) public iconsContainer!: HTMLDivElement;
    @ViewChild('contentContainer') public contentContainer!: ElementRef;

    ngAfterViewInit(): void {
        new EditorInitializer(this.contentContainer.nativeElement, this.iconsContainer);
    }

}
