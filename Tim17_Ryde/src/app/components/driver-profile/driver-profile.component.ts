import { Component } from '@angular/core';
import { DriverService } from 'src/app/services/driver/driver.service';
import { ActivatedRoute } from '@angular/router';
import { Driver } from 'src/app/model/Driver';
import { Vehicle } from 'src/app/model/Vehicle';
import { Ride } from 'src/app/model/Ride';




@Component({
  selector: 'app-driver-profile',
  templateUrl: './driver-profile.component.html',
  styleUrls: ['./driver-profile.component.css']
})
export class DriverProfileComponent {

  constructor(private driverService: DriverService, private route: ActivatedRoute){
    
  }
  
  ridesPerDay!: Map<String, Number>;
  rides: Ride[] = [];
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
    active: false,
    activeRide: false
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
      this.driverService.getDriverRides(+params['driverId'])
      .subscribe(
        (pageRide) => {
          this.rides = pageRide.results;
          console.log(this.rides)
        }
      );
    });

    this.route.params.subscribe((params) => {
      this.driverService.getDriver(+params['driverId'])
      .subscribe(
        (driver) => {    
  
          this.driver = driver;
          
        }
      ); 
  });

  

  this.route.params.subscribe((params) => {
    console.log(+params['driverId'])
    this.driverService.getVehicle(+params['driverId'])
    .subscribe(
      (vehicle) => {         
        this.vehicle = vehicle;
       
      }
    ); 
});



  }
  

  showDriverInfo(){
    console.log(this.driver)
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
