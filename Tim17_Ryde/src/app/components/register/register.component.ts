import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PassengerService } from 'src/app/services/passenger/passenger.service';
import { Passenger } from 'src/app/model/Passenger';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  image:string = '';

  RegisterForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(1)]),
    surname: new FormControl('', [Validators.required, Validators.minLength(1)]),
    email: new FormControl('', [Validators.required, Validators.minLength(1)]),
    telephoneNumber: new FormControl('', [Validators.required, Validators.minLength(1)]),
    address: new FormControl('', [Validators.required, Validators.minLength(1)]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    ConfirmPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
  })

  passenger: Passenger = {
    id: 1,
    name: '',
    surname: '',
    telephoneNumber: '',
    email: '',
    password: '',
    profilePicture: '',
    address: '',
    blocked: false,
    active: false
  };

  ngOnInit(): void {}
  constructor(private passengerService: PassengerService, private router: Router) {}

  register(){

    this.passenger = {
      name: this.RegisterForm.value.name as string,
      surname: this.RegisterForm.value.surname as string,
      telephoneNumber: this.RegisterForm.value.telephoneNumber as string,
      profilePicture: this.image,
      email: this.RegisterForm.value.email as string,
      password: this.RegisterForm.value.email as string,
      address: this.RegisterForm.value.address as string,
      blocked: false,
      active: false
    }

    if (this.RegisterForm.valid && this.RegisterForm.value.password == this.RegisterForm.value.ConfirmPassword) {
      
      this.passengerService.
        add(this.passenger)
        .subscribe((res: any) => {
          
        });
        alert("Passenger registered");
    }
    else{
      alert("Invalid form")
    }
  }

  inputImage(image: any) {
    const file = image.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        this.image = reader.result!.toString();
    };
  }

}
