import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { JwtAuthenticationRequest } from 'src/app/model/JwtAuthenticationRequest';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  LoginForm = new FormGroup({
    Email: new FormControl('',[Validators.required, Validators.minLength(3)]),
    Password: new FormControl('',[Validators.required, Validators.minLength(8)]),
    
  });
  hasError: boolean = false;

  constructor(private authService: AuthService, private router: Router) {
    this.router.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
  };
  }

  ngOnInit(): void {}

  login(){
    this.hasError = false;

    let loginVal: JwtAuthenticationRequest = {
      email: this.LoginForm.value.Email!,
      password: this.LoginForm.value.Password!,
    };

    if (this.LoginForm.valid) {
      this.authService.login(loginVal).subscribe({
        next: (result) => {
          localStorage.setItem('user', JSON.stringify(result.accessToken));
          console.log(result.accessToken);
          this.authService.setUser();
          if (this.authService.getRole() == "ROLE_ADMIN") {
            this.router.navigate(['/admin-main']);
          } else if (this.authService.getRole() == "ROLE_DRIVER"){
            this.router.navigate(['/driver-main'])
          }
        },
        error: (error) => {
          if (error instanceof HttpErrorResponse) {
            this.hasError = true;
          }
        },
      });
    }
    }

  }
