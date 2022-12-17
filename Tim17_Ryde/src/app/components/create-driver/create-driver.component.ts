import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DriverService } from 'src/app/services/driver/driver.service';
import { VehicleService } from 'src/app/services/vehicle/vehicle.service';

@Component({
  selector: 'app-create-driver',
  templateUrl: './create-driver.component.html',
  styleUrls: ['./create-driver.component.css']
})
export class CreateDriverComponent {

  CreateDriverForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(1)]),
    surname: new FormControl('', [Validators.required, Validators.minLength(1)]),
    email: new FormControl('', [Validators.required, Validators.minLength(1)]),
    telephoneNumber: new FormControl('', [Validators.required, Validators.minLength(1)]),
    address: new FormControl('', [Validators.required, Validators.minLength(1)]),
    
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    ConfirmPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
    model: new FormControl('', [Validators.required, Validators.minLength(1)]),
    licenceNumber: new FormControl('', [Validators.required, Validators.minLength(1)]),
    passengerSeats: new FormControl('', [Validators.required, Validators.minLength(1)]),
    vehicleType: new FormControl('', [Validators.required, Validators.minLength(1)]),
    babyTransport: new FormControl('', []),
    petTransport: new FormControl('', []),
    
    

  })
  ngOnInit(): void {}
  constructor(private driverService: DriverService, private vehicleService: VehicleService, private router: Router) {}

 

  create(){
    if (this.CreateDriverForm.valid) {
      console.log(this.CreateDriverForm.value)
      this.driverService.
        add(this.CreateDriverForm.value)
        .subscribe((res: any) => {
          console.log(this.CreateDriverForm.value);
        });

        /*this.vehicleService.
        add(1,this.CreateDriverForm.value)
        .subscribe((res: any) => {
          console.log(this.CreateDriverForm.value);
        });*/
    }
  }
  
 

}
