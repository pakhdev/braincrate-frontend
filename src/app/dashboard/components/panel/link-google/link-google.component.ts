import { Component, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { environments } from '../../../../../environments/environment';
import { GoogleLinkResponse } from '../../../interfaces/google-link-response.interface';
import { GoogleLinkMessage } from '../../../enums/google-link-message.enum';
import { NgIf } from '@angular/common';
import { AuthService } from '../../../../auth/services/auth.service';

@Component({
    standalone: true,
    selector: 'link-google',
    templateUrl: './link-google.component.html',
    imports: [
        NgIf,
    ],
})
export class LinkGoogleComponent implements OnInit, OnDestroy {

    public successMessage: WritableSignal<string | null> = signal(null);
    public errorMessage: WritableSignal<string | null> = signal(null);

    constructor(private readonly authService: AuthService) {}

    public ngOnInit(): void {
        window.addEventListener('message', this.handleMessage.bind(this));
    }

    public ngOnDestroy(): void {
        window.removeEventListener('message', this.handleMessage.bind(this));
    }

    public linkGoogle(): void {
        const authEndpoint = environments.baseUrl + '/auth/link-google-account';
        window.open(authEndpoint, 'Google Auth', 'width=500,height=600');
    }

    private setSuccessMessage(message: string): void {
        this.errorMessage.set(null);
        this.successMessage.set(message);
    }

    private setErrorMessage(message: string): void {
        this.successMessage.set(null);
        this.errorMessage.set(message);
    }

    private handleMessage(event: MessageEvent): void {
        if (new URL(environments.baseUrl).origin === event.origin) {
            const googleLinkResponse: GoogleLinkResponse = event.data;
            const sourceWindow = event.source as Window | null;
            if (sourceWindow) sourceWindow.close();
            switch (googleLinkResponse.message) {
                case GoogleLinkMessage.success:
                    this.authService.setAuthentication();
                    this.setSuccessMessage('Su cuenta Google se ha vinculado correctamente');
                    break;
                case GoogleLinkMessage.emailChanged:
                    this.authService.setAuthentication();
                    this.setSuccessMessage('Su cuenta Google se ha vinculado correctamente. Puede acceder usando' +
                        ' Google o su correo electrónico ' + googleLinkResponse.newEmail + ' y la contraseña');
                    break;
                case GoogleLinkMessage.emailTaken:
                    this.setErrorMessage('Esta dirección de correo electrónico ya está registrada en el sistema');
                    break;
            }
        }
    }

}
