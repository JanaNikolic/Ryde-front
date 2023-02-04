import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DriverService } from 'src/app/services/driver/driver.service';
import { VehicleService } from 'src/app/services/vehicle/vehicle.service';
import { Locations } from 'src/app/model/Locations';
import { Vehicle } from 'src/app/model/Vehicle';
import { Driver } from 'src/app/model/Driver';
import { passwordMatch } from 'src/app/validators/passwordMatch';

@Component({
  selector: 'app-create-driver',
  templateUrl: './create-driver.component.html',
  styleUrls: ['./create-driver.component.css']
})
export class CreateDriverComponent {
  type = 'STANDARD';

  buttonClicked: boolean = false;
  location: Locations = {
    

    address: "slovacka 5",
    latitude: 1,
    longitude: 1,

  }
  image: string = "";


  CreateDriverForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(1)]),
    surname: new FormControl('', [Validators.required, Validators.minLength(1)]),
    email: new FormControl('', [Validators.required, Validators.minLength(1), Validators.email]),
    telephoneNumber: new FormControl('', [Validators.required, Validators.minLength(1)]),
    address: new FormControl('', [Validators.required, Validators.minLength(1)]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8)], ),
    model: new FormControl('', [Validators.required, Validators.minLength(1)]),
    licenceNumber: new FormControl('', [Validators.required, Validators.minLength(1)]),
    passengerSeats: new FormControl('', [Validators.required, Validators.minLength(1)]),
    vehicleType: new FormControl('', [Validators.required, Validators.minLength(1)]),
    babyTransport: new FormControl('', []),
    petTransport: new FormControl('', []),




  }, [passwordMatch("password", "confirmPassword")])
  vehicle: Vehicle = {
    vehicleType: this.CreateDriverForm.value.vehicleType as string,
    model: this.CreateDriverForm.value.model as string,
    licenseNumber: this.CreateDriverForm.value.licenceNumber as string,
    passengerSeats: Number(this.CreateDriverForm.value.passengerSeats),
    babyTransport: Boolean(this.CreateDriverForm.value.babyTransport),
    petTransport: Boolean(this.CreateDriverForm.value.petTransport),
    currentLocation: this.location,
    id: 0
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
    active: false,
    activeRide: false
  };


  ngOnInit(): void { }
  constructor(private driverService: DriverService, private vehicleService: VehicleService) { }



  create() {
    this.buttonClicked = true;
    if (this.CreateDriverForm.valid && this.CreateDriverForm.value.password == this.CreateDriverForm.value.confirmPassword) {
      
      this.vehicle = {
        vehicleType: this.CreateDriverForm.value.vehicleType as string,
        model: this.CreateDriverForm.value.model as string,
        licenseNumber: this.CreateDriverForm.value.licenceNumber as string,
        passengerSeats: Number(this.CreateDriverForm.value.passengerSeats),
        babyTransport: Boolean(this.CreateDriverForm.value.babyTransport),
        petTransport: Boolean(this.CreateDriverForm.value.petTransport),
        currentLocation: this.location,
        id: 0
      };
      this.driver = {
        name: this.CreateDriverForm.value.name as string,
        surname: this.CreateDriverForm.value.surname as string,
        telephoneNumber: this.CreateDriverForm.value.telephoneNumber as string,
        profilePicture: this.image,
        email: this.CreateDriverForm.value.email as string,
        password: this.CreateDriverForm.value.password as string,
        address: this.CreateDriverForm.value.address as string,
        blocked: false,
        active: false,
        activeRide: false
      }

      
      
      this.driverService.
        addDriver(this.driver)
        .subscribe( (res: Driver) =>
          { 
            console.log(this.vehicle);
                
                this.driver = res;
                this.driverService.
                  addVehicle(Number(res.id), this.vehicle)
                  .subscribe((res: any) => {
                    
                  });

              

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
  get email(){
    return this.CreateDriverForm.get('email');
  }
  get name(){
    return this.CreateDriverForm.get('name');
  }
  get surname(){
    return this.CreateDriverForm.get('surname');
  }
  get telephoneNumber(){
    return this.CreateDriverForm.get('telephoneNumber');
  }
  get address(){
    return this.CreateDriverForm.get('address');
  }
  get password(){
    return this.CreateDriverForm.get('password');
  }
  get confirmPassword(){
    return this.CreateDriverForm.get('confirmPassword');
  }
  get model(){
    return this.CreateDriverForm.get('model');
  }
  get licenceNumber(){
    return this.CreateDriverForm.get('licenceNumber');
  }
  get passengerSeats(){
    return this.CreateDriverForm.get('passengerSeats');
  }
  get vehicleType(){
    return this.CreateDriverForm.get('vehicleType');
  }
  ConfirmedValidator(controlName: string, matchingControlName: string){
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];
        if (matchingControl.errors && !matchingControl.errors['confirmedValidator']) {
            return;
        }
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ confirmedValidator: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
}




}
