import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { toObservable } from '@angular/core/rxjs-interop';
import { finalize, Observable, tap } from 'rxjs';

import { DashboardStateService } from './dashboard-state.service';
import { Note } from '../interfaces/note.interface';
import { NoteUpdateResponse } from '../interfaces/note-update-response.interface';
import { TagsService } from './tags.service';
import { NoteManipulationBody } from '../interfaces/note-manipulation-body.interface';

@Injectable({
    providedIn: 'root',
})
export class NotesService {

    private readonly http = inject(HttpClient);
    private readonly tagsService = inject(TagsService);
    private readonly dashboardStateService = inject(DashboardStateService);
    private readonly dashboardState$ = toObservable(this.dashboardStateService.dashboardState);
    private readonly notesPerPage = 15;

    public notesList: WritableSignal<Note[]> = signal([]);
    public isLoading: WritableSignal<boolean> = signal(false);
    public allNotesLoaded: WritableSignal<boolean> = signal(false);
    public countNotesForReview: WritableSignal<number> = signal(0);
    public notesOffsetCorrection: WritableSignal<number> = signal(0);

    constructor() {
        this.subscribeToDashboardState();
    }

    public remove(id: number): Observable<NoteUpdateResponse> {
        return this.removeNoteQuery(id).pipe(
            tap((response) => {
                if (response.errors || !response.note) {
                    console.error(response.errors);
                    return;
                }
                this.calcNotesForReviewCounter(id, 'decrement');
                this.updateNoteList(id, {
                    removedAt: response.note.removedAt,
                });
                this.notesOffsetCorrection.update(offsetCorrection => offsetCorrection - 1);
                if (response.tags) {
                    this.tagsService.updateTags(response.tags);
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
                this.calcNotesForReviewCounter(id, 'increment');
                this.updateNoteList(id, {
                    removedAt: null,
                });
                if (response.tags) {
                    this.tagsService.updateTags(response.tags);
                }
            }),
            tap(() => {
                this.notesOffsetCorrection.update(offsetCorrection => offsetCorrection + 1);
            }),
        );
    }

    public markAsReviewed(id: number): Observable<NoteUpdateResponse> {
        return this.updateNoteQuery(id, 'mark-as-reviewed').pipe(
            tap((response) => {
                if (response.errors || !response.note) {
                    console.error(response.errors);
                    return;
                }
                this.calcNotesForReviewCounter(id, 'decrement');
                if (this.dashboardStateService.dashboardState().notesType === 'for-review') {
                    this.tagsService.removeTagsFromList(response.tags);
                    this.removeNoteFromList(id);
                } else {
                    console.log('set', response.note.nextReviewAt);
                    this.updateNoteList(id, {
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
                this.calcNotesForReviewCounter(id, 'decrement');
                if (this.dashboardStateService.dashboardState().notesType === 'for-review') {
                    this.tagsService.removeTagsFromList(response.tags);
                    this.removeNoteFromList(id);
                } else {
                    this.updateNoteList(id, {
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
                this.updateNoteList(id, { reviewsLeft: response.note.reviewsLeft });
            }),
        );
    }

    private getNotes(tagIds: number[], searchWord: string, notesType: string, offset?: number): Observable<Note[]> {

        this.isLoading.set(true);

        const url = notesType === 'for-review'
            ? '/notes/for-review'
            : '/notes';

        let params = new HttpParams();
        params = params.append('limit', this.notesPerPage.toString());
        if (searchWord)
            params = params.append('searchTerm', searchWord);
        if (offset)
            params = params.append('offset', (offset + this.notesOffsetCorrection()).toString());
        tagIds.forEach(id => {
            params = params.append('tagIds[]', id.toString());
        });

        return this.http.get<Note[]>(url, { params }).pipe(
            finalize(() => this.isLoading.set(false)),
        );
    }

    public createNoteQuery(body: NoteManipulationBody): Observable<NoteUpdateResponse> {
        return this.http.post<NoteUpdateResponse>('/notes', body);
    }

    public updateNoteQuery(id: number, route: string | null, body?: NoteManipulationBody): Observable<NoteUpdateResponse> {
        const url = ['notes', route, id].join('/').replace('//', '/');
        console.log(url);
        return this.http.patch<NoteUpdateResponse>(`/${ url }`, body);
    }

    private removeNoteQuery(id: number): Observable<NoteUpdateResponse> {
        return this.http.delete<NoteUpdateResponse>(`/notes/${ id }`);
    }

    public prependNoteToList(note: Note): void {
        this.notesList.update(notes => [note, ...notes]);
    }

    public updateNoteList(id: number, properties: Partial<Note>) {
        this.notesList.update(notes => {
            const note = notes.find(note => note.id === id);
            if (!note) return notes;
            return notes.map(note => note.id === id ? { ...note, ...properties } : note);
        });
    }

    private removeNoteFromList(id: number): void {
        this.notesList.update(notes => notes.filter(note => note.id !== id));
        this.notesOffsetCorrection.update(offsetCorrection => offsetCorrection - 1);
    }

    private controlEndOfNotes(notesLength: number): void {
        this.allNotesLoaded.set(notesLength < this.notesPerPage);
    }

    private calcOffset(): number {
        const page = this.dashboardStateService.dashboardState().page;
        return page * this.notesPerPage - this.notesPerPage;
    }

    private loadNotesForReviewCounter(): void {
        this.http.get<number>('/notes/count-for-review').subscribe((counter) => {
            this.countNotesForReview.set(counter);
        });
    }

    private calcNotesForReviewCounter(id: number, action: 'decrement' | 'increment'): void {
        const note = this.notesList().find(note => note.id === id);
        if (!note) return;
        if (note.nextReviewAt === null || note.reviewsLeft < 1 || new Date(note.nextReviewAt) > new Date()) return;

        if (action === 'decrement' && note.removedAt === null) {
            this.countNotesForReview.update(counter => counter > 0 ? counter - 1 : 0);
        } else if (action === 'increment') {
            this.countNotesForReview.update(counter => counter + 1);
        }
    }

    private subscribeToDashboardState(): void {
        this.dashboardState$.subscribe((dashboardState) => {
            if (!dashboardState.notesType) return;

            if (dashboardState.page === 1) {
                this.notesOffsetCorrection.set(0);
                if (dashboardState.notesType === 'all') this.loadNotesForReviewCounter();
                this.getNotes(dashboardState.selectedTags, dashboardState.searchWord, dashboardState.notesType)
                    .subscribe((notes) => {
                        this.controlEndOfNotes(notes.length);
                        this.notesList.set(notes);
                    });
            } else {
                this.getNotes(dashboardState.selectedTags, dashboardState.searchWord, dashboardState.notesType, this.calcOffset())
                    .subscribe((loadedNotes) => {
                        this.controlEndOfNotes(loadedNotes.length);
                        this.notesList.update(existingNotes => [...existingNotes, ...loadedNotes]);
                    });
            }
        });
    }

}
