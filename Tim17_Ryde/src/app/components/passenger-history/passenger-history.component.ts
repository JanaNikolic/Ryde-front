import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Driver } from 'src/app/model/Driver';
import { Locations } from 'src/app/model/Locations';
import { Passenger } from 'src/app/model/Passenger';
import { ReviewRequest,ReviewResponse, RideReview } from 'src/app/model/Review';
import { LocationDTO, Ride } from 'src/app/model/Ride';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DriverService } from 'src/app/services/driver/driver.service';
import { MapService } from 'src/app/services/map/map.service';
import { PassengerService } from 'src/app/services/passenger/passenger.service';
import { ReviewService } from 'src/app/services/review/review.service';
import { RideService } from 'src/app/services/ride/ride.service';

@Component({
  selector: 'app-passenger-history',
  templateUrl: './passenger-history.component.html',
  styleUrls: ['./passenger-history.component.css']
})
export class PassengerHistoryComponent {
  disableCreateReviews = false;
  vehicleRating:number = 1;
  driverRating:number = 1;
  currentRideId:number = 0;
  showReviews:Boolean = true;
  showCreateDriverReview:Boolean = false;
  showCreateVehicleReview:Boolean = false;
  value: number = 1;
  max: number = 5;
  constructor(private driverService: DriverService, private reviewService: ReviewService, private rideService: RideService, private passengerService: PassengerService, private route: ActivatedRoute, private mapService: MapService, private authService: AuthService) { }
  rides: Ride[] = [];
  sortCriteria: string = '';
  review: ReviewResponse[] = [];

  rideReview: RideReview = {
    driverReview: this.review,
    vehicleReview: this.review
  }
  passenger!:Passenger;
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
  passengers: Passenger[] = [];
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
 
  CreateReviewForm = new FormGroup({
    comment: new FormControl('', [ Validators.maxLength(250)]),
  })

  ngOnInit(): void {
    this.driver.email ='';
    this.route.params.subscribe((params) => {
      this.passengerService.getPassengerRides(+params['passengerId'])
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
    this.currentRideId = rideId;
    this.showCreateVehicleReview = false;
    this.showCreateDriverReview = false;
    this.showReviews = true;
    
    this.rideService.getRide(rideId)
      .subscribe(
        (ride) => {
          this.singleRide = ride;
          this.driver = this.singleRide.driver;
          this.mapService.setFromAddress(this.singleRide.locations[0].departure.address + ", Novi Sad");
          this.mapService.setToAddress(this.singleRide.locations[0].destination.address + ", Novi Sad");

          
          

          

          const time = new Date().valueOf() - new Date(this.singleRide.endTime.split("T")[0]).valueOf();
          if(time >  259200000){
            this.disableCreateReviews = true;
          }
          else{
            this.disableCreateReviews = false;
          }
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

  showCreateDriverReviewForm(){
    this.showCreateVehicleReview = false;
    this.showReviews = false;
    this.showCreateDriverReview = true;
  }

  showCreateVehicleReviewForm(){
    
    this.showReviews = false;
    this.showCreateDriverReview = false;
    this.showCreateVehicleReview = true;
  }

  createVehicleReview(){
    if (!this.CreateReviewForm.valid) {
      alert("Max 250 characters!");
    }
    else{
      
      let ReviewCreate: ReviewRequest = {
        
        comment: this.CreateReviewForm.value.comment as string,
        rating: this.vehicleRating,

      }
      
      
      this.reviewService.postVehicleReview(this.currentRideId, ReviewCreate).subscribe((res: any) => {
      });
       //TO DO ReviewCreate.Passenger?
    }

  }
  createDriverReview(){
    if (!this.CreateReviewForm.valid) {
      alert("Max 250 characters!");
    }
    else{
      let ReviewCreate: ReviewRequest = {
        
        comment: this.CreateReviewForm.value.comment as string,
        rating: this.driverRating,
        
      }
      this.reviewService.postDriverReview(this.currentRideId, ReviewCreate).subscribe((res: any) => {
      });
      //TO DO ReviewCreate.Passenger?
    }
  }

}
