import { Directive, ElementRef, Output, EventEmitter, HostListener, inject } from '@angular/core';

@Directive({
    standalone: true,
    selector: '[clickOutside]',
})
export class ClickOutsideDirective {
    @Output() clickOutside: EventEmitter<void> = new EventEmitter();
    private readonly elementRef = inject(ElementRef);
    private ignoreNextClick = true;

    @HostListener('document:click', ['$event.target'])
    handleClick(event: Node) {
        if (this.ignoreNextClick) {
            this.ignoreNextClick = false;
            return;
        }

        if (!this.isDescendant(this.elementRef.nativeElement, event)) {
            this.clickOutside.emit();
        }
    }

    private isDescendant(parent: HTMLElement, element: Node | null): boolean {
        let node: Node | null = element;
        while (node !== null) {
            if (node === parent) {
                return true;
            }
            node = node.parentNode;
        }
        return false;
    }
}