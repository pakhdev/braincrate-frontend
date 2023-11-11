import { EditorInitializer } from './editor-Initializer';

export class PopupHandler {

    private popupContainer!: HTMLElement;
    private isPopupOpened: boolean | string = false;

    constructor(
        private readonly depreditor: EditorInitializer,
    ) {
        this.createPopupContainer();
    }

    private createPopupContainer(): void {
        this.popupContainer = document.createElement('div');
        this.popupContainer.className = 'depreditor-popup-container';
        this.popupContainer.style.display = 'none';

        if (this.depreditor.editableDiv && this.depreditor.editableDiv.parentNode) {
            this.depreditor.editableDiv.parentNode.insertBefore(this.popupContainer, this.depreditor.editableDiv);
        }
    }

    public showTableForm(): void {
        if (this.isPopupOpened) {
            if (this.isPopupOpened === 'showTableForm') this.hidePopup();
            return;
        }
        this.isPopupOpened = 'showTableForm';

        const popup = document.createElement('div');
        popup.className = 'depreditor-popup';

        const titleDiv = document.createElement('div');
        titleDiv.className = 'depreditor-popup__title';
        titleDiv.textContent = 'Insertar tabla';
        popup.appendChild(titleDiv);

        const columnsLabel = document.createElement('label');
        columnsLabel.setAttribute('for', 'depreditor-column-num');
        columnsLabel.textContent = 'Cantidad de columnas';

        const columnsInput = document.createElement('input');
        columnsInput.type = 'number';
        columnsInput.id = 'depreditor-column-num';
        columnsInput.value = '1';

        const rowsLabel = document.createElement('label');
        rowsLabel.setAttribute('for', 'depreditor-rows-num');
        rowsLabel.textContent = 'Cantidad de filas';

        const rowsInput = document.createElement('input');
        rowsInput.type = 'number';
        rowsInput.id = 'depreditor-rows-num';
        rowsInput.value = '1';

        popup.appendChild(columnsLabel);
        popup.appendChild(columnsInput);
        popup.appendChild(rowsLabel);
        popup.appendChild(rowsInput);

        const actionButtons = this.createFormButtons(
            'Insertar tabla',
            () => this.depreditor.formatter.insertTable(+rowsInput.value, +columnsInput.value),
        );
        popup.appendChild(actionButtons);
        this.popupContainer.appendChild(popup);
        this.popupContainer.style.display = 'block';
    }

    public showImageForm(): void {
        if (this.isPopupOpened) {
            if (this.isPopupOpened === 'showImageForm') this.hidePopup();
            return;
        }
        this.isPopupOpened = 'showImageForm';

        const popup = document.createElement('div');
        popup.className = 'depreditor-popup';

        const titleDiv = document.createElement('div');
        titleDiv.className = 'depreditor-popup__title';
        titleDiv.textContent = 'Insertar imágen';
        popup.appendChild(titleDiv);

        const centeringDiv = document.createElement('div');
        centeringDiv.className = 'depreditor-popup__centering-container';

        const label = document.createElement('label');
        label.className = 'toggle';

        const checkboxInput = document.createElement('input');
        checkboxInput.type = 'checkbox';
        checkboxInput.className = 'toggle-checkbox';

        const toggleSwitchDiv = document.createElement('div');
        toggleSwitchDiv.className = 'toggle-switch';

        const toggleLabelSpan = document.createElement('span');
        toggleLabelSpan.className = 'toggle-label';
        toggleLabelSpan.textContent = 'Habilitar vista ampliada';

        label.appendChild(checkboxInput);
        label.appendChild(toggleSwitchDiv);
        label.appendChild(toggleLabelSpan);

        centeringDiv.appendChild(label);
        popup.appendChild(centeringDiv);

        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.setAttribute('accept', 'image/*');
        fileInput.onchange = () => this.depreditor.formatter.insertImage(fileInput, checkboxInput.checked);
        fileInput.style.display = 'none';
        popup.appendChild(fileInput);

        const actionButtons = this.createFormButtons(
            'Seleccionar imágen',
            () => fileInput.click(),
        );
        popup.appendChild(actionButtons);
        this.popupContainer.appendChild(popup);
        this.popupContainer.style.display = 'block';
    }

    public showLinkForm(): void {
        if (this.isPopupOpened) {
            if (this.isPopupOpened === 'showLinkForm') this.hidePopup();
            return;
        }
        this.isPopupOpened = 'showLinkForm';

        let linkTextInput: HTMLInputElement;
        let existingLink = '';

        let selection = window.getSelection()!;
        let selectedText = selection.toString();

        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const commonAncestor = range.commonAncestorContainer as HTMLElement;

            if (
                commonAncestor.parentNode &&
                commonAncestor.nodeType === Node.TEXT_NODE &&
                commonAncestor.parentNode instanceof Element &&
                commonAncestor.parentNode.tagName === 'A'
            ) {
                const linkElement = commonAncestor.parentNode as HTMLAnchorElement;
                range.selectNode(linkElement);
                selection.removeAllRanges();
                selection.addRange(range);
                selectedText = selection.toString();
                existingLink = commonAncestor.parentNode.getAttribute('href')!;
            }
        }

        const popup = document.createElement('div');
        popup.className = 'depreditor-popup';

        const titleDiv = document.createElement('div');
        titleDiv.className = 'depreditor-popup__title';
        titleDiv.textContent = 'Insertar enlace';
        popup.appendChild(titleDiv);

        const centeringDiv = document.createElement('div');
        centeringDiv.className = 'depreditor-popup__centering-container';

        const linkInput = document.createElement('input');
        linkInput.classList.add('depreditor-input');
        linkInput.type = 'text';
        linkInput.placeholder = 'Dirección del enlace';
        linkInput.value = existingLink;
        centeringDiv.appendChild(linkInput);

        if (!selectedText.length) {
            linkTextInput = document.createElement('input');
            linkTextInput.classList.add('depreditor-input');
            linkTextInput.type = 'text';
            linkTextInput.placeholder = 'Texto del enlace';
            centeringDiv.appendChild(linkTextInput);
        }

        popup.appendChild(centeringDiv);

        const actionButtons = this.createFormButtons(
            'Insertar enlace',
            () => this.depreditor.formatter.insertLink(
                linkInput.value,
                selectedText.length ? selectedText : linkTextInput.value,
            ),
        );
        popup.appendChild(actionButtons);
        this.popupContainer.appendChild(popup);
        this.popupContainer.style.display = 'block';
    }

    public showColorsForm(type: 'text' | 'background'): void {
        if (this.isPopupOpened) {
            if (this.isPopupOpened === 'showColorsForm') this.hidePopup();
            return;
        }
        this.isPopupOpened = 'showColorsForm';

        const titlePart = type === 'text'
            ? 'de texto'
            : 'de fondo';

        const popup = document.createElement('div');
        popup.className = 'depreditor-popup';

        const titleDiv = document.createElement('div');
        titleDiv.className = 'depreditor-popup__title';
        titleDiv.textContent = `Asignar color ${ titlePart }`;
        popup.appendChild(titleDiv);

        const colors = [
            '#000000', '#434343', '#666666', '#999999', '#B7B7B7', '#CCCCCC', '#D9D9D9', '#EFEFEF', '#F3F3F3', '#FFFFFF',
            '#980000', '#FF0000', '#FF9900', '#FFFF00', '#00FF00', '#00FFFF', '#4A86E8', '#0000FF', '#9900FF', '#FF00FF',
            '#E6B8AF', '#F4CCCC', '#FCE5CD', '#FFF2CC', '#D9EAD3', '#C9DAE1', '#C7D1D9', '#CFE2F3', '#D9D2E9', '#EAD1DC',
            '#CC8566', '#EA9999', '#F9CB9C', '#FFE599', '#B6D7A8', '#A2C4C9', '#A4C2F4', '#AEDDFF', '#D9D2E9', '#EBD3E4',
            '#CC4C24', '#E06666', '#F6B26B', '#FFE599', '#B6D7A8', '#A2C4C9', '#A4C2F4', '#AEDDFF', '#D9D2E9', '#EBD3E4',
        ];
        const colorsContainer = document.createElement('div');
        colorsContainer.className = 'depreditor-popup__colors-container';

        colors.forEach(colorCode => {
            const colorDiv = document.createElement('div');
            colorDiv.style.backgroundColor = colorCode;
            colorDiv.onmousedown = () => this.depreditor.formatter.setColor(type, colorCode);
            colorsContainer.appendChild(colorDiv);
        });

        popup.appendChild(colorsContainer);

        const actionButtons = this.createFormButtons();
        popup.appendChild(actionButtons);

        this.popupContainer.appendChild(popup);
        this.popupContainer.style.display = 'block';
    }

    public hidePopup = (): void => {
        this.popupContainer.style.display = 'none';
        this.popupContainer.innerText = '';
        this.isPopupOpened = false;
    };

    private createFormButtons(actionName?: string, actionFunc?: () => void) {
        const buttonsContainerDiv = document.createElement('div');
        buttonsContainerDiv.className = 'depreditor-popup__buttons-container';

        const cancelButton = document.createElement('button');
        cancelButton.className = 'button-danger button';
        cancelButton.onclick = this.hidePopup;
        cancelButton.textContent = 'Cancelar';
        buttonsContainerDiv.appendChild(cancelButton);

        if (actionName && actionFunc) {
            const insertActionButton = document.createElement('button');
            insertActionButton.className = 'button-success button';
            insertActionButton.onclick = () => actionFunc();
            insertActionButton.textContent = actionName;
            buttonsContainerDiv.appendChild(insertActionButton);
        }

        return buttonsContainerDiv;
    }

}