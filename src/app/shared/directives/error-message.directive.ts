import { Directive, ElementRef, Input } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

@Directive({
    standalone: true,
    selector: '[errorMessage]',
})
export class ErrorMessageDirective {

    private readonly htmlElement?: ElementRef<HTMLElement>;
    private _errors?: ValidationErrors | null | undefined;

    @Input() set errors(value: ValidationErrors | null | undefined) {
        this._errors = value;
        this.setErrorMessage();
    }

    constructor(private element: ElementRef<HTMLElement>) {
        this.htmlElement = element;
    }

    setErrorMessage(): void {
        if (!this.htmlElement) return;
        if (!this._errors) {
            this.htmlElement.nativeElement.innerText = '';
            return;
        }

        const errors = Object.keys(this._errors);

        if (errors.includes('required')) {
            this.htmlElement.nativeElement.innerText = 'Este campo es requerido';
            return;
        } else if (errors.includes('minlength')) {
            const minLength = this._errors['minlength']['requiredLength'];
            this.htmlElement.nativeElement.innerText = `Mínimo ${ minLength } caractéres`;
            return;
        } else if (errors.includes('pattern')) {
            this.htmlElement.nativeElement.innerText = `Dirección de correo electrónico incorrecta`;
            return;
        } else if (errors.includes('notEqual')) {
            this.htmlElement.nativeElement.innerText = `Las contraseñas no coinciden`;
            return;
        } else if (errors.includes('emailTaken')) {
            this.htmlElement.nativeElement.innerText = `Este correo electrónico ya está registrado`;
            return;
        } else if (errors.includes('emailMatchesOld')) {
            this.htmlElement.nativeElement.innerText = `El correo electrónico coincide con el antiguo`;
            return;
        }
    }

}
