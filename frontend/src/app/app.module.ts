import { AppComponent } from './app.component';
import { ComplexSearchComponent } from './components/complex-search/complex-search.component';
import { SimpleSearchComponent } from './components/simple-search/simple-search.component';
import { StrainDetailsDialog } from './components/strain-details/strain-details.component';
import { FooterComponent } from './core/footer/footer.component';
import { HeaderComponent } from './core/header/header.component';
import { ToTitleCasePipe } from './core/utils/titlecase.pipe';
import { AboutComponent } from './pages/about/about.component';
import { AdminComponent } from './pages/admin/admin.component';
import { BrowseComponent } from './pages/browse/browse.component';
import { CartComponent } from './pages/cart/cart.component';
import { ContactComponent } from './pages/contact/contact.component';
import { DepositComponent } from './pages/deposit/deposit.component';
import { FaqComponent } from './pages/faq/faq.component';
import { HomeComponent } from './pages/home/home.component';
import { PageNotFoundComponent } from './pages/notfound/notfound.component';
import { StatisticsComponent } from './pages/statistics/statistics.component';

import { HttpClientModule } from '@angular/common/http';
import { NgForm } from '@angular/forms';

import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTreeModule } from '@angular/material/tree';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    HomeComponent,
    BrowseComponent,
    StatisticsComponent,
    DepositComponent,
    CartComponent,
    AdminComponent,
    PageNotFoundComponent,
    FaqComponent,
    ContactComponent,
    AboutComponent,
    ComplexSearchComponent,
    SimpleSearchComponent,
    StrainDetailsDialog,
    ToTitleCasePipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDialogModule,
    MatToolbarModule,
    MatTreeModule,
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
