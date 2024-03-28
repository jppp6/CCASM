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

    checkLoggedIn(): boolean {
        const token = localStorage.getItem(this.authSecretKey);
        // this.ccasmService.refreshToken(key).subscribe((res) => {
        //     console.log(res);
        // });
        if (!token) {
            this.isLoggedIn = false;
        } else {
            const decodedToken = jwtDecode(token);
            const currentTime = Math.floor(Date.now() / 1000);
            // Check if token is expired
            if (decodedToken.exp && decodedToken.exp < currentTime) {
                // Token is expired
                this.isLoggedIn = false;
            } else {
                this.isLoggedIn = true;
            }
        }
        return this.isLoggedIn;
    }
}
