import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { toObservable } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

import { environments } from '../../../environments/environment';
import { DashboardStateService } from './dashboard-state.service';
import { Note } from '../interfaces/note.interface';
import { NoteUpdateResponse } from '../interfaces/note-update-response.interface';
import { TagsService } from './tags.service';

@Injectable({
    providedIn: 'root',
})
export class NotesService {

    private readonly baseUrl: string = environments.baseUrl;
    private readonly http = inject(HttpClient);
    private readonly tagsService = inject(TagsService);
    private readonly dashboardStateService = inject(DashboardStateService);
    private readonly dashboardState$ = toObservable(this.dashboardStateService.dashboardState);
    private readonly notesPerPage = 15;

    public notesList: WritableSignal<Note[]> = signal([]);
    public isLoading: WritableSignal<boolean> = signal(false);
    public allNotesLoaded: WritableSignal<boolean> = signal(false);

    constructor() {
        this.dashboardState$.subscribe((dashboardState) => {
            if (!dashboardState.notesType) return;

            if (dashboardState.page === 1) {
                this.getNotes(dashboardState.selectedTags, dashboardState.searchWord, dashboardState.notesType)
                    .subscribe((notes) => {
                        this.controlEndOfNotes(notes.length);
                        this.isLoading.set(false);
                        this.notesList.set(notes);
                    });
            } else {
                this.getNotes(dashboardState.selectedTags, dashboardState.searchWord, dashboardState.notesType, this.calcOffset())
                    .subscribe((loadedNotes) => {
                        this.controlEndOfNotes(loadedNotes.length);
                        this.isLoading.set(false);
                        this.notesList.update(existingNotes => [...existingNotes, ...loadedNotes]);
                    });
            }
        });
    }

    public remove(id: number): void {
        this.removeNoteQuery(id).subscribe((response) => {
            if (response.errors || !response.note) {
                console.error(response.errors);
                return;
            }
            this.updateNoteList(id, {
                removedAt: response.note.removedAt,
            });
            if (response.tags)
                this.tagsService.updateTags(response.tags);
        });
    }

    public restore(id: number): void {
        this.updateNoteQuery(id, 'restore').subscribe((response) => {
            if (response.errors) {
                console.error(response.errors);
                return;
            }
            this.updateNoteList(id, {
                removedAt: null,
            });
            if (response.tags)
                this.tagsService.updateTags(response.tags);
        });
    }

    public markAsReviewed(id: number): void {
        this.updateNoteQuery(id, 'mark-as-reviewed').subscribe((response) => {
            if (response.errors || !response.note) {
                console.error(response.errors);
                return;
            }
            if (this.dashboardStateService.dashboardState().notesType === 'for-review') {
                this.tagsService.removeTagsFromList(response.tags);
                this.removeNoteFromList(id);
            } else {
                this.updateNoteList(id, {
                    reviewsLeft: response.note.reviewsLeft,
                    nextReviewAt: response.note.nextReviewAt,
                    reviewedAt: response.note.reviewedAt,
                });
            }
        });
    }

    public cancelReviews(id: number): void {
        this.updateNoteQuery(id, 'cancel-reviews').subscribe((response) => {
            if (response.errors || !response.note) {
                console.error(response.errors);
                return;
            }
            if (this.dashboardStateService.dashboardState().notesType === 'for-review') {
                this.tagsService.removeTagsFromList(response.tags);
                this.removeNoteFromList(id);
            } else {
                this.updateNoteList(id, {
                    reviewsLeft: response.note.reviewsLeft,
                    nextReviewAt: response.note.nextReviewAt,
                });
            }
        });
    }

    public resetReviews(id: number): void {
        this.updateNoteQuery(id, 'reset-reviews').subscribe((response) => {
            if (response.errors || !response.note) {
                console.error(response.errors);
                return;
            }
            this.updateNoteList(id, { reviewsLeft: response.note.reviewsLeft });
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
        params = params.append('limit', this.notesPerPage.toString());
        if (searchWord)
            params = params.append('searchTerm', searchWord);
        if (offset)
            params = params.append('offset', offset.toString());
        tagIds.forEach(id => {
            params = params.append('tagIds[]', id.toString());
        });

        return this.http.get<Note[]>(url, { headers, params });
    }

    private updateNoteQuery(id: number, route: string, body?: any): Observable<NoteUpdateResponse> {
        // Set isLoading to true for this note
        const url = `${ this.baseUrl }/notes/${ route }/${ id }`;
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders()
            .set('Authorization', `Bearer ${ token }`);
        return this.http.patch<NoteUpdateResponse>(url, body, { headers });
    }

    private removeNoteQuery(id: number): Observable<NoteUpdateResponse> {
        const url = `${ this.baseUrl }/notes/${ id }`;
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders()
            .set('Authorization', `Bearer ${ token }`);
        return this.http.delete<NoteUpdateResponse>(url, { headers });
    }

    private updateNoteList(id: number, properties: Partial<Note>) {
        this.notesList.update(notes => {
            const note = notes.find(note => note.id === id);
            if (!note) return notes;
            return notes.map(note => note.id === id ? { ...note, ...properties } : note);
        });
        console.log(this.notesList());
    }

    private removeNoteFromList(id: number) {
        this.notesList.update(notes => notes.filter(note => note.id !== id));
        // TODO: Offset Correction -1
    }

    private controlEndOfNotes(notesLength: number): void {
        this.allNotesLoaded.set(notesLength < this.notesPerPage);
    }

    private calcOffset(): number {
        const page = this.dashboardStateService.dashboardState().page;
        return page * this.notesPerPage - this.notesPerPage;
    }

}
