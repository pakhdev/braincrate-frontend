import { AuthState } from './auth-state.interface';
import { AuthStatus } from './enums/auth-status.enum';

export const authState: AuthState = {
    id: undefined,
    email: undefined,
    hasPass: false,
    hasGoogleAccount: false,
    status: AuthStatus.notAuthenticated,
    errors: [],
    isLoading: false,
};
