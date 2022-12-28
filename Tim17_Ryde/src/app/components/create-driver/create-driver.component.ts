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


  location: Locations = {

    address: "",
    latitude: 0,
    longitude: 0,

  }
  image: string = "";


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

  driver: Driver = {
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


  ngOnInit(): void { }
  constructor(private driverService: DriverService, private vehicleService: VehicleService, private router: Router) { }



  create() {

    if (this.CreateDriverForm.valid && this.CreateDriverForm.value.password == this.CreateDriverForm.value.ConfirmPassword) {

      this.vehicle = {
        vehicleType: this.CreateDriverForm.value.vehicleType as string,
        model: this.CreateDriverForm.value.model as string,
        licenseNumber: this.CreateDriverForm.value.licenceNumber as string,
        passengerSeats: Number(this.CreateDriverForm.value.passengerSeats),
        babyTransport: Boolean(this.CreateDriverForm.value.babyTransport),
        petTransport: Boolean(this.CreateDriverForm.value.petTransport),
        currentLocation: this.location,
      };
      this.driver = {
        name: this.CreateDriverForm.value.name as string,
        surname: this.CreateDriverForm.value.surname as string,
        telephoneNumber: this.CreateDriverForm.value.telephoneNumber as string,
        profilePicture: "someProfilePicture",
        email: this.CreateDriverForm.value.email as string,
        password: this.CreateDriverForm.value.password as string,
        address: this.CreateDriverForm.value.address as string,
        blocked: false,
        active: false
      }

      console.log(this.driver);

      this.driverService.
        addDriver(this.driver)
        .subscribe(
          {
            next:
              (driver) => {
                this.driver = driver;
                this.driverService.
                  addVehicle(Number(this.driver.id), this.vehicle)
                  .subscribe((res: any) => {
                  });

              }

          }

        )
        ;
      alert("Driver succesfully created");
    }
    else {
      alert("Invalid form");
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
