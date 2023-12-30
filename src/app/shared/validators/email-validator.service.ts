import { inject, Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, AsyncValidator } from '@angular/forms';
import { delay, Observable, of, switchMap, tap } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { environments } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EmailValidator implements AsyncValidator {

    private readonly http = inject(HttpClient);
    private isChecking = false;

    validate(control: AbstractControl): Observable<ValidationErrors | null> {
        const email = control.value;

        return of(control.value as string).pipe(
            delay(400),
            tap(() => this.isChecking = true),
            switchMap((email) => {

                const params = { email };
                return this.http.get<{
                    isRegistered: boolean
                }>(`${ environments.backendUrl }/auth/check-email`, { params }).pipe(
                    map((response) => {
                        if (response.isRegistered) {
                            return { emailTaken: true };
                        } else {
                            return null;
                        }
                    }),
                    catchError(() => of(null)),
                );

            }),
        );
    }

}