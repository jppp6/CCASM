import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard = (): boolean => {
    const router = inject(Router);
    const service = inject(AuthService);

    if (service.checkLoggedIn()) {
        return true;
    } else {
        // Redirect to the login page
        router.navigateByUrl('/login');
        return false;
    }
};
