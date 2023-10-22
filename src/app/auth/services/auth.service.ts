import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of, throwError } from 'rxjs';

import { AuthStatus } from '../enums/auth-status.enum';
import { CheckTokenResponse, LoginResponse, User } from '../interfaces';
import { FormGroup } from '@angular/forms';
import { environments } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly baseUrl: string = environments.baseUrl;
    private readonly http = inject(HttpClient);
    private _currentUser = signal<User | null>(null);
    private _authStatus = signal<AuthStatus>(AuthStatus.checking);

    public currentUser = computed(() => this._currentUser());
    public authStatus = computed(() => this._authStatus());

    constructor() {
        this.checkAuthStatus().subscribe();
    }

    register(email: string, password: string): Observable<boolean> {
        const url = `${ this.baseUrl }/auth/register`;
        const body = { email, password };
        return this.http.post<LoginResponse>(url, body)
            .pipe(
                map(({ id, email, token }) => this.setAuthentication({ id: +id, email }, token)),
                catchError(err => throwError(() => err.error.message)),
            );
    }

    login(email: string, password: string): Observable<boolean> {
        const url = `${ this.baseUrl }/auth/login`;
        const body = { email, password };
        return this.http.post<LoginResponse>(url, body)
            .pipe(
                map(({ id, email, token }) => this.setAuthentication({ id: +id, email }, token)),
                catchError(err => throwError(() => err.error.message)),
            );
    }

    logout(): void {
        localStorage.removeItem('token');
        this._currentUser.set(null);
        this._authStatus.set(AuthStatus.notAuthenticated);
    }

    checkAuthStatus(): Observable<boolean> {
        const url = `${ this.baseUrl }/auth/check-auth-status`;
        const token = localStorage.getItem('token');
        if (!token) {
            this.logout();
            return of(false);
        }

        const headers = new HttpHeaders()
            .set('Authorization', `Bearer ${ token }`);

        return this.http.get<CheckTokenResponse>(url, { headers })
            .pipe(
                map(({ id, email, token }) => this.setAuthentication({ id: +id, email }, token)),
                catchError(() => {
                    this._authStatus.set(AuthStatus.notAuthenticated);
                    return of(false);
                }),
            );
    }

    showErrorMessage(form: FormGroup, field: string): boolean | null {
        return form.controls[field].errors && form.controls[field].touched;
    }

    private setAuthentication(user: User, token: string): boolean {
        this._currentUser.set(user);
        this._authStatus.set(AuthStatus.authenticated);
        localStorage.setItem('token', token);
        return true;
    }
}
