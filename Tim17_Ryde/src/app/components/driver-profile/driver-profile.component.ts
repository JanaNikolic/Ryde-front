import { Component } from '@angular/core';
import { DriverService } from 'src/app/services/driver/driver.service';
import { ActivatedRoute } from '@angular/router';
import { Driver } from 'src/app/model/Driver';
import { Vehicle } from 'src/app/model/Vehicle';

@Component({
  selector: 'app-driver-profile',
  templateUrl: './driver-profile.component.html',
  styleUrls: ['./driver-profile.component.css']
})
export class DriverProfileComponent {

  constructor(private driverService: DriverService, private route: ActivatedRoute){}

  driverInfo: boolean = true;
  vehicleInfo: boolean = false;
  statisticInfo: boolean = false;
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
  vehicle: Vehicle = {
    vehicleType: '',
    model: '',
    licenseNumber: '',
    passengerSeats: 0,
    babyTransport: false,
    petTransport: false,
    currentLocation: null!,
  };


  ngOnInit(): void {

    this.route.params.subscribe((params) => {
      this.driverService.getDriver(+params['driverId'])
      .subscribe(
        (driver) => {         
          this.driver = driver;
          console.log(this.driver);
        }
      ); 
  });

  this.route.params.subscribe((params) => {
    this.driverService.getVehicle(+params['driverId'])
    .subscribe(
      (vehicle) => {         
        this.vehicle = vehicle;
        console.log(this.vehicle);
      }
    ); 
});

  }

  showDriverInfo(){
    this.vehicleInfo = false;
    this.statisticInfo = false
    this.driverInfo = true;
  }

  showVehicleInfo(){
    this.driverInfo = false;
    this.statisticInfo = false;
    this.vehicleInfo = true;
    
  }

  showStatistics(){
    this.driverInfo = false;
    this.vehicleInfo = false;
    this.statisticInfo = true;
    
  }
}
