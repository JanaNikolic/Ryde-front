import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PassengerService } from 'src/app/services/passenger/passenger.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  RegisterForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(1)]),
    surname: new FormControl('', [Validators.required, Validators.minLength(1)]),
    email: new FormControl('', [Validators.required, Validators.minLength(1)]),
    telephoneNumber: new FormControl('', [Validators.required, Validators.minLength(1)]),
    address: new FormControl('', [Validators.required, Validators.minLength(1)]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    ConfirmPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
  })

  ngOnInit(): void {}
  constructor(private passengerService: PassengerService, private router: Router) {}

  register(){
    if (this.RegisterForm.valid) {
      console.log(this.RegisterForm.value)
      this.passengerService.
        add(this.RegisterForm.value)
        .subscribe((res: any) => {
          console.log(this.RegisterForm.value);
        });
    }
  }
}
