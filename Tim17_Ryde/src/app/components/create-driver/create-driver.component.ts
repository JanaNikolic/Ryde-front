import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-driver',
  templateUrl: './create-driver.component.html',
  styleUrls: ['./create-driver.component.css']
})
export class CreateDriverComponent {

  CreateDriverForm = new FormGroup({
    FirstName: new FormControl('', [Validators.required, Validators.minLength(1)]),
    LastName: new FormControl('', [Validators.required, Validators.minLength(1)]),
    Email: new FormControl('', [Validators.required, Validators.minLength(1)]),
    Phone: new FormControl('', [Validators.required, Validators.minLength(1)]),
    Address: new FormControl('', [Validators.required, Validators.minLength(1)]),
    Licence: new FormControl('', [Validators.required, Validators.minLength(1)]),
    VehicleRegistration: new FormControl('', [Validators.required, Validators.minLength(1)]),
    Password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    ConfirmPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
    Model: new FormControl('', [Validators.required, Validators.minLength(1)]),
    LicencePlate: new FormControl('', [Validators.required, Validators.minLength(1)]),
    
    

  })
  ngOnInit(): void {}

  create(){
    if (!this.CreateDriverForm.valid){
      alert("invalidForm")
      

    }

  }
  
 

}
