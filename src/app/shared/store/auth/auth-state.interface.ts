import { AuthStatus } from './enums/auth-status.enum';
import { AuthErrorMessage } from './interfaces/auth-error-message.interface';

export interface AuthState {
    id?: string;
    email?: string;
    hasPass?: boolean;
    hasGoogleAccount?: boolean;
    status: AuthStatus;
    errors: AuthErrorMessage[];
    isLoading: boolean;
}
