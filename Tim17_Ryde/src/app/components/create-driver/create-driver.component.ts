import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DriverService } from 'src/app/services/driver/driver.service';
import { VehicleService } from 'src/app/services/vehicle/vehicle.service';
import { Locations } from 'src/app/model/Locations';
import { Vehicle } from 'src/app/model/Vehicle';
import { Driver } from 'src/app/model/Driver';

@Component({
  selector: 'app-create-driver',
  templateUrl: './create-driver.component.html',
  styleUrls: ['./create-driver.component.css']
})
export class CreateDriverComponent {
  validDriver: Boolean = false;
  driver1: Driver = {
    id: 1,
    name: '',
    surname: '',
    telephoneNumber: '',
    email: '',
    password: '',
    address: ''
  };
  location: Locations = {

    address: "",
    latitude: 0,
    longitude: 0,
  
  }


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
  vehicle: Vehicle = {
    vehicleType: this.CreateDriverForm.value.vehicleType as string,
    model: this.CreateDriverForm.value.model as string,
    licenseNumber: this.CreateDriverForm.value.licenceNumber as string,
    passengerSeats: Number(this.CreateDriverForm.value.passengerSeats),
    babyTransport: Boolean(this.CreateDriverForm.value.babyTransport),
    petTransport: Boolean(this.CreateDriverForm.value.petTransport),
    currentLocation: this.location,


  };
  ngOnInit(): void { }
  constructor(private driverService: DriverService, private vehicleService: VehicleService, private router: Router) { }



  create() {

    if (this.CreateDriverForm.valid) {

      this.vehicle = {
        vehicleType: this.CreateDriverForm.value.vehicleType as string,
        model: this.CreateDriverForm.value.model as string,
        licenseNumber: this.CreateDriverForm.value.licenceNumber as string,
        passengerSeats: Number(this.CreateDriverForm.value.passengerSeats),
        babyTransport: Boolean(this.CreateDriverForm.value.babyTransport),
        petTransport: Boolean(this.CreateDriverForm.value.petTransport),
        currentLocation: this.location,


      };

      this.driverService.
        add(this.CreateDriverForm.value)
        .subscribe(
          {
            next:
          (driver) => {this.driver1 = driver;
            this.vehicleService.
              add(Number(String(this.driver1).split(",")[0].split(":")[1]), this.vehicle)
              .subscribe((res: any) => {
              });
          
        }
          
        }
          
        )
        ;
    }

    
    



  }




}
