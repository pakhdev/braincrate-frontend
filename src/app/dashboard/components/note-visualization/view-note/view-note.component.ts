import {
    AfterViewInit,
    Component, computed,
    ElementRef,
    inject,
    Input,
    Renderer2,
    Signal,
    signal,
    WritableSignal,
} from '@angular/core';
import { ImageAttributes } from '../../../interfaces/image-attributes.interface';
import { LargeImageModalComponent } from '../large-image-modal/large-image-modal.component';
import { NgClass } from '@angular/common';
import { Note } from '../../../interfaces/note.interface';
import { NoteToolbarComponent } from '../note-toolbar/note-toolbar.component';
import { SafeHtmlPipe } from '../../../../shared/pipes/trust-html.pipe';
import { environments } from '../../../../../environments/environment';

@Component({
    selector: 'view-note',
    templateUrl: './view-note.component.html',
    imports: [
        NgClass,
        NoteToolbarComponent,
        LargeImageModalComponent,
        SafeHtmlPipe,
    ],
})
export class ViewNoteComponent implements AfterViewInit {
    @Input({ required: true }) public note!: Note;
    private readonly renderer = inject(Renderer2);
    private readonly elementRef = inject(ElementRef);
    private readonly imagesUrl = environments.imagesUrl;
    public readonly openLargeImageSrc: WritableSignal<string | null> = signal(null);
    public readonly content: Signal<string> = computed(() => this.note.content);
    public readonly tags: Signal<string> = computed(() => this.note.tags.map(tag => tag.name).join(', '));
    public readonly isRemoved: Signal<boolean> = computed(() => this.note.removedAt !== null);

    ngAfterViewInit() {
        this.configureImages();
    }

    public enlargeImage(largeUrl: string): void {
        this.openLargeImageSrc.set(largeUrl);
    }

    public closeLargeImage(): void {
        this.openLargeImageSrc.set(null);
    }

    private configureImages(): void {
        const images = this.elementRef.nativeElement.querySelectorAll('img');
        const imagesAttributes = this.parseRawImages();

        images.forEach((image: HTMLImageElement, i: number) => {
            this.renderer.setAttribute(image, 'src', `${ this.imagesUrl }/${ imagesAttributes[i].src }`);
            if (imagesAttributes[i].largeImage !== null) {
                this.renderer.setStyle(image, 'cursor', 'pointer');
                this.renderer.listen(image, 'click', () => {
                    this.enlargeImage(imagesAttributes[i].largeImage!);
                });
            }
        });
    }

    private parseRawImages(): ImageAttributes[] {
        const regex = /<img[^>]*>/g;
        const matches: ImageAttributes[] = [];
        let match;

        while ((match = regex.exec(this.note.content)) !== null) {
            const imageString = match[0];
            const imageAttributes = this.parseImageAttributes(imageString);
            matches.push(imageAttributes);
        }

        return matches;
    }

    private parseImageAttributes(imageString: string): ImageAttributes {
        const idRegex = /id="(\d+)"/;
        const srcRegex = /src="([^"]+)"/;
        const largeImageRegex = /largeimage="([^"]+)"/;

        const idMatch = idRegex.exec(imageString);
        const srcMatch = srcRegex.exec(imageString)!;
        const largeImageMatch = largeImageRegex.exec(imageString);

        const id = idMatch ? parseInt(idMatch[1], 10) : null;
        const src = srcMatch[1];
        const largeImage = largeImageMatch ? (largeImageMatch[1] === 'null' ? null : largeImageMatch[1]) : null;

        return { id, src, largeImage };
    }
}
