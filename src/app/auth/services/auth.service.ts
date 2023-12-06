import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { computed, inject, Injectable, signal } from '@angular/core';

import { AuthResponse, CheckTokenResponse, LoginResponse, User } from '../interfaces';
import { AuthStatus } from '../enums/auth-status.enum';
import { FormGroup } from '@angular/forms';
import { DashboardStateService } from '../../dashboard/services/dashboard-state.service';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly http = inject(HttpClient);
    private _currentUser = signal<User | null>(null);
    private _authStatus = signal<AuthStatus>(AuthStatus.checking);
    private dashboardStateService = inject(DashboardStateService);

    public currentUser = computed(() => this._currentUser());
    public authStatus = computed(() => this._authStatus());

    constructor() {
        this.checkAuthStatus().subscribe();
    }

    public register(email: string, password: string): Observable<boolean> {
        const body = { email, password };
        return this.http.post<LoginResponse>('/auth/register', body)
            .pipe(
                map(({ id, email, token }) => this.setAuthentication({ id: +id, email }, token)),
                catchError(err => throwError(() => err.error.errorCode)),
            );
    }

    public login(email: string, password: string): Observable<boolean> {
        const body = { email, password };
        return this.http.post<LoginResponse>('/auth/login', body)
            .pipe(
                map(({ id, email, token }) => this.setAuthentication({ id: +id, email }, token)),
                tap(() => this.dashboardStateService.setState({
                    selectedTags: [0],
                    searchWord: '',
                    notesType: '',
                    page: 0,
                })),
                catchError(err => throwError(() => err.error.errorCode)),
            );
    }

    public logout(): void {
        localStorage.removeItem('token');
        this._currentUser.set(null);
        this._authStatus.set(AuthStatus.notAuthenticated);
    }

    public checkAuthStatus(): Observable<boolean> {
        if (!localStorage.getItem('token')) {
            this._authStatus.set(AuthStatus.notAuthenticated);
            return of(false);
        }
        return this.http.get<CheckTokenResponse>('/auth/check-auth-status')
            .pipe(
                map(({ id, email, token }) => this.setAuthentication({ id: +id, email }, token)),
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
        return this.http.patch<AuthResponse>('/auth/update-email', body)
            .pipe(
                map((response) => {
                    const { id, email, token } = response;
                    return this.setAuthentication({ id: +id, email }, token);
                }),
                catchError(err => throwError(() => err.error?.errorCode)),
            );
    }

    public updatePassword(oldPassword: string, newPassword: string): Observable<boolean> {
        const body = { oldPassword, newPassword };
        return this.http.patch<AuthResponse>('/auth/update-password', body)
            .pipe(
                map((response) => {
                    const { id, email, token } = response;
                    return this.setAuthentication({ id: +id, email }, token);
                }),
                catchError(err => throwError(() => err.error?.errorCode)),
            );
    }

    private setAuthentication(user: User, token: string): boolean {
        this._currentUser.set(user);
        this._authStatus.set(AuthStatus.authenticated);
        localStorage.setItem('token', token);
        return true;
    }

}
