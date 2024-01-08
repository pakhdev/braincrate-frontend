import { of, pairwise } from 'rxjs';

import { dashboardStateMock } from './dashboard-state.mock';
import { DashboardState } from '../app/dashboard/interfaces/dashboard-state.interface';

export const dashboardStateServiceMock = {
    dashboardState$: of([{ ...dashboardStateMock }]).pipe(pairwise()),
    dashboardState: { ...dashboardStateMock },
    selectedTags: [1, 2],
    selectedSection: 'all',
    setState: (state: Partial<DashboardState>) => { },
};