import { FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { computed, inject, Injectable, signal } from '@angular/core';

import { AuthStatus } from '../enums/auth-status.enum';
import { UserCredentials } from '../interfaces';
import { AppStore } from '../../shared/store/app.store';

@Injectable({
    providedIn: 'root',
})
export class AuthService {

    private readonly appStore = inject(AppStore);
    private readonly http = inject(HttpClient);
    private _currentUser = signal<UserCredentials | null>(null);
    private _authStatus = signal<AuthStatus>(AuthStatus.checking);

    public currentUser = computed(() => this._currentUser());
    public authStatus = computed(() => this._authStatus());

    constructor() {
        this.checkAuthStatus().subscribe();
    }

    public register(email: string, password: string): Observable<boolean> {
        const body = { email, password };
        return this.http.post('/auth/register', body)
            .pipe(
                map(() => this.setAuthentication()),
                catchError(err => throwError(() => err.error.errorCode)),
            );
    }

    public login(email: string, password: string): Observable<boolean> {
        const body = { email, password };
        return this.http.post('/auth/login', body)
            .pipe(
                map(() => this.setAuthentication()),
                tap(() => this.appStore.resetDashboard()),
                catchError(err => throwError(() => err.error.errorCode)),
            );
    }

    public logout(): void {
        this.http.delete('/auth/logout').subscribe(
            () => {
                this._currentUser.set(null);
                this._authStatus.set(AuthStatus.notAuthenticated);
            },
        );
    }

    public checkAuthStatus(): Observable<boolean> {
        const userCredentials = this.readUserCookies();

        if (!userCredentials || !userCredentials.id) {
            this._authStatus.set(AuthStatus.notAuthenticated);
            return of(false);
        }

        return this.http.get('/auth/check-auth-status')
            .pipe(
                map(() => this.setAuthentication()),
                catchError(() => {
                    this.logout();
                    return of(false);
                }),
            );
    }

    public hasError(form: FormGroup, field: string): boolean | null {
        return form.controls[field].errors && form.controls[field].touched;
    }

    public updateEmail(email: string): Observable<boolean> {
        const body = { email };
        return this.http.patch('/auth/update-email', body)
            .pipe(
                map(() => this.setAuthentication()),
                catchError(err => throwError(() => err.error?.errorCode)),
            );
    }

    public updatePassword(oldPassword: string | undefined | null, newPassword: string): Observable<boolean> {
        const body = { oldPassword, newPassword };
        return this.http.patch('/auth/update-password', body)
            .pipe(
                map(() => this.setAuthentication()),
                catchError(err => throwError(() => err.error?.errorCode)),
            );
    }

    public setAuthentication(): boolean {
        const user = this.readUserCookies();
        this._currentUser.set(user);
        this._authStatus.set(AuthStatus.authenticated);
        return true;
    }

    private readUserCookies(): UserCredentials {
        const cookies = document.cookie.split(';');
        const userCredentials: UserCredentials = {};
        for (const cookie of cookies) {
            const [key, value] = cookie.split('=').map((c) => c.trim());
            switch (key) {
                case 'id':
                    userCredentials.id = value;
                    break;
                case 'email':
                    userCredentials.email = decodeURIComponent(value);
                    break;
                case 'hasPass':
                    userCredentials.hasPass = value === 'true';
                    break;
                case 'hasGoogleAccount':
                    userCredentials.hasGoogleAccount = value === 'true';
                    break;
            }
        }
        return userCredentials;
    }

}
