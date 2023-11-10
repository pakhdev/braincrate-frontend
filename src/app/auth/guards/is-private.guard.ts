import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';

import { AuthService } from '../services/auth.service';
import { AuthStatus } from '../enums/auth-status.enum';

export const isPrivateGuard: CanActivateFn = (): boolean => {
    const authService = inject(AuthService);
    return authService.authStatus() === AuthStatus.authenticated;
};
