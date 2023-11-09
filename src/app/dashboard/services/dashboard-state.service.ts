import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { filter } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';

import { DashboardState } from '../interfaces/dashboard-state.interface';

@Injectable({
    providedIn: 'root',
})
export class DashboardStateService {

    private readonly router = inject(Router);
    public dashboardState: WritableSignal<DashboardState> = signal({
        selectedTags: [0],
        searchWord: '',
        notesType: '',
        page: 0,
    });
    private dashboardState$ = toObservable(this.dashboardState);

    constructor() {
        this.subscribeToRouter();
        this.subscribeToState();
    }

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

    private subscribeToRouter(): void {
        this.router.events
            .pipe(
                filter((event): event is NavigationEnd => event instanceof NavigationEnd),
            )
            .subscribe((event: NavigationEnd) => {
                this.manageSectionState(event.url);
            });
    }

    private shouldPreserveState(): boolean {
        const queryParams = this.router.routerState.snapshot.root.queryParams;
        const preserveStateParam = queryParams['preserveState'];
        return (preserveStateParam && preserveStateParam.toLowerCase() === 'true') ?? false;
    }

    private manageSectionState(url: string): void {
        if (this.shouldPreserveState()) return;

        url = url.split('?')[0];
        if ((url === '/dashboard/all' || url === '/dashboard') && this.selectedSection !== 'all') {
            this.setState({ notesType: 'all' });
        } else if (url === '/dashboard/for-review' && this.selectedSection !== 'for-review') {
            this.setState({ notesType: 'for-review' });
        }

    }

    private subscribeToState() {
        this.dashboardState$.subscribe((dashboardState) => {
            if (!dashboardState.notesType) return;
            this.synchronizeRouteWithState();
        });
    }

    private synchronizeRouteWithState(): void {
        const url = this.router.routerState.snapshot.url;
        const queryParams = { preserveState: 'true' };
        if (url !== '/dashboard/all' && url !== '/dashboard' && this.dashboardState().notesType === 'all') {
            this.router.navigate(['dashboard/all'], { queryParams });
        } else if (url !== '/dashboard/for-review' && this.dashboardState().notesType === 'for-review') {
            this.router.navigate(['dashboard/for-review'], { queryParams });
        }
    }
}
