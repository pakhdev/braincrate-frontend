import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { AppComponent } from './app/app.component';
import { routes } from './app/routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthorizationInterceptor } from './app/shared/interceptors/authorization.interceptor';

bootstrapApplication(AppComponent, {
    providers: [
        provideRouter(routes),
        provideHttpClient(
            withInterceptors([AuthorizationInterceptor]),
        ),
    ],
});