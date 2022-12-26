import { Component } from '@angular/core';
import { Ride } from 'src/app/model/Ride';
import { LocationDTO } from 'src/app/model/Ride';
import { DriverService } from 'src/app/services/driver/driver.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-driver-ride-history',
  templateUrl: './driver-ride-history.component.html',
  styleUrls: ['./driver-ride-history.component.css']
})
export class DriverRideHistoryComponent {

  constructor(private driverService: DriverService, private route: ActivatedRoute) {}
  rides: Ride[] = [];
  rideStartMinutesHours:string = '';
  rideEndMinutesHours:string = '';
  rideDate:string = '';

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
    this.driverService.getDriverRides(+params['driverId'])
    .subscribe(
      (pageRide) => {
        console.log(this.rides);
        this.rides = pageRide.rides;
        for( let ride of this.rides){
           this.rideStartMinutesHours = ride.startTime.split("T")[1].split(":")[0] +':'+ ride.startTime.split("T")[1].split(":")[1];
           this.rideEndMinutesHours = ride.endTime.split("T")[1].split(":")[0] +':'+ ride.endTime.split("T")[1].split(":")[1];
           this.rideDate = ride.startTime.split("T")[0];
        }
        console.log(this.rides[1].locations[0].departure);
      }
    );
  
});
  }
}
