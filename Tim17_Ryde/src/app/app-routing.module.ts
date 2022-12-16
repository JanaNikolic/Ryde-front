import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { MainComponent } from './components/main/main.component';
import { UnregisteredUserComponent } from './components/unregistered-user/unregistered-user.component';
import { AdminMainComponent } from './components/admin-main/admin-main.component';

const routes: Routes = [
  {path: '', component:MainComponent},
  {path: 'login', component:LoginComponent},
  {path: 'register', component:RegisterComponent},
  {path: 'get-started', component:UnregisteredUserComponent},
  {path: 'home', component:MainComponent},
  {path: 'admin-main', component:AdminMainComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
