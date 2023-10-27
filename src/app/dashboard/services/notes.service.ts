import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { toObservable } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

import { environments } from '../../../environments/environment';
import { DashboardStateService } from './dashboard-state.service';
import { Note } from '../interfaces/note.interface';

@Injectable({
    providedIn: 'root',
})
export class NotesService {

    private readonly baseUrl: string = environments.baseUrl;
    private readonly http = inject(HttpClient);
    private readonly dashboardStateService = inject(DashboardStateService);
    private readonly dashboardState$ = toObservable(this.dashboardStateService.dashboardState);

    public notes: WritableSignal<Note[]> = signal([]);
    public isLoading: WritableSignal<boolean> = signal(false);

    constructor() {
        this.dashboardState$.subscribe((dashboardState) => {
            if (!dashboardState.notesType) return;

            if (dashboardState.page === 1) {
                this.getNotes(dashboardState.selectedTags, dashboardState.searchWord, dashboardState.notesType)
                    .subscribe((notes) => {
                        this.isLoading.set(false);
                        this.notes.set(notes);
                    });
            } else {
                this.getNotes(dashboardState.selectedTags, dashboardState.searchWord, dashboardState.notesType)
                    .subscribe((loadedNotes) => {
                        this.isLoading.set(false);
                        this.notes.update(existingNotes => [...existingNotes, ...loadedNotes]);
                    });
            }
        });
    }

    private getNotes(tagIds: number[], searchWord: string, notesType: string, offset?: number): Observable<Note[]> {

        this.isLoading.set(true);

        const url = notesType === 'for-review'
            ? `${ this.baseUrl }/notes/for-review`
            : `${ this.baseUrl }/notes`;

        const token = localStorage.getItem('token');
        const headers = new HttpHeaders()
            .set('Authorization', `Bearer ${ token }`);

        let params = new HttpParams();
        if (searchWord)
            params = params.append('searchTerm', searchWord);
        if (offset)
            params = params.append('offset', offset.toString());
        tagIds.forEach(id => {
            params = params.append('tagIds[]', id.toString());
        });

        return this.http.get<Note[]>(url, { headers, params });
    }
}
