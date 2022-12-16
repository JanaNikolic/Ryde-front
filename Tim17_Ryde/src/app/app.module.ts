import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

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
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [

    AppComponent,
    LoginComponent,
    RegisterComponent,
    NavbarComponent,
    CreateDriverComponent,
    UnregisteredUserComponent,
    MainComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MaterialModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
