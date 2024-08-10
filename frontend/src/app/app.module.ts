// Import necessary modules and components
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClientXsrfModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common'; // Import DatePipe

import { HttpErrorInterceptor } from './http-error.interceptor';
import { CsrfInterceptor } from './csrf.interceptor';
import { AuthInterceptor } from './auth.interceptor';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Import Angular Material modules
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';

// Import your components
import { AddRaceDialogComponent } from './add-race-dialog/add-race-dialog.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { EditRaceDialogComponent } from './edit-race-dialog/edit-race-dialog.component';
import { HomeComponent } from './home/home.component';
import { MyRacesComponent } from './my-races/my-races.component';
import { FindRaceComponent } from './find-race/find-race.component';
import { DurationPickerDirective } from './duration-picker.directive';
import { WishlistComponent } from './wishlist/wishlist.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { RaceDetailsDialogComponent } from './race-details-dialog/race-details-dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    AddRaceDialogComponent,
    LoginComponent,
    RegisterComponent,
    EditRaceDialogComponent,
    HomeComponent,
    MyRacesComponent,
    FindRaceComponent,
    DurationPickerDirective,
    WishlistComponent,
    SidenavComponent,
    RaceDetailsDialogComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    MatChipsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatGridListModule,
    MatInputModule,
    MatProgressBarModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSidenavModule,
    MatTableModule,
    MatListModule,
    MatPaginatorModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'csrftoken',
      headerName: 'X-CSRFToken',
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: CsrfInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    DatePipe, // Add DatePipe to providers
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
