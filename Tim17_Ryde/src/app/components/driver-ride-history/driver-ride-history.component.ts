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
import { ReviewRequest, ReviewResponse } from 'src/app/model/Review';
import { MapService } from 'src/app/services/map/map.service';
import { Driver } from 'src/app/model/Driver';

@Component({
  selector: 'app-driver-ride-history',
  templateUrl: './driver-ride-history.component.html',
  styleUrls: ['./driver-ride-history.component.css']
})

export class DriverRideHistoryComponent {
  value: number = 1;
  max: number = 5;

  constructor(private driverService: DriverService, private reviewService: ReviewService, private rideService: RideService, private passengerService: PassengerService, private route: ActivatedRoute, private mapService: MapService) { }
  rides: Ride[] = [];
  sortCriteria: string = '';
  review: ReviewResponse[] = [];

  rideReview: RideReview = {
    driverReview: this.review,
    vehicleReview: this.review
  }

  passengers: Passenger[] = [];
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

  loc: Locations = {
    address: '',
    latitude: 10,
    longitude: 10
  }

  location: LocationDTO = {
    departure: this.loc,
    destination: this.loc

  }
  locc: LocationDTO[] = [this.location];

  singleRide: Ride = {
    id: 1,
    startTime: '',
    endTime: '',
    status: '',
    totalCost: 0,
    estimatedTimeInMinutes: 0,
    locations: this.locc,
    passengers: this.passengers,
    driver:this.driver
  }


  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.driverService.getDriverRides(+params['driverId'])
        .subscribe(
          (pageRide) => {
            
            this.rides = pageRide.results;
            this.rides.forEach(function (ride) {
              if (ride.status === "FINISHED"){
              const time2 = new Date(ride.endTime).valueOf() - new Date(ride.startTime).valueOf();
              ride.estimatedTimeInMinutes = Math.round(time2/60000 *100)/100;}
            }); 
            this.rides.sort((a, b) => (a.startTime > b.startTime ? -1 : 1));
            
          }
        );

    });
  }



  showHistoryDetails(rideId: number) {
    this.rideService.getRide(rideId)
      .subscribe(
        (ride) => {
          this.singleRide = ride;
          this.passengers = this.singleRide.passengers;
          this.mapService.setFromAddress(this.singleRide.locations[0].departure.address + ", Novi Sad");
          this.mapService.setToAddress(this.singleRide.locations[0].destination.address + ", Novi Sad");
          console.log(this.singleRide);
        }
      )

    this.reviewService.getRideReviews(rideId)
      .subscribe(
        (rideReview) => {
          this.rideReview = rideReview;

          console.log(this.rideReview.vehicleReview[0].rating);
          this.rideReview.driverReview.sort((a, b) => (a.rating > b.rating ? -1 : 1));
          this.rideReview.vehicleReview.sort((a, b) => (a.rating > b.rating ? -1 : 1));

        }
      )





  }
  sortBy() {
    if (this.sortCriteria == "dateAsc") {
      this.rides.sort((a, b) => (a.startTime < b.startTime ? -1 : 1));
    }
    else if (this.sortCriteria == "dateDesc") {
      this.rides.sort((a, b) => (a.startTime > b.startTime ? -1 : 1));
    }
    else if (this.sortCriteria == "durationAsc") {
      this.rides.sort((a, b) => (a.estimatedTimeInMinutes < b.estimatedTimeInMinutes ? -1 : 1));
    }
    else if (this.sortCriteria == "durationDesc") {
      this.rides.sort((a, b) => (a.estimatedTimeInMinutes > b.estimatedTimeInMinutes ? -1 : 1));
    }
    else if (this.sortCriteria == "priceAsc") {
      this.rides.sort((a, b) => (a.totalCost < b.totalCost ? -1 : 1));
    }
    else if (this.sortCriteria == "priceDesc") {
      this.rides.sort((a, b) => (a.totalCost > b.totalCost ? -1 : 1));
    }

  }

}