import { Component, inject } from '@angular/core';
import { AuthService } from 'src/app/core/auth/auth.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
    view: 'requests' | 'deposits' | 'collection' | 'add' | 'select' = 'select';

    private authService = inject(AuthService);

    logout(): void {
        this.authService.logout();
    }
}
