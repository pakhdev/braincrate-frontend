import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { AppComponent } from './app/app.component';
import { routes } from './app/routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthorizationInterceptor } from './app/shared/interceptors/authorization.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';

bootstrapApplication(AppComponent, {
    providers: [
        provideRouter(routes),
        provideAnimations(),
        provideHttpClient(
            withInterceptors([AuthorizationInterceptor]),
        ),
    ],
});