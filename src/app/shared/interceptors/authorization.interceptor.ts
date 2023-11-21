import { HttpRequest, HttpEvent, HttpHandlerFn } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environments } from '../../../environments/environment';

export function AuthorizationInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {

    const baseUrl: string = environments.baseUrl;

    const url = req.url.startsWith('http') ? req.url : `${ baseUrl }${ req.url }`;

    if (url.includes('/auth/login') || url.includes('/auth/register')) {
        const authReq = req.clone({ url });
        return next(authReq);
    }

    const token = localStorage.getItem('token');

    if (token) {
        const authReq = req.clone({
            url: url,
            headers: req.headers.set('Authorization', `Bearer ${ token }`),
        });

        return next(authReq);
    }

    return next(req);
}
