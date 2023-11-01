import { Injectable, signal, WritableSignal } from '@angular/core';

import { DashboardState } from '../interfaces/dashboard-state.interface';

@Injectable({
    providedIn: 'root',
})
export class DashboardStateService {

    public dashboardState: WritableSignal<DashboardState> = signal({
        selectedTags: [0],
        searchWord: '',
        notesType: '',
        page: 0,
    });

    public setState(state: Partial<DashboardState>): void {
        if (state.notesType) {
            this.dashboardState.set({
                selectedTags: [],
                searchWord: state.searchWord ? state.searchWord : '',
                notesType: state.notesType,
                page: 1,
            });
        } else {
            this.dashboardState.set({
                ...this.dashboardState(),
                ...state,
            });
        }
    }

    public nextPage(): void {
        this.setState({
            page: this.dashboardState().page + 1,
        });
    }

    get selectedTags(): number[] {
        return this.dashboardState().selectedTags;
    }

    get selectedSection(): string {
        return this.dashboardState().notesType;
    }

}
