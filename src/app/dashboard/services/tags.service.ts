import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { catchError, Observable, pairwise, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { toObservable } from '@angular/core/rxjs-interop';

import { environments } from '../../../environments/environment';
import { DashboardStateService } from './dashboard-state.service';
import { DashboardState } from '../interfaces/dashboard-state.interface';
import { Tag } from '../interfaces/tag.interface';
import { Note } from '../interfaces/note.interface';

@Injectable({
    providedIn: 'root',
})
export class TagsService {

    private readonly baseUrl: string = environments.baseUrl;
    private readonly http = inject(HttpClient);
    private readonly dashboardStateService = inject(DashboardStateService);
    private readonly dashboardState$ =
        toObservable(this.dashboardStateService.dashboardState).pipe(pairwise());

    public tags: WritableSignal<Tag[]> = signal([]);
    public isLoading: WritableSignal<boolean> = signal(false);

    constructor() {
        this.dashboardState$.subscribe(([previous, current]) => {
            if (this.isTagsLoadRequired(previous, current)) {
                this.getTags(
                    current.selectedTags,
                    current.searchWord,
                    current.notesType,
                ).subscribe((tags) => {
                    this.isLoading.set(false);
                    this.tags.set(tags);
                });
            }
        });
    }

    public getTags(parentTagIds: number[], searchWord: string, notesType: string): Observable<Tag[]> {
        this.isLoading.set(true);

        const url = notesType === 'for-review'
            ? `${ this.baseUrl }/tags/subtags-for-review`
            : `${ this.baseUrl }/tags`;

        const token = localStorage.getItem('token');
        const headers = new HttpHeaders()
            .set('Authorization', `Bearer ${ token }`);

        let params = new HttpParams();
        if (searchWord)
            params = params.append('searchTerm', searchWord);
        parentTagIds.forEach(id => {
            params = params.append('parentTagIds[]', id.toString());
        });

        return this.http.get<Tag[]>(url, { headers, params })
            .pipe(
                catchError(err => throwError(() => err.error.message)),
            );
    }

    private isTagsLoadRequired(previous: DashboardState, current: DashboardState) {
        if (previous.notesType !== current.notesType) return true;
        if (previous.searchWord !== current.searchWord) return true;

        const previousTagIds = previous.selectedTags.slice().sort();
        const currentTagIds = current.selectedTags.slice().sort();
        return JSON.stringify(previousTagIds) !== JSON.stringify(currentTagIds);
    }

    public updateTags(tagsToUpdate: Tag[]) {
        this.tags.update((existingTags) => {
            tagsToUpdate.forEach((tag) => {
                const existingTag = existingTags.find(existingTag => existingTag.id === tag.id);
                existingTag
                    ? existingTag.notesCount = tag.notesCount
                    : existingTags.push(tag);
            });
            return existingTags.filter(tag => tag.notesCount > 0);
        });
    }

    public decreaseTagsOfNote(note: Note) {
        const tagIdsForDecrease = note.tags.map(tag => tag.id);
        this.tags.update((existingTags) => {
            const processedTags = existingTags.map((tag) => {
                if (tagIdsForDecrease.includes(tag.id)) {
                    tag.notesCount -= 1;
                }
                return tag;
            });
            return processedTags.filter(tag => tag.notesCount > 0);
        });
        console.log(this.tags());
    }
}
