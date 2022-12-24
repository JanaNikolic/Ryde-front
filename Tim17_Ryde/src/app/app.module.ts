import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Interceptor } from './auth/interceptor/interceptor.interceptor';
import { CommonModule } from '@angular/common'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { CreateDriverComponent } from './components/create-driver/create-driver.component';
import { UnregisteredUserComponent } from './components/unregistered-user/unregistered-user.component';
import { MainComponent } from './components/main/main.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/app/material.module';
import { MapComponent } from './components/map/map/map.component';
import { HttpClientModule } from '@angular/common/http';
import { AdminMainComponent } from './components/admin-main/admin-main.component';



@NgModule({
  declarations: [

    AppComponent,
    LoginComponent,
    RegisterComponent,
    NavbarComponent,
    CreateDriverComponent,
    UnregisteredUserComponent,
    MainComponent,
    MapComponent,
    AdminMainComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MaterialModule,
    HttpClientModule,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS,
      useClass: Interceptor,
      multi: true,}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
