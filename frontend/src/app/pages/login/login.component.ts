import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/auth/auth.service';

@Component({
    selector: 'app-admin',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
})
export class LoginComponent {
    loginForm = new FormGroup({
        username: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required),
    });

    constructor(private authService: AuthService) {}

    login() {
        if (!this.loginForm.valid) {
            return;
        }
        if (this.loginForm.value.username && this.loginForm.value.password) {
            this.authService.login(
                this.loginForm.value.username,
                this.loginForm.value.password
            );
        }
    }
}
