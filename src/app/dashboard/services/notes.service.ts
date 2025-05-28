import { effect, inject, Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { finalize, Observable, tap } from 'rxjs';

import { Note } from '../interfaces/note.interface';
import { NoteUpdateResponse } from '../interfaces/note-update-response.interface';
import { NoteManipulationBody } from '../interfaces/note-manipulation-body.interface';
import { AppStore } from 'src/app/shared/store/app.store';

@Injectable({ providedIn: 'root' })
export class NotesService {

    private readonly appStore = inject(AppStore);
    private readonly http = inject(HttpClient);
    private readonly notesPerPage = 5;

    private readonly reloadNotes = effect(() => {
        if (this.appStore.dashboard.preserveState()) {
            this.appStore.setPreserveState(false);
            return;
        }

        if (this.appStore.dashboard.page() === 1) {
            this.appStore.setNotesOffsetCorrection(0);
            if (this.appStore.dashboard.notesType() === 'all') this.loadNotesForReviewCounter();
            this.getNotes(this.appStore.dashboard.selectedTags(), this.appStore.dashboard.searchNotesTerm(), this.appStore.dashboard.notesType())
                .subscribe((notes) => {
                    this.controlEndOfNotes(notes.length);
                    this.appStore.setNotesList(notes);
                });
            return;
        }
        this.getNotes(this.appStore.dashboard.selectedTags(), this.appStore.dashboard.searchNotesTerm(), this.appStore.dashboard.notesType(), this.calcOffset())
            .subscribe((loadedNotes) => {
                this.controlEndOfNotes(loadedNotes.length);
                this.appStore.appendNotesToList(loadedNotes);
            });
    });

    public remove(id: number): Observable<NoteUpdateResponse> {
        return this.http.delete<NoteUpdateResponse>(`/notes/${ id }`)
            .pipe(
                tap((response) => {
                    if (response.errors || !response.note) {
                        console.error(response.errors);
                        return;
                    }
                    this.adjustNotesForReviewCounter(id, 'decrement');
                    this.appStore.updateNote(id, { removedAt: response.note.removedAt });
                    this.appStore.decrementNotesOffsetCorrection();
                    if (response.tags) {
                        this.appStore.updateTagsList(response.tags);
                    }
                }),
            );
    }

    public restore(id: number): Observable<NoteUpdateResponse> {
        return this.updateNoteQuery(id, 'restore').pipe(
            tap((response) => {
                if (response.errors) {
                    console.error(response.errors);
                    return;
                }
                this.adjustNotesForReviewCounter(id, 'increment');
                this.appStore.updateNote(id, { removedAt: null });
                if (response.tags) {
                    this.appStore.updateTagsList(response.tags);
                }
            }),
            tap(() => this.appStore.incrementNotesOffsetCorrection()),
        );
    }

    public markAsReviewed(id: number): Observable<NoteUpdateResponse> {
        return this.updateNoteQuery(id, 'mark-as-reviewed').pipe(
            tap((response) => {
                if (response.errors || !response.note) {
                    console.error(response.errors);
                    return;
                }
                this.adjustNotesForReviewCounter(id, 'decrement');
                if (this.appStore.dashboard.notesType() === 'for-review') {
                    this.appStore.removeTagsFromList(response.tags ?? []);
                    this.removeNoteFromList(id);
                } else {
                    this.appStore.updateNote(id, {
                        reviewsLeft: response.note.reviewsLeft,
                        nextReviewAt: response.note.nextReviewAt,
                        reviewedAt: response.note.reviewedAt,
                    });
                }
            }),
        );
    }

    public cancelReviews(id: number): Observable<NoteUpdateResponse> {
        return this.updateNoteQuery(id, 'cancel-reviews').pipe(
            tap((response) => {
                if (response.errors || !response.note) {
                    console.error(response.errors);
                    return;
                }
                this.adjustNotesForReviewCounter(id, 'decrement');
                if (this.appStore.dashboard.notesType() === 'for-review') {
                    this.appStore.removeTagsFromList(response.tags ?? []);
                    this.removeNoteFromList(id);
                } else {
                    this.appStore.updateNote(id, {
                        reviewsLeft: response.note.reviewsLeft,
                        nextReviewAt: response.note.nextReviewAt,
                    });
                }
            }),
        );
    }

    public resetReviews(id: number): Observable<NoteUpdateResponse> {
        return this.updateNoteQuery(id, 'reset-reviews').pipe(
            tap((response) => {
                if (response.errors || !response.note) {
                    console.error(response.errors);
                    return;
                }
                this.appStore.updateNote(id, { reviewsLeft: response.note.reviewsLeft });
            }),
        );
    }

    private getNotes(tagIds: number[], searchTerm: string, notesType: string, offset?: number): Observable<Note[]> {
        this.appStore.setNotesLoading(true);

        const url = notesType === 'for-review'
            ? '/notes/for-review'
            : '/notes';

        let params = new HttpParams();
        params = params.append('limit', this.notesPerPage.toString());
        if (searchTerm)
            params = params.append('searchTerm', searchTerm);
        if (offset)
            params = params.append('offset', (offset + this.appStore.notes.notesOffsetCorrection()).toString());
        tagIds.forEach(id => {
            params = params.append('tagIds[]', id.toString());
        });

        return this.http.get<Note[]>(url, { params }).pipe(
            finalize(() => this.appStore.setNotesLoading(false)),
        );
    }

    public createNoteQuery(body: NoteManipulationBody): Observable<NoteUpdateResponse> {
        return this.http.post<NoteUpdateResponse>('/notes', body);
    }

    public updateNoteQuery(id: number, route: string | null, body?: NoteManipulationBody): Observable<NoteUpdateResponse> {
        const url = ['notes', route, id].join('/').replace('//', '/');
        return this.http.patch<NoteUpdateResponse>(`/${ url }`, body);
    }

    private removeNoteFromList(id: number): void {
        this.appStore.removeNoteFromList(id);
        this.appStore.decrementNotesOffsetCorrection();
    }

    private controlEndOfNotes(notesLength: number): void {
        this.appStore.setAllNotesLoaded(notesLength < this.notesPerPage);
    }

    private calcOffset(): number {
        return this.appStore.dashboard.page() * this.notesPerPage - this.notesPerPage;
    }

    private loadNotesForReviewCounter(): void {
        this.http.get<number>('/notes/count-for-review').subscribe((counter) => {
            this.appStore.setNotesForReviewCounter(counter);
        });
    }

    private adjustNotesForReviewCounter(id: number, action: 'decrement' | 'increment'): void {
        const note = this.appStore.notes.list().find(note => note.id === id);
        if (!note) return;
        if (note.nextReviewAt === null || note.reviewsLeft < 1 || new Date(note.nextReviewAt) > new Date()) return;

        if (action === 'decrement' && note.removedAt === null) {
            this.appStore.decrementNotesForReviewCounter();
        } else if (action === 'increment') {
            this.appStore.incrementNotesForReviewCounter();
        }
    }

}
