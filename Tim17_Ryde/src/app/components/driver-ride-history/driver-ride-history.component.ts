import { Component } from '@angular/core';
import { Ride } from 'src/app/model/Ride';
import { LocationDTO } from 'src/app/model/Ride';
import { DriverService } from 'src/app/services/driver/driver.service';
import { ActivatedRoute } from '@angular/router';
import { RideService } from 'src/app/services/ride/ride.service';
import { Locations } from 'src/app/model/Locations';
import { Passenger } from 'src/app/model/Passenger';
import { PassengerService } from 'src/app/services/passenger/passenger.service';
import { ReviewService } from 'src/app/services/review/review.service';
import { RideReview } from 'src/app/model/Review';
import { Review } from 'src/app/model/Review';

@Component({
  selector: 'app-driver-ride-history',
  templateUrl: './driver-ride-history.component.html',
  styleUrls: ['./driver-ride-history.component.css']
})
export class DriverRideHistoryComponent {

  constructor(private driverService: DriverService,private reviewService: ReviewService, private rideService: RideService, private passengerService: PassengerService, private route: ActivatedRoute) {}
  rides: Ride[] = [];

  review: Review[] = [];

  rideReview: RideReview = {
    driverReview: this.review,
    vehicleReview: this.review
  }

  passengers: Passenger[] = [];

  loc: Locations = {
    address: '',
    latitude: 10,
    longitude: 10
  }

  location: LocationDTO = {
    departure:this.loc,
    destination:this.loc
    
  }
  locc: LocationDTO[] = [this.location];
  
  singleRide: Ride = {
    id: 1,
    startTime: '',
    endTime: '',
    totalCost: 0,
    estimatedTimeInMinutes: 0,
    locations: this.locc,
    passengers: this.passengers

  }
 

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
    this.driverService.getDriverRides(+params['driverId'])
    .subscribe(
      (pageRide) => {
        
        this.rides = pageRide.results;
        console.log(this.rides);
        
        console.log(this.rides[1].locations[0].departure);
      }
    );
  
});
  }
  


  showHistoryDetails(rideId:number){
    this.rideService.getRide(rideId)
    .subscribe(
      (ride) => {
        this.singleRide = ride;
        this.passengers = this.singleRide.passengers;
        console.log(this.singleRide);
      }
    )

    this.reviewService.getRideReviews(rideId)
    .subscribe(
      (rideReview) => {
        this.rideReview = rideReview;
        
        console.log(this.rideReview);
      }
    )


  }
  showPassengerInfo(passengerId:number){
    
}
}