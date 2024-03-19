import { AppComponent } from './app.component';
import { AboutComponent } from './pages/about/about.component';
import { AdminCollectionComponent } from './pages/admin-dashboard/admin-collection/admin-collection.component';
import { AdminDepositsComponent } from './pages/admin-dashboard/admin-deposits/admin-deposits.component';
import { AdminRequestsComponent } from './pages/admin-dashboard/admin-requests/admin-requests.component';
import { DashboardComponent } from './pages/admin-dashboard/dashboard.component';
import { BrowseComponent } from './pages/browse/browse.component';
import { ComplexSearchComponent } from './pages/browse/complex-search/complex-search.component';
import { SimpleSearchComponent } from './pages/browse/simple-search/simple-search.component';
import { CartComponent } from './pages/cart/cart.component';
import { DepositComponent } from './pages/deposit/deposit.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { StatisticsComponent } from './pages/statistics/statistics.component';

import { StrainDetailsDialog } from './pages/browse/strain-details/strain-details.component';

import {
    HTTP_INTERCEPTORS,
    HttpClientModule,
    HttpClientXsrfModule,
} from '@angular/common/http';

import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTreeModule } from '@angular/material/tree';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { HeadersInterceptor } from './core/auth/headers.interceptor';
import { AdminAddComponent } from './pages/admin-dashboard/admin-add/admin-add.component';
import { AdminEditComponent } from './pages/admin-dashboard/admin-edit/admin-edit.component';
import { AdminComponent } from './pages/admin/admin.component';
import { TermsComponent } from './pages/cart/terms/terms.component';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        BrowseComponent,
        StatisticsComponent,
        DepositComponent,
        CartComponent,
        LoginComponent,
        AdminComponent,
        AboutComponent,
        ComplexSearchComponent,
        SimpleSearchComponent,
        StrainDetailsDialog,
        DashboardComponent,
        AdminRequestsComponent,
        AdminDepositsComponent,
        AdminCollectionComponent,
        TermsComponent,
        AdminEditComponent,
        AdminAddComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        MatProgressSpinnerModule,
        MatCheckboxModule,
        BrowserAnimationsModule,
        MatButtonModule,
        MatTabsModule,
        MatIconModule,
        MatChipsModule,
        MatTableModule,
        MatMenuModule,
        MatExpansionModule,
        MatSelectModule,
        MatDialogModule,
        MatToolbarModule,
        MatTreeModule,
        MatSortModule,
        MatCheckboxModule,
        FormsModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatInputModule,
        MatCardModule,
        MatFormFieldModule,
        MatButtonToggleModule,
        MatRadioModule,
        MatDividerModule,
        ReactiveFormsModule,
        HttpClientModule,
        HttpClientXsrfModule.withOptions({
            cookieName: 'csrftoken',
            headerName: 'X-CSRFTOKEN',
        }),
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HeadersInterceptor,
            multi: true,
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
