import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { catchError, finalize, Observable, pairwise, startWith, throwError } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

import { DashboardStateService } from './dashboard-state.service';
import { DashboardState } from '../interfaces/dashboard-state.interface';
import { Tag } from '../interfaces/tag.interface';

@Injectable({
    providedIn: 'root',
})
export class TagsService {

    private readonly http = inject(HttpClient);
    private readonly dashboardStateService = inject(DashboardStateService);
    private readonly dashboardState$ =
        this.dashboardStateService.dashboardState$.pipe(
            startWith(this.dashboardStateService.dashboardState$.value), pairwise(),
        );

    public tags: WritableSignal<Tag[]> = signal([]);
    public isLoading: WritableSignal<boolean> = signal(false);

    constructor() {
        this.subscribeToDashboardState();
    }

    get selectedTags(): Tag[] {
        return this.tags()
            .filter(tag => this.dashboardStateService.selectedTags.includes(tag.id))
            .sort((a, b) => b.notesCount - a.notesCount);
    }

    get notSelectedTags(): Tag[] {
        return this.tags()
            .filter(tag => !this.dashboardStateService.selectedTags.includes(tag.id))
            .sort((a, b) => b.notesCount - a.notesCount);
    }

    public getTags(parentTagIds: number[], searchWord: string, notesType: string): Observable<Tag[]> {
        this.isLoading.set(true);

        const url = notesType === 'for-review'
            ? '/tags/subtags-for-review'
            : '/tags';

        let params = new HttpParams();
        if (searchWord)
            params = params.append('searchTerm', searchWord);
        parentTagIds.forEach(id => {
            params = params.append('parentTagIds[]', id.toString());
        });

        return this.http.get<Tag[]>(url, { params })
            .pipe(
                catchError(err => throwError(() => err.error.message)),
                finalize(() => this.isLoading.set(false)),
            );
    }

    private isTagsLoadRequired(previous: DashboardState, current: DashboardState): boolean {
        if (previous.notesType !== current.notesType) return true;
        if (previous.searchWord !== current.searchWord) return true;

        const previousTagIds = previous.selectedTags.slice().sort();
        const currentTagIds = current.selectedTags.slice().sort();
        return JSON.stringify(previousTagIds) !== JSON.stringify(currentTagIds);
    }

    public updateTags(tagsToUpdate: Tag[]): void {
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

    public removeTagsFromList(tags: Tag[] | null): void {
        if (!tags) return;
        this.tags.update((existingTags) => {
            const tagIdsToRemove = tags.map(tag => tag.id);
            return existingTags.filter(tag => !tagIdsToRemove.includes(tag.id));
        });
    }

    private subscribeToDashboardState(): void {
        this.dashboardState$.subscribe(([previous, current]) => {
            if (this.isTagsLoadRequired(previous, current)) {
                this.getTags(
                    current.selectedTags,
                    current.searchWord,
                    current.notesType,
                ).subscribe((tags) => {
                    this.tags.set(tags);
                });
            }
        });
    }

}
