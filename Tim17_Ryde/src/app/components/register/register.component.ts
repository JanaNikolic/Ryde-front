import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  RegisterForm = new FormGroup({
    FirstName: new FormControl('', Validators.minLength(1)),
    LastName: new FormControl('', Validators.minLength(1)),
    Email: new FormControl('', Validators.minLength(1)),
    Phone: new FormControl('', Validators.minLength(1)),
    Address: new FormControl('', Validators.minLength(1)),
    Password: new FormControl('', Validators.minLength(8)),
    ConfurmPassword: new FormControl('', Validators.minLength(8)),
  })

  ngOnInit(): void {}
}
