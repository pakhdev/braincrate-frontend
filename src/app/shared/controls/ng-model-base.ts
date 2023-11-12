import { ControlValueAccessor } from '@angular/forms';

export class NgModelBase implements ControlValueAccessor {
    private _content: string = '';
    private onChange: (value: string) => void = () => {};
    private onTouched: () => void = () => {};

    get content(): string {
        return this._content;
    }

    set content(value: string) {
        if (this._content !== value) {
            this._content = value;
            this.onChange(value);
            this.onTouched();
        }
    }

    writeValue(value: string): void {
        if (value !== undefined) {
            this.content = value;
        }
    }

    registerOnChange(fn: (value: string) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }
}
