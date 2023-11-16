import { ToolbarHandler } from './toolbar-handler';
import { PopupHandler } from './popup-handler';
import { ImagesProcessor } from './images-processor';
import { FormattingUtils } from './formatting-utils';

export class EditorInitializer {

    private readonly toolbarHandler!: ToolbarHandler;
    private readonly popupHandler!: PopupHandler;
    private readonly formattingHandler!: FormattingUtils;
    private readonly imagesHandler!: ImagesProcessor;

    private domChangeObserver!: MutationObserver;
    private pasteEventListener!: EventListener;
    private enterEventListener!: EventListener;
    private deleteEventListener!: EventListener;
    private savedSelection: Range | null = null;

    constructor(
        public readonly editableDiv: HTMLDivElement,
        toolbarContainer: HTMLElement,
    ) {
        this.normalizeCode();
        this.initListeners(this.editableDiv);
        this.formattingHandler = new FormattingUtils(this);
        this.imagesHandler = new ImagesProcessor();
        this.popupHandler = new PopupHandler(this);
        this.toolbarHandler = new ToolbarHandler(toolbarContainer, this);
    }

    private initListeners(editableDiv: HTMLElement): void {

        this.deleteEventListener = (e: Event) => {
            if ((e as KeyboardEvent).key === 'Delete') {
                if (this.preventDelete()) {
                    e.preventDefault();
                }
            }
        };

        this.pasteEventListener = (e: Event) => {
            e.preventDefault();
            let text = (e as ClipboardEvent).clipboardData!.getData('text');
            text = text.replace(/&/g, '&amp;');
            text = text.replace(/</g, '&lt;');
            text = text.replace(/>/g, '&gt;');
            text = text.replace('\t', '  ');
            text = this.isSelectionInsideCode()
                ? this.setIndentationInCode(text)
                : this.setIndentationInText(text);
            text = text.replace(/\n/g, '<br>');
            this.formattingHandler.insertHtml(text);
        };

        this.enterEventListener = (e: Event) => {
            if (
                (e as KeyboardEvent).key === 'Enter' &&
                !document.queryCommandState('insertorderedlist') &&
                !document.queryCommandState('insertunorderedlist')
            ) {
                e.preventDefault();
                this.insertLineBreak();
            }
        };

        editableDiv.addEventListener('paste', this.pasteEventListener);
        editableDiv.addEventListener('keydown', this.enterEventListener);
        editableDiv.addEventListener('keydown', this.deleteEventListener);
        editableDiv.addEventListener('blur', () => this.saveSelection());

        editableDiv.addEventListener('mouseup', () => this.toolbar.handleButtonsState());
        editableDiv.addEventListener('keyup', () => this.toolbar.handleButtonsState());

        this.startObservingDOM();
    }

    private startObservingDOM(): void {
        this.domChangeObserver = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList' && mutation.removedNodes) {
                    if (Array.from(mutation.removedNodes).includes(this.editableDiv)) {
                        this.destroyListeners();
                    }
                }
            }
        });

        if (this.editableDiv.parentNode) {
            this.domChangeObserver.observe(this.editableDiv.parentNode, { childList: true });
        }
    }

    private destroyListeners(): void {
        if (!this.editableDiv) return;
        this.editableDiv.removeEventListener('paste', this.pasteEventListener);
        this.editableDiv.removeEventListener('keydown', this.enterEventListener);
        this.editableDiv.removeEventListener('keydown', this.deleteEventListener);
        this.editableDiv.removeEventListener('blur', this.saveSelection);
        this.stopObservingDOM();
    }

    private stopObservingDOM(): void {
        if (!this.domChangeObserver) return;
        this.domChangeObserver.disconnect();
    }

    public saveSelection(): void {
        const selection = window.getSelection();
        if (!selection || !selection.focusNode) return;

        let checkingParentNode = selection.focusNode;
        while (checkingParentNode) {
            if (checkingParentNode === this.editableDiv) break;
            checkingParentNode = checkingParentNode.parentNode as Node;
        }
        if (checkingParentNode !== this.editableDiv) return;
        this.savedSelection = selection!.rangeCount > 0 ? selection!.getRangeAt(0).cloneRange() : null;
    }

    public restoreSelection(): void {
        if (this.savedSelection) {
            const selection = window.getSelection();
            selection?.removeAllRanges();
            selection?.addRange(this.savedSelection);
        } else {
            this.editableDiv.focus();
        }
    }

    public moveCaretToEndOfSelection() {
        const selection = window.getSelection();

        if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            range.collapse(false);
        }
    }

    private normalizeCode(): void {
        this.editableDiv.innerHTML = this.editableDiv.innerHTML
            .replace(/\n/g, '')
            .replace(/\s+/g, ' ');
    }

    private insertLineBreak() {
        const selection = window.getSelection();
        if (!selection || selection.focusNode === null) return;
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const fragment = range.createContextualFragment('<br>&ZeroWidthSpace;');
            range.insertNode(fragment);
            range.setStart(selection.focusNode, selection.focusOffset);
            range.collapse(true);
        }
    }

    private setIndentationInCode(text: string): string {
        let minIndentation = 0;
        const noIndentation = text
            .split('\n')
            .some(line => !line.startsWith(' ') && line.trim().length > 0);
        if (!noIndentation) {
            let matches = text.match(/^( +)/gm);
            minIndentation = Math.min(...matches!.map(match => match.length));
        }
        return text.split('\n')
            .map(line => line.replace(/^( +)/gm, (_, p1) => '&nbsp;'.repeat(p1.length - minIndentation)))
            .join('\n');
    };

    private setIndentationInText(text: string): string {
        return text.split('\n')
            .map(line => line.replace(/^( +)/gm, ''))
            .join('\n');
    };

    private isSelectionInsideCode(): boolean {
        const selection = window.getSelection();
        if (!selection || !selection.focusNode) return false;

        let checkingParentNode = selection.focusNode;
        while (checkingParentNode) {
            if (checkingParentNode.nodeType === Node.ELEMENT_NODE) {
                const element = checkingParentNode as Element;
                if (element.classList.contains('code-text')) return true;
            }
            checkingParentNode = checkingParentNode.parentNode as Node;
        }
        return false;
    }

    private preventDelete() {
        const selection = window.getSelection();
        if (!selection || !selection.focusNode) return false;

        const focusNode = selection.focusNode;
        if (this.isNextSiblingCodeText(focusNode)) {
            const textNode = selection.focusNode as Text;
            const textLength = textNode.textContent?.trim().length || 0;
            const offset = selection.focusOffset;
            if (offset >= textLength) {
                return true;
            }
        }

        if (focusNode.nodeType === Node.TEXT_NODE) {
            const textNode = focusNode as Text;
            const textLength = textNode.textContent?.trim().length || 0;
            const offset = selection.focusOffset;
            if (offset >= textLength) {
                const focusNodeParent = focusNode.parentNode as Element;
                if (focusNodeParent.classList.contains('code-text')) {
                    return true;
                }
            }
        }
        return false;
    }

    private isNextSiblingCodeText(focusNode: Node): boolean {
        let siblingDistance = 2;
        let nextSibling = focusNode.nextSibling;
        while (nextSibling) {
            if (siblingDistance === 0) return false;
            if (nextSibling.nodeType === Node.ELEMENT_NODE) {
                const element = nextSibling as Element;
                if (element.classList.contains('code-text')) {
                    return true;
                } else {
                    siblingDistance--;
                }
            } else if (nextSibling.nodeType === Node.TEXT_NODE) {
                const textNode = nextSibling as Text;
                if (textNode.textContent?.replace(/\s/g, '') !== '') {
                    siblingDistance--;
                }
            }
            nextSibling = nextSibling.nextSibling;
        }
        return false;
    }

    // Acceso a métodos de otras clases

    public get popup(): PopupHandler {
        return this.popupHandler!;
    }

    public get toolbar(): ToolbarHandler {
        return this.toolbarHandler!;
    }

    public get formatter(): FormattingUtils {
        return this.formattingHandler!;
    }

    public get imagesProcessor(): ImagesProcessor {
        return this.imagesHandler!;
    }

}