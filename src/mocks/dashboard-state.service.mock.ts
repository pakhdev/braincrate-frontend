import { BehaviorSubject } from 'rxjs';

import { dashboardStateMock } from './dashboard-state.mock';
import { DashboardState } from '../app/dashboard/interfaces/dashboard-state.interface';

export const dashboardStateServiceMock = {
    dashboardState$: new BehaviorSubject<DashboardState>({ ...dashboardStateMock }),
    dashboardState: { ...dashboardStateMock },
    selectedTags: [1, 2],
    selectedSection: 'all',
    setState: (state: Partial<DashboardState>) => { },
};