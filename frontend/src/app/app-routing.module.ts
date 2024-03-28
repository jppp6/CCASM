import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { AboutComponent } from './pages/about/about.component';
import { DashboardComponent } from './pages/admin-dashboard/dashboard.component';
import { BrowseComponent } from './pages/browse/browse.component';
import { CartComponent } from './pages/cart/cart.component';
import { DepositComponent } from './pages/deposit/deposit.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { StatisticsComponent } from './pages/statistics/statistics.component';

const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'browse', component: BrowseComponent },
    { path: 'statistics', component: StatisticsComponent },
    { path: 'deposit', component: DepositComponent },
    { path: 'cart', component: CartComponent },

    { path: 'about', component: AboutComponent },
    { path: 'login', component: LoginComponent },
    { path: 'admin', component: DashboardComponent, canActivate: [authGuard] }, // only logged in can activate component

    { path: '**', redirectTo: '/home' }, // any errors, redirect to page not found
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
