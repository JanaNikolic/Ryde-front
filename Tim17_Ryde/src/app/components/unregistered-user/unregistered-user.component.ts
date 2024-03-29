import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, OnInit, Output, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin, map } from 'rxjs';
import { Locations } from 'src/app/model/Locations';
import { UnregisteredUserRequest } from 'src/app/model/request/UnregisteredUserRequest';
import { LocationDTO, Ride } from 'src/app/model/Ride';
import { MapService } from 'src/app/services/map/map.service';
import { UnregisteredUserService } from 'src/app/services/unregistered_user/unregistered-user.service';


@Component({
  selector: 'app-unregistered-user',
  templateUrl: './unregistered-user.component.html',
  styleUrls: ['./unregistered-user.component.css']
})
export class UnregisteredUserComponent implements OnInit {
  CalculateForm = new FormGroup({
    from: new FormControl('', { validators: [Validators.required, Validators.minLength(5)], nonNullable: true }),
    to: new FormControl('', { validators: [Validators.required, Validators.minLength(5)], nonNullable: true }),
  });


  @Output() newItemEvent = new EventEmitter<string>();

  selectedFromAddress: string = '';
  selectedToAddress: string = '';
  duration: string = '';
  price: string = '';
  distance: string = '';

  private departureLat: number = 0;
  private departureLng: number = 0;

  private destinationLat: number = 0;
  private destinationLng: number = 0;

  constructor(private router: Router, private mapService: MapService, private unregisteredUserSerivce: UnregisteredUserService) {

    // this.renderer.addClass(document.body, 'black');

  }

  ngOnInit(): void {

    this.mapService.selectedFromAddress$.subscribe(data => {
      const address = data.address;
      console.log(address.road + " " + address.house_number + ", " + address.city_district);
      this.selectedFromAddress = address.road + " " + address.house_number + ", " + address.city_district;
    });

    this.mapService.selectedToAddress$.subscribe(data => {
      const address = data.address;
      this.selectedToAddress = address.road + " " + address.house_number + ", " + address.city_district;
    });

  }

  calculate() {
    if (this.CalculateForm.valid) {

      let departure = {
        address: this.selectedFromAddress,
        latitude: this.departureLat,
        longitude: this.departureLng
      }

      let destination = {
        address: this.selectedToAddress,
        latitude: this.destinationLat,
        longitude: this.destinationLng
      }

      this.mapService.setFromAddress(this.selectedFromAddress + ", Novi Sad");

      this.mapService.setToAddress(this.selectedToAddress + ", Novi Sad");

      this.mapService.selectedDeparture$.subscribe({
        next: (dep) => {
          this.departureLat = dep.lat;
          this.departureLng = dep.lon;

          departure.latitude = dep.lat;
          departure.longitude = dep.lng;
        },
        error: () => { },
      });

      this.mapService.selectedDestination$.subscribe({
        next: (des) => {

          this.destinationLat = des.lat;
          this.destinationLng = des.lon;

          destination.latitude = des.lat;
          destination.longitude = des.lng;
        },
        error: () => { },
      });

      let location: LocationDTO = {
        departure: departure,
        destination: destination
      };

      let request: UnregisteredUserRequest = {
        locations: [location],
        babyTransport: false,
        petTransport: false,
        vehicleType: 'STANDARD'
      };

      this.unregisteredUserSerivce
        .calculatePrice(request)
        .subscribe({
          next: (res) => {
            console.log(res);
            this.price = Math.round(res.estimatedCost) + "";
          },
          error: (error) => {
            // if (error instanceof HttpErrorResponse) {
            //   this.hasError = true;
            // }
          }
        });

      this.mapService.selectedDistance$.subscribe({next: (data) => {
        if (!isNaN(data)) {
          this.distance = (Math.round((data / 1000) * 100) / 100) + '';
        }
      }});

      this.mapService.selectedDuration$.subscribe({next: (data) => {
        console.log(data);
        if (!isNaN(data)) {
          this.duration = Math.floor(data / 60) + '';
        }
      }});
      console.log(this.duration);

      const details = document.getElementById('data') as HTMLDivElement | null;
      if (details != null) {
          details.style.display = 'block';
      }
      this.CalculateForm.reset(this.CalculateForm.value);
    }
  }
}