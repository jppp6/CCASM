import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CCASMService } from '../services/ccasm.services';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    isLoggedIn = false;

    private authSecretKey = 'Bearer Token';

    constructor(private ccasmService: CCASMService, private router: Router) {
        this.isLoggedIn = !!localStorage.getItem(this.authSecretKey);
    }

    // Redirect to the login page
    login(username: string, password: string): string | void {
        this.ccasmService.login(username, password).subscribe((res) => {
            localStorage.setItem(this.authSecretKey, res.access);
            this.isLoggedIn = true;
            this.router.navigateByUrl('/admin');
        });
    }

    logout(): void {
        localStorage.removeItem(this.authSecretKey);
        this.isLoggedIn = false;
        this.router.navigateByUrl('/login');
    }
}
