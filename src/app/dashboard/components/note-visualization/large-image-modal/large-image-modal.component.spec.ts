import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { environments } from '../../../../../environments/environment';
import { LargeImageModalComponent } from './large-image-modal.component';

describe('LargeImageModalComponent', () => {
    let component: LargeImageModalComponent;
    let fixture: ComponentFixture<LargeImageModalComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                LargeImageModalComponent,
                NoopAnimationsModule,
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(LargeImageModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('largeImageSrc() debe retornar la ruta completa para la imágen', () => {
        component.src = 'test.jpg';
        expect(component.largeImageSrc).toBe(`${ environments.imagesUrl }/${ component.src }`);
    });

    it('closeModal() debe emitir el evento close()', () => {
        spyOn(component.close, 'emit');
        component.closeModal();
        expect(component.close.emit).toHaveBeenCalled();
    });

    it('la ventana se cierra al hacer click en el fondo', () => {
        const closeModalSpy = spyOn(component, 'closeModal');
        const modalBackground = fixture.nativeElement.querySelector('.modal');
        modalBackground.click();
        expect(closeModalSpy).toHaveBeenCalled();
    });

    it('la ventana se cierra al hacer clic en el botón de cerrar', () => {
        const closeModalSpy = spyOn(component, 'closeModal');
        const closeButton = fixture.nativeElement.querySelector('.modal__close-button');
        closeButton.click();
        expect(closeModalSpy).toHaveBeenCalled();
    });

    it('debería detener la propagación al hacer click en la imagen', () => {
        const clickEvent = new Event('click');
        spyOn(clickEvent, 'stopPropagation');
        const imageTag = fixture.nativeElement.querySelector('img');
        imageTag.dispatchEvent(clickEvent);
        expect(clickEvent.stopPropagation).toHaveBeenCalled();
    });
});