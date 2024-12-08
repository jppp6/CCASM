import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { CCASMService } from '../services/ccasm.services';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    isLoggedIn = false;

    private authSecretKey = 'Bearer Token';

    constructor(private ccasmService: CCASMService, private router: Router) {
        this.checkLoggedIn();
    }

    // Redirect to the login page
    login(username: string, password: string): void {
        this.ccasmService.login(username, password).subscribe((res) => {
            if (res.access) {
                localStorage.setItem(this.authSecretKey, res.access);
                this.isLoggedIn = true;
                this.router.navigateByUrl('/admin');
            }
        });
    }

    logout(): void {
        localStorage.removeItem(this.authSecretKey);
        this.isLoggedIn = false;
        // this.router.navigateByUrl('/login');
        this.router.navigateByUrl('/home');
    }

    checkLoggedIn(): void {
        const token = localStorage.getItem(this.authSecretKey);

        if (!token) {
            this.logout();
        } else {
            const decodedToken = jwtDecode(token);
            const currentTime = Math.floor(Date.now() / 1000);

            if (decodedToken.exp && decodedToken.exp < currentTime) {
                this.logout();
                this.ccasmService.refreshToken(token).subscribe((newToken) => {
                    localStorage.setItem(this.authSecretKey, newToken);
                    this.isLoggedIn = true;
                    this.router.navigateByUrl('/admin');
                });
            } else {
                this.isLoggedIn = true;
            }
        }
    }
}
