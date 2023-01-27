import { formatDate, Location } from '@angular/common';
import { Component, Inject, LOCALE_ID } from '@angular/core';
import { LocationForRide } from 'src/app/model/LocationForRide';
import { Locations } from 'src/app/model/Locations';
import { FavoriteRidePage, FavoriteRideResponse } from 'src/app/model/response/FavoriteRidePage';
import { AuthService } from 'src/app/services/auth/auth.service';
import { PassengerService } from 'src/app/services/passenger/passenger.service';
import { RideService } from 'src/app/services/ride/ride.service';

@Component({
  selector: 'app-passenger-profile',
  templateUrl: './passenger-profile.component.html',
  styleUrls: ['./passenger-profile.component.css']
})
export class PassengerProfileComponent {
  name = "";
  email = "";
  address = "";
  phoneNumber = "";
  totalRideCount = 0;
  totalKilometers = 0;
  totalMoney = 0;

  locations: FavoriteRideResponse[] = []; 

  constructor(private rideService: RideService, private passengerService: PassengerService, private authService:AuthService, @Inject(LOCALE_ID) private locale: string) {}

  ngOnInit() : void {
    this.rideService.getFavorites().subscribe({
      next: (res) => {
        this.locations = res.results;
      }
    })

    this.passengerService.getPassenger(this.authService.getId()).subscribe({
      next: (res) => {
        this.name = res.name + " " + res.surname;
        this.email = res.email;
        this.address = res.address;
        this.phoneNumber = res.telephoneNumber;
      } 
    })
    let date = new Date();
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    let start: string = formatDate(firstDay,'yyyy-MM-dd',this.locale)

    let end: string = formatDate(lastDay,'yyyy-MM-dd',this.locale)

    this.passengerService.getRidesPerDay(start, end, this.authService.getId()).subscribe({
      next: (res) => {
        this.totalRideCount = res.totalCount;
      }
    })

    this.passengerService.getKilometersPerDay(start, end, this.authService.getId()).subscribe({
      next: (res) => {
        this.totalKilometers = res.totalCount;
      }
    })

    this.passengerService.getMoneyPerDay(start, end, this.authService.getId()).subscribe({
      next: (res) => {
        this.totalMoney = res.totalCount;
      }
    })
  }

  editProfile() {}
  deleteFavorite(locationId:number) {}
  orderRide(locationId:number) {}
}
