import { AppComponent } from './app.component';
import { AboutComponent } from './pages/about/about.component';
import { AdminComponent } from './pages/admin/admin.component';
import { AdminCollectionComponent } from './pages/admin/dashboard/admin-collection/admin-collection.component';
import { AdminDepositsComponent } from './pages/admin/dashboard/admin-deposits/admin-deposits.component';
import { AdminRequestsComponent } from './pages/admin/dashboard/admin-requests/admin-requests.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { BrowseComponent } from './pages/browse/browse.component';
import { ComplexSearchComponent } from './pages/browse/complex-search/complex-search.component';
import { SimpleSearchComponent } from './pages/browse/simple-search/simple-search.component';
import { CartComponent } from './pages/cart/cart.component';
import { DepositComponent } from './pages/deposit/deposit.component';
import { HomeComponent } from './pages/home/home.component';
import { PageNotFoundComponent } from './pages/notfound/notfound.component';
import { StatisticsComponent } from './pages/statistics/statistics.component';

import { ToTitleCasePipe } from './core/utils/titlecase.pipe';
import { StrainDetailsDialog } from './pages/browse/strain-details/strain-details.component';

import { HttpClientModule } from '@angular/common/http';
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
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTreeModule } from '@angular/material/tree';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AdminEditComponent } from './pages/admin/dashboard/admin-edit/admin-edit.component';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        BrowseComponent,
        StatisticsComponent,
        DepositComponent,
        CartComponent,
        AdminComponent,
        PageNotFoundComponent,
        AboutComponent,
        ComplexSearchComponent,
        SimpleSearchComponent,
        StrainDetailsDialog,
        ToTitleCasePipe,
        DashboardComponent,
        AdminRequestsComponent,
        AdminDepositsComponent,
        AdminCollectionComponent,
        AdminEditComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        MatProgressSpinnerModule,
        MatCheckboxModule,
        BrowserAnimationsModule,
        MatButtonModule,
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
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
