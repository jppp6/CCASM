import { AppComponent } from './app.component';
import { HeadersInterceptor } from './core/auth/headers.interceptor';
import { AboutComponent } from './pages/about/about.component';
import { AdminAddComponent } from './pages/admin-dashboard/admin-add/admin-add.component';
import { AdminCollectionComponent } from './pages/admin-dashboard/admin-collection/admin-collection.component';
import { AdminDepositsComponent } from './pages/admin-dashboard/admin-deposits/admin-deposits.component';
import { AdminEditComponent } from './pages/admin-dashboard/admin-edit/admin-edit.component';
import { AdminRequestsComponent } from './pages/admin-dashboard/admin-requests/admin-requests.component';
import { DashboardComponent } from './pages/admin-dashboard/dashboard.component';
import { BrowseComponent } from './pages/browse/browse.component';
import { ComplexSearchComponent } from './pages/browse/complex-search/complex-search.component';
import { SimpleSearchComponent } from './pages/browse/simple-search/simple-search.component';
import { StrainDetailsDialog } from './pages/browse/strain-details/strain-details.component';
import { CartStrainDialogueComponent } from './pages/cart/cart-strain-dialogue/cart-strain-dialogue.component';
import { CartComponent } from './pages/cart/cart.component';
import { TermsComponent } from './pages/cart/terms/terms.component';
import { DepositComponent } from './pages/deposit/deposit.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { StatisticsComponent } from './pages/statistics/statistics.component';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
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
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTreeModule } from '@angular/material/tree';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxEchartsModule } from 'ngx-echarts';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        BrowseComponent,
        StatisticsComponent,
        DepositComponent,
        CartComponent,
        LoginComponent,
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
        CartStrainDialogueComponent,
    ],
    imports: [
        BrowserModule,
        MatSnackBarModule,
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
        NgxEchartsModule.forRoot({
            echarts: () => import('echarts'),
        }),
        MatPaginatorModule,
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
