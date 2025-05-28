import { computed } from '@angular/core';
import { StateSignals } from '@ngrx/signals';
import { AppState } from '../app-state.interface';
import { Tag } from '../../../dashboard/interfaces/tag.interface';

export function tagsComputed(store: StateSignals<AppState>) {
    const selectedTags = computed(() =>
        store.tags.list()
            .filter(tag => store.dashboard.selectedTags().includes(tag.id))
            .sort((a, b) => b.notesCount - a.notesCount),
    );
    const notSelectedTags = computed((): Tag[] =>
        store.tags.list()
            .filter(tag => !store.dashboard.selectedTags().includes(tag.id))
            .sort((a, b) => b.notesCount - a.notesCount),
    );
    
    return {
        selectedTags,
        notSelectedTags,
    };
}
