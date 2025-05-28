import { Tag } from '../../../dashboard/interfaces/tag.interface';
import { patchState } from '@ngrx/signals';
import { findTag, mergeTags } from './tags.utils';
import { AppState } from '../app-state.interface';
import { updateNested } from '../app.store';

export function tagsMethods(store: any) {
    return {
        setTagsList: (list: Tag[]): void => patchState(store,
            (state: AppState) => updateNested(state, 'tags', { list })),
        updateTagsList: (tagsToUpdate: Tag[]) => patchState(store,
            (state: AppState) => updateNested(state, 'tags', { list: mergeTags(store.tags.list(), tagsToUpdate) })),
        removeTagsFromList: (tagsToRemove: Tag[]) => patchState(store,
            (state: AppState) => updateNested(state, 'tags', { list: state.tags.list.filter(tag => !findTag(tagsToRemove, tag)) })),
        setTagsLoading: (isLoading: boolean): void => patchState(store,
            (state: AppState) => updateNested(state, 'tags', { isLoading })),
    };
}
