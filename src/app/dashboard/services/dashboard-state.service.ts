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

    public setState(state: Partial<DashboardState>) {
        if (state.notesType) {
            this.dashboardState.set({
                selectedTags: [],
                searchWord: '',
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

    get selectedTags(): number[] {
        return this.dashboardState().selectedTags;
    }

    get selectedSection(): string {
        return this.dashboardState().notesType;
    }

}
