import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateDriverComponent } from './components/create-driver/create-driver.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { MainComponent } from './components/main/main.component';
import { UnregisteredUserComponent } from './components/unregistered-user/unregistered-user.component';
import { AdminMainComponent } from './components/admin-main/admin-main.component';
import { LoginGuard } from './guard/login.guard';

const routes: Routes = [
  {path: '', component:MainComponent},
  {path: 'login', component:LoginComponent}
  {path: 'register', component:RegisterComponent},
  {path: 'createDriver', component:CreateDriverComponent},
  {path: 'get-started', component:UnregisteredUserComponent},
  {path: 'home', component:MainComponent},
  {path: 'admin-main', component:AdminMainComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
