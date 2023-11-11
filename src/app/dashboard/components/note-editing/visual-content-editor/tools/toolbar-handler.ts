import { ButtonsState, FormattingName, ToolbarButton } from '../types';
import { EditorInitializer } from './editor-Initializer';

export class ToolbarHandler {

    constructor(
        private readonly toolbarContainer: HTMLElement,
        private readonly depreditor: EditorInitializer,
    ) {
        this.createButtons();
    }

    private readonly buttons: ToolbarButton[] = [
        { icon: 'icon-set-bold', action: () => this.depreditor.formatter.format('bold') },
        { icon: 'icon-set-italic', action: () => this.depreditor.formatter.format('italic') },
        { icon: 'icon-set-underline', action: () => this.depreditor.formatter.format('underline') },
        { icon: 'icon-set-code', action: () => this.depreditor.formatter.insertCode() },
        { icon: 'icon-set-list-numbered', action: () => this.depreditor.formatter.insertList('numbered') },
        { icon: 'icon-set-list-dots', action: () => this.depreditor.formatter.insertList('dotted') },
        { icon: 'icon-set-paragraph-left', action: () => this.depreditor.formatter.align('left') },
        { icon: 'icon-set-paragraph-center', action: () => this.depreditor.formatter.align('center') },
        { icon: 'icon-set-paragraph-right', action: () => this.depreditor.formatter.align('right') },
        { icon: 'icon-insert-table', action: () => this.depreditor.popup.showTableForm() },
        { icon: 'icon-set-hidden', action: () => this.depreditor.formatter.setHidden() },
        { icon: 'icon-insert-link', action: () => this.depreditor.popup.showLinkForm() },
        { icon: 'icon-insert-image', action: () => this.depreditor.popup.showImageForm() },
        { icon: 'icon-set-text-color', action: () => this.depreditor.popup.showColorsForm('text') },
        { icon: 'icon-set-text-background-color', action: () => this.depreditor.popup.showColorsForm('background') },
    ];

    private buttonsState: ButtonsState = {
        bold: false,
        italic: false,
        underline: false,
        insertorderedlist: false,
        insertunorderedlist: false,
        justifyleft: false,
        justifycenter: false,
        justifyright: false,
        hidetext: false,
    };

    private createButtons(): void {
        this.buttons.forEach(button => {
            const newButton = document.createElement('button');
            newButton.classList.add('editor-toolbar__icon');
            newButton.classList.add(button.icon);
            newButton.onmousedown = button.action;
            this.toolbarContainer.appendChild(newButton);
        });
    }

    public handleButtonsState(): void {
        const formattingNames: FormattingName[] = ['bold', 'italic', 'underline', 'insertorderedlist', 'insertunorderedlist', 'justifyleft', 'justifycenter', 'justifyright'];
        for (const formattingName of formattingNames) {
            this.setButtonState(formattingName, document.queryCommandState(formattingName));
        }
        this.setButtonState('hidetext', this.isHiddenTextSelected());
    }

    public isHiddenTextSelected(): boolean {
        const selection = window.getSelection()!;
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const commonAncestor = range.commonAncestorContainer as HTMLElement;

            if (
                commonAncestor.parentNode &&
                commonAncestor.nodeType === Node.TEXT_NODE &&
                commonAncestor.parentNode instanceof Element
            ) {
                return commonAncestor.parentNode.classList.contains('hidden-text');
            }
        }
        return false;
    }

    private setButtonState(formattingName: FormattingName, newState: boolean): void {
        if (this.buttonsState[formattingName] === newState) return;

        let button: HTMLElement | null = null;
        const activeClassname: string = 'editor-toolbar__icon--active';

        switch (formattingName) {
            case 'bold':
                button = this.toolbarContainer.querySelector('.icon-set-bold')!;
                break;
            case 'italic':
                button = this.toolbarContainer.querySelector('.icon-set-italic')!;
                break;
            case 'underline':
                button = this.toolbarContainer.querySelector('.icon-set-underline')!;
                break;
            case 'insertorderedlist':
                button = this.toolbarContainer.querySelector('.icon-set-list-numbered')!;
                break;
            case 'insertunorderedlist':
                button = this.toolbarContainer.querySelector('.icon-set-list-dots')!;
                break;
            case 'justifyleft':
                button = this.toolbarContainer.querySelector('.icon-set-paragraph-left')!;
                break;
            case 'justifycenter':
                button = this.toolbarContainer.querySelector('.icon-set-paragraph-center')!;
                break;
            case 'justifyright':
                button = this.toolbarContainer.querySelector('.icon-set-paragraph-right')!;
                break;
            case 'hidetext':
                button = this.toolbarContainer.querySelector('.icon-set-hidden')!;
                break;
        }

        if (!button) return;

        this.buttonsState[formattingName] = newState;
        newState ? button.classList.add(activeClassname) : button.classList.remove(activeClassname);
    }

}