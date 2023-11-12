import {
    Directive,
    ElementRef,
    forwardRef,
    HostListener, inject,
    Renderer2,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
    standalone: true,
    selector:
        '[contenteditable][formControlName], [contenteditable][formControl], [contenteditable][ngModel]',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ContenteditableValueAccessorDirective),
            multi: true,
        },
    ],
})
export class ContenteditableValueAccessorDirective
    implements ControlValueAccessor {

    private onTouched = () => {};
    private onChange: (value: string) => void = () => {};
    private readonly renderer = inject(Renderer2);
    private readonly elementRef = inject(ElementRef);

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