import { HttpRequest, HttpEvent, HttpHandlerFn } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environments } from '../../../environments/environment';

export function AuthorizationInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    const url = req.url.startsWith('http') ? req.url : `${ environments.backendUrl }${ req.url }`;
    const authReq = req.clone({
        url: url,
        withCredentials: true,
    });
    return next(authReq);
}
