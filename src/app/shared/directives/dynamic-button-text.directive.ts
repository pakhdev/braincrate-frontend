import { Directive, ElementRef, inject, Input, OnInit, Renderer2 } from '@angular/core';
import { animate, AnimationBuilder, keyframes, style } from '@angular/animations';

@Directive({
    standalone: true,
    selector: '[dynamicButtonText]',
})
export class DynamicButtonTextDirective implements OnInit {

    @Input({ required: true }) initialMessage!: string;
    @Input({ required: true }) loadingMessage!: string;
    @Input({ required: true }) successMessage!: string;
    @Input({ required: false }) errorMessage: string = 'Error';
    @Input({ required: false }) errorState?: string | null;

    @Input({ required: true }) set isLoading(value: boolean) {
        this.toggleLoading(value);
    };

    private readonly elementRef = inject(ElementRef);
    private readonly renderer = inject(Renderer2);
    private readonly animationBuilder = inject(AnimationBuilder);
    private readonly animationDuration: number = 100;
    private _isLoading = false;

    ngOnInit() {
        this.renderer.setProperty(this.elementRef.nativeElement, 'innerHTML', `<span>${ this.initialMessage }</span>`);
    }

    toggleLoading(isLoading: boolean): void {
        if (isLoading === this._isLoading) return;
        if (this._isLoading) {
            this._isLoading = false;
            this.setText(this.errorState ? this.errorMessage : this.successMessage, !!this.errorState);
            setTimeout(() => {
                this.setText(this.initialMessage);
            }, 2000);
        } else {
            this._isLoading = true;
            this.setText(this.loadingMessage);
        }
    }

    setText(text: string, isError: boolean = false): void {

        if (isError) {
            const redBackgroundAnimation = this.animationBuilder.build([
                animate(
                    `2300ms ease-in-out`,
                    keyframes([
                        style({ backgroundColor: '', offset: 0 }),
                        style({ backgroundColor: 'var(--brownish-orange)', offset: 0.01 }),
                        style({ backgroundColor: '', offset: 1 }),
                    ]),
                ),
            ]);

            const redBackgroundPlayer = redBackgroundAnimation.create(this.elementRef.nativeElement);
            redBackgroundPlayer.play();
        }

        const textElement = this.renderer.createElement('span');
        const textAnimation = this.animationBuilder.build([
            animate(
                `${ this.animationDuration }ms ease-in-out`,
                keyframes([
                    style({ opacity: 0.3, transform: 'translateY(-5px)', offset: 0 }),
                    style({ opacity: 1, transform: 'translateY(0)', offset: 1 }),
                ]),
            ),
        ]);

        const textPlayer = textAnimation.create(textElement);
        textPlayer.play();

        this.renderer.setProperty(textElement, 'innerHTML', text);
        this.renderer.setProperty(this.elementRef.nativeElement, 'innerHTML', '');
        this.renderer.appendChild(this.elementRef.nativeElement, textElement);
    }

}