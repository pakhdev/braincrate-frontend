import { Directive, ElementRef, inject, Input } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { animate, AnimationBuilder, AnimationPlayer, style } from '@angular/animations';

@Directive({
    standalone: true,
    selector: '[errorMessage]',
})
export class ErrorMessageDirective {

    private readonly htmlElement?: ElementRef<HTMLElement>;
    private readonly builder = inject(AnimationBuilder);
    private _errors?: ValidationErrors | null | undefined | string;
    private player: AnimationPlayer;

    @Input() set errors(value: ValidationErrors | null | undefined | string) {
        this._errors = value;
        this.setErrorMessage();
    }

    constructor(private element: ElementRef<HTMLElement>) {
        this.htmlElement = element;
        const factory = this.builder.build([
            style({ opacity: 0 }),
            animate('300ms ease-in', style({ opacity: 1 })),
        ]);
        this.player = factory.create(this.htmlElement.nativeElement);
        this.player.play();
    }

    setErrorMessage(): void {
        if (!this.htmlElement) return;
        if (!this._errors) {
            this.htmlElement.nativeElement.innerText = '';
            return;
        }

        const errors = typeof this._errors === 'string'
            ? this._errors
            : Object.keys(this._errors);

        if (errors.includes('required')) {
            this.htmlElement.nativeElement.innerText = 'Este campo es requerido';
            return;
        } else if (errors.includes('minlength') && typeof this._errors !== 'string') {
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
        } else if (errors.includes('userNotFound')) {
            this.htmlElement.nativeElement.innerText = `El usuario no existe`;
            return;
        } else if (errors.includes('wrongPassword')) {
            this.htmlElement.nativeElement.innerText = `La contraseña es incorrecta`;
            return;
        } else if (errors.includes('wrongOldPassword')) {
            this.htmlElement.nativeElement.innerText = `La contraseña antigua es incorrecta`;
            return;
        } else if (errors.includes('passwordMatchesOld')) {
            this.htmlElement.nativeElement.innerText = `La contraseña coincide con la antigua`;
            return;
        } else if (errors.includes('setPasswordBeforeEmailUpdate')) {
            this.htmlElement.nativeElement.innerText = `Debes establecer una contraseña antes de cambiar el correo electrónico, porque tu cuenta se creó con Google`;
            return;
        }
    }

}
