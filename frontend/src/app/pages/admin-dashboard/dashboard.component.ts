import { Component } from '@angular/core';
import { AuthService } from 'src/app/core/auth/auth.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
    view: 'requests' | 'deposits' | 'collection' | 'add' | 'select' = 'select';

    constructor(private authService: AuthService) {}

    logout(): void {
        this.authService.logout();
    }
}
