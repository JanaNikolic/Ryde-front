import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PassengerService } from 'src/app/services/passenger/passenger.service';
import { Passenger } from 'src/app/model/Passenger';
import { passwordMatch } from 'src/app/validators/passwordMatch';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  image:string = '';
  buttonClicked: boolean = false;
  RegisterForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(1)]),
    surname: new FormControl('', [Validators.required, Validators.minLength(1)]),
    email: new FormControl('', [Validators.required, Validators.minLength(1), Validators.email]),
    telephoneNumber: new FormControl('', [Validators.required, Validators.minLength(1)]),
    address: new FormControl('', [Validators.required, Validators.minLength(1)]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
  }, [passwordMatch("password", "confirmPassword")])

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
    this.buttonClicked = true;
    this.passenger = {
      name: this.RegisterForm.value.name as string,
      surname: this.RegisterForm.value.surname as string,
      telephoneNumber: this.RegisterForm.value.telephoneNumber as string,
      profilePicture: undefined,
      email: this.RegisterForm.value.email as string,
      password: this.RegisterForm.value.password as string,
      address: this.RegisterForm.value.address as string,
      blocked: false,
      active: false
    }

    if (this.RegisterForm.valid && this.RegisterForm.value.password == this.RegisterForm.value.confirmPassword) {
      
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

  get email(){
    return this.RegisterForm.get('email');
  }
  get name(){
    return this.RegisterForm.get('name');
  }
  get surname(){
    return this.RegisterForm.get('surname');
  }
  get telephoneNumber(){
    return this.RegisterForm.get('telephoneNumber');
  }
  get address(){
    return this.RegisterForm.get('address');
  }
  get password(){
    return this.RegisterForm.get('password');
  }
  get confirmPassword(){
    return this.RegisterForm.get('confirmPassword');
  }

}
