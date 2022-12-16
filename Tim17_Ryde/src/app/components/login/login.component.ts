import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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
  invalidInput:boolean = true;


  ngOnInit(): void {}
  login(){
    if(this.LoginForm.valid){

    }
    if (!this.LoginForm.valid){
      alert("invalidForm")
      this.invalidInput = true;
      

    }
    else{
      this.invalidInput = false;
    }

  }

}
