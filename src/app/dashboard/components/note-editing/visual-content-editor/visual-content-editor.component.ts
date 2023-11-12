import { AfterViewInit, Component, ElementRef, forwardRef, Input, ViewChild } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

import { EditorInitializer } from './tools/editor-Initializer';
import { NgModelBase } from '../../../../shared/controls/ng-model-base';
import {
    ContenteditableValueAccessorDirective,
} from '../../../../shared/directives/contenteditable-value-accessor.directive';

export const CUSTOM_CONTENT_CONTROL_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => VisualContentEditorComponent),
    multi: true,
};

@Component({
    standalone: true,
    selector: 'visual-content-editor',
    templateUrl: './visual-content-editor.component.html',
    providers: [CUSTOM_CONTENT_CONTROL_VALUE_ACCESSOR],
    imports: [
        FormsModule,
        ContenteditableValueAccessorDirective,
    ],
})
export class VisualContentEditorComponent extends NgModelBase implements AfterViewInit {

    @Input({ required: true }) public iconsContainer!: HTMLDivElement;
    @ViewChild('contentContainer') public contentContainer!: ElementRef;

    ngAfterViewInit(): void {
        new EditorInitializer(this.contentContainer.nativeElement, this.iconsContainer);
    }

}
