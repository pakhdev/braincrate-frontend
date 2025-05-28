import { Component, computed, EventEmitter, Input, Output, Signal } from '@angular/core';
import { environments } from '../../../../../environments/environment';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
    selector: 'large-image-modal',
    standalone: true,
    animations: [
        trigger('modalAnimation', [
            state('void', style({ opacity: 0, transform: 'scale(0.7)' })),
            state('*', style({ opacity: 1, transform: 'scale(1)' })),
            transition('void => *', animate('200ms ease-out')),
        ]),
    ],
    templateUrl: './large-image-modal.component.html',
})
export class LargeImageModalComponent {
    @Output() public close: EventEmitter<void> = new EventEmitter();
    @Input({ required: true }) public src!: string;
    private readonly imagesUrl = environments.imagesUrl;
    public readonly largeImageSrc: Signal<string> = computed(() => `${ this.imagesUrl }/${ this.src }`);

    public closeModal(): void {
        this.close.emit();
    }
}
