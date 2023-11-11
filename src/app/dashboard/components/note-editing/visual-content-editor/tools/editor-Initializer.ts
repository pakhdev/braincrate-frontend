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
    private savedSelection: Range | null = null;

    constructor(
        public readonly editableDiv: HTMLDivElement,
        toolbarContainer: HTMLElement,
    ) {
        this.initListeners(this.editableDiv);
        this.formattingHandler = new FormattingUtils(this);
        this.imagesHandler = new ImagesProcessor();
        this.popupHandler = new PopupHandler(this);
        this.toolbarHandler = new ToolbarHandler(toolbarContainer, this);
    }

    private initListeners(editableDiv: HTMLElement): void {
        this.pasteEventListener = (e: Event) => {
            e.preventDefault();
            let text = (e as ClipboardEvent).clipboardData!.getData('text');
            text = text.replace(/&/g, '&amp;');
            text = text.replace(/</g, '&lt;');
            text = text.replace(/>/g, '&gt;');
            text = text.replace(/ /g, '&nbsp;');
            text = text.replace(/\n/g, '<br>');
            document.execCommand('insertHTML', false, text);
        };

        this.enterEventListener = (e: Event) => {
            if (
                (e as KeyboardEvent).key === 'Enter' &&
                !document.queryCommandState('insertorderedlist') &&
                !document.queryCommandState('insertunorderedlist')
            ) {
                e.preventDefault();
                this.lineBreak();
            }
        };

        editableDiv.addEventListener('paste', this.pasteEventListener);
        editableDiv.addEventListener('keydown', this.enterEventListener);
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

    private lineBreak() {
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