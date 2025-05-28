import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { AppStore } from '../../../../shared/store/app.store';

@Component({
    standalone: true,
    selector: 'search-notes',
    templateUrl: './search-notes.component.html',
})
export class SearchNotesComponent implements OnInit {
    @ViewChild('searchInput') private readonly searchInput: ElementRef | undefined;
    private readonly appStore = inject(AppStore);

    public searchNotes(): void {
        const inputValue = this.searchInput?.nativeElement.value;
        const searchNotesTerm = this.appStore.dashboard.searchNotesTerm();
        if (inputValue === searchNotesTerm) return;
        this.appStore.setSearchNotesTerm(inputValue);
    }

    ngOnInit(): void {
        if (this.searchInput && !this.appStore.dashboard.searchNotesTerm())
            this.searchInput.nativeElement.value = '';
    }
}
