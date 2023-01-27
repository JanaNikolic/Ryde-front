import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Interceptor } from './auth/interceptor/interceptor.interceptor';
import { CommonModule } from '@angular/common'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './components/register/register.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { RegisteredUserNavbarComponent } from './components/registered-user-navbar/registered-user-navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { AdminNavbarComponent } from './components/admin-navbar/admin-navbar.component';
import { CreateDriverComponent } from './components/create-driver/create-driver.component';
import { UnregisteredUserComponent } from './components/unregistered-user/unregistered-user.component';
import { MainComponent } from './components/main/main.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/app/material.module';
import { MapComponent } from './components/map/map/map.component';
import { HttpClientModule } from '@angular/common/http';
import { AdminMainComponent } from './components/admin-main/admin-main.component';
import { DriverRideHistoryComponent } from './components/driver-ride-history/driver-ride-history.component';
import { DriverProfileComponent } from './components/driver-profile/driver-profile.component';
import { DriverMainComponent } from './components/driver-main/driver-main.component';
import { AcceptRideComponent } from './components/accept-ride/accept-ride.component';
import { RejectRideComponent } from './components/reject-ride/reject-ride.component';
import { DriverNavbarComponent } from './components/driver-navbar/driver-navbar.component';
import { StatisticsComponent } from './components/statistics-component/statistics.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import { AdminStatisticsComponent } from './components/admin-statistics/admin-statistics.component';
import { PanicComponent } from './components/panic/panic.component';
import { PanicNotificationComponent } from './components/panic-notification/panic-notification.component';
import { PassengerProfileComponent } from './components/passenger-profile/passenger-profile.component';
import { EditPassengerComponent } from './components/edit-passenger/edit-passenger.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    NavbarComponent,
    RegisteredUserNavbarComponent,
    FooterComponent,
    CreateDriverComponent,
    UnregisteredUserComponent,
    MainComponent,
    MapComponent,
    AdminNavbarComponent,
    AdminMainComponent,
    DriverRideHistoryComponent,
    AdminNavbarComponent,
    DriverProfileComponent,
    DriverMainComponent,
    AcceptRideComponent,
    RejectRideComponent,
    DriverNavbarComponent,
    AdminStatisticsComponent,
    StatisticsComponent,
    PanicComponent,
    PanicNotificationComponent,
    PassengerProfileComponent,
    EditPassengerComponent,
    ChangePasswordComponent,
    ResetPasswordComponent
  ],
  imports: [
    AppRoutingModule,
    CommonModule,
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MaterialModule,
    HttpClientModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: Interceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
