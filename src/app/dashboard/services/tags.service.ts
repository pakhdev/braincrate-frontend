import { computed, effect, inject, Injectable } from '@angular/core';
import { catchError, finalize, Observable, throwError } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Tag } from '../interfaces/tag.interface';
import { AppStore } from '../../shared/store/app.store';

@Injectable({ providedIn: 'root' })
export class TagsService {
    private readonly appStore = inject(AppStore);
    private readonly http = inject(HttpClient);
    private readonly tagsUrl = computed(() =>
        this.appStore.dashboard.notesType() === 'for-review' ? '/tags/subtags-for-review' : '/tags',
    );

    public getTags(parentTagIds: number[], searchWord: string, notesType: string): Observable<Tag[]> {
        this.appStore.setTagsLoading(true);

        let params = new HttpParams();
        if (searchWord)
            params = params.append('searchTerm', searchWord);
        parentTagIds.forEach(id => {
            params = params.append('parentTagIds[]', id.toString());
        });

        return this.http.get<Tag[]>(this.tagsUrl(), { params })
            .pipe(
                catchError(err => throwError(() => err.error.message)),
                finalize(() => this.appStore.setTagsLoading(false)),
            );
    }

}
