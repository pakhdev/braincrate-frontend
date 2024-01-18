import { of } from 'rxjs';

export const routerMock = {
    url: '/dashboard/all',
    events: of({}),
    routerState: {
        snapshot: {
            url: '/dashboard/all',
            root: {
                queryParams: {
                    preserveState: 'true',
                },
            },
        },
    },
    navigate: jasmine.createSpy('navigate').and.returnValue(Promise.resolve(true)),
    navigateByUrl: jasmine.createSpy('navigateByUrl').and.returnValue(Promise.resolve(true)),
};