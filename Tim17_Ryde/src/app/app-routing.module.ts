import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateDriverComponent } from './components/create-driver/create-driver.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { MainComponent } from './components/main/main.component';
import { UnregisteredUserComponent } from './components/unregistered-user/unregistered-user.component';
import { AdminMainComponent } from './components/admin-main/admin-main.component';
import { LoginGuard } from './guard/login.guard';
import { DriverRideHistoryComponent } from './components/driver-ride-history/driver-ride-history.component';
import { DriverProfileComponent } from './components/driver-profile/driver-profile.component';
import { DriverMainComponent } from './components/driver-main/driver-main.component';
import { StatisticsComponent } from './components/statistics-component/statistics.component';
import { AdminStatisticsComponent } from './components/admin-statistics/admin-statistics.component';
import { PassengerProfileComponent } from './components/passenger-profile/passenger-profile.component';

const routes: Routes = [
  {path: '', component:MainComponent},
  {path: 'login', component:LoginComponent,
  canActivate: [LoginGuard],
  loadChildren: () =>
    import('../app/services/auth/auth.module').then((m) => m.AuthModule),},
  {path: 'register', component:RegisterComponent,
  canActivate: [LoginGuard],
  loadChildren: () =>
    import('../app/services/auth/auth.module').then((m) => m.AuthModule),},
  {path: 'createDriver', component:CreateDriverComponent},
  {path: 'get-started', component:UnregisteredUserComponent},
  {path: 'home', component:MainComponent},
  {path: 'admin-main', component:AdminMainComponent},
  {path: 'driver-ride-history/:driverId', component:DriverRideHistoryComponent},
  {path: 'driver-profile/:driverId', component:DriverProfileComponent},
  {path: 'driver-main', component:DriverMainComponent},
  {path: 'statistics', component:StatisticsComponent},
  {path: 'admin-statistics', component:AdminStatisticsComponent},
  {path: 'passenger-profile', component:PassengerProfileComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
