import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { RegisteredUserNavbarComponent } from './components/registered-user-navbar/registered-user-navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { AdminNavbarComponent } from './components/admin-navbar/admin-navbar.component';

@NgModule({
  declarations: [

    AppComponent,
    LoginComponent,
    RegisterComponent,
    NavbarComponent,
    RegisteredUserNavbarComponent,
    FooterComponent,
    AdminNavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
