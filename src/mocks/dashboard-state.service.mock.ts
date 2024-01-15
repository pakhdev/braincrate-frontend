import { BehaviorSubject } from 'rxjs';

import { createDashboardStateMock } from './dashboard-state.mock';
import { DashboardState } from '../app/dashboard/interfaces/dashboard-state.interface';

export const createDashboardStateServiceMock = () => ({
    dashboardState$: new BehaviorSubject<DashboardState>({ ...createDashboardStateMock() }),
    get dashboardState() {
        return { ...createDashboardStateMock() };
    },
    selectedTags: [1, 2],
    selectedSection: 'all',
    setState: (state: Partial<DashboardState>) => { },
});