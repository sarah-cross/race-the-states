/*
Defines client side routes for navigating within the app.
Maps URLs to Angular components and handles navigation
within the single-page application
*/

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { MyRacesComponent } from './my-races/my-races.component';
import { FindRaceComponent } from './find-race/find-race.component';
import { WishlistComponent } from './wishlist/wishlist.component';

const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent }, // Ensure this is correctly pointing to LoginComponent
  { path: 'home', component: HomeComponent },
  { path: 'my-races', component: MyRacesComponent },
  { path: 'find-race', component: FindRaceComponent },
  { path: 'wishlist', component: WishlistComponent }, 
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirect to login page by default
  // Other routes for your application
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
