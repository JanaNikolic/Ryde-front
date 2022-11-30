import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  LoginForm = new FormGroup({
    Email: new FormControl('Test'),
    Password: new FormControl('',  Validators.minLength(8)),
    
  });


  ngOnInit(): void {}

}
