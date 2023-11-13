import {
    AfterViewInit,
    Directive,
    ElementRef,
    forwardRef,
    HostListener, inject, Input, OnDestroy,
    Renderer2,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { EditorInitializer } from '../visual-editor/tools/editor-Initializer';

@Directive({
    standalone: true,
    selector:
        '[contenteditable][formControlName], [contenteditable][formControl], [contenteditable][ngModel]',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ContenteditableEditor),
            multi: true,
        },
    ],
})
export class ContenteditableEditor implements ControlValueAccessor, AfterViewInit, OnDestroy {

    @Input({ required: true }) public iconsContainer!: HTMLDivElement;

    private onTouched = () => {};
    private onChange: (value: string) => void = () => {};
    private readonly renderer = inject(Renderer2);
    private readonly elementRef = inject(ElementRef);

    private readonly observer = new MutationObserver(() => {
        setTimeout(() => {
            this.onChange(this.elementRef.nativeElement.innerHTML);
        });
    });

    ngAfterViewInit(): void {
        new EditorInitializer(this.elementRef.nativeElement, this.iconsContainer);
        this.observer.observe(this.elementRef.nativeElement, {
            characterData: true,
            childList: true,
            subtree: true,
        });
    }

    ngOnDestroy() {
        this.observer.disconnect();
    }

    @HostListener('input')
    onInput() {
        this.onChange(this.elementRef.nativeElement.innerHTML);
    }

    @HostListener('blur')
    onBlur() {
        this.onTouched();
    }

    writeValue(value: string | null) {
        this.renderer.setProperty(
            this.elementRef.nativeElement,
            'innerHTML',
            value,
        );
    }

    registerOnChange(onChange: (value: string) => void) {
        this.onChange = onChange;
    }

    registerOnTouched(onTouched: () => void) {
        this.onTouched = onTouched;
    }
}