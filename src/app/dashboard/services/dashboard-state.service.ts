import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, filter } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';

import { DashboardState } from '../interfaces/dashboard-state.interface';

@Injectable({
    providedIn: 'root',
})
export class DashboardStateService {

    private readonly router = inject(Router);
    public dashboardState$: BehaviorSubject<DashboardState> = new BehaviorSubject<DashboardState>({
        selectedTags: [0],
        searchWord: '',
        notesType: '',
        page: 0,
    });

    constructor() {
        this.subscribeToRouter();
        this.subscribeToState();
    }

    public get dashboardState(): DashboardState {
        return this.dashboardState$.value;
    }

    public setState(state: Partial<DashboardState>): void {
        if (state.notesType) {
            this.dashboardState$.next({
                selectedTags: [],
                searchWord: state.searchWord ? state.searchWord : '',
                notesType: state.notesType,
                page: 1,
            });
        } else {
            this.dashboardState$.next({
                ...this.dashboardState$.value,
                ...state,
            });
        }
    }

    public nextPage(): void {
        this.setState({
            page: this.dashboardState$.value.page + 1,
        });
    }

    get selectedTags(): number[] {
        return this.dashboardState$.value.selectedTags;
    }

    get selectedSection(): string {
        return this.dashboardState$.value.notesType;
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
        if (url !== '/dashboard/all' && url !== '/dashboard' && this.dashboardState.notesType === 'all') {
            this.router.navigate(['dashboard/all'], { queryParams });
        } else if (url !== '/dashboard/for-review' && this.dashboardState$.value.notesType === 'for-review') {
            this.router.navigate(['dashboard/for-review'], { queryParams });
        }
    }
}
