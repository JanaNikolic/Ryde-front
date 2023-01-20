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
import { CreateRideComponent } from './components/create-ride/create-ride.component';

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
  {path: 'get-ryde', component:CreateRideComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
