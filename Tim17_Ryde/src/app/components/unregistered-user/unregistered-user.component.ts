import { Component, ElementRef, EventEmitter, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Locations } from 'src/app/model/Locations';
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

  selectedFromAddress = '';
  selectedToAddress = '';
  duration: string = '';
  price: string = '';
  distance: string = '';

  departureLat!: number;
  departureLng!: number;

  destinationLat!: number;
  destinationLng!: number;



  constructor(private renderer: Renderer2, private router: Router, private mapService: MapService, private unregisteredUserSerivce: UnregisteredUserService) {

    // this.renderer.addClass(document.body, 'black');

  }

  ngOnInit(): void {

    this.mapService.getFromAddress().subscribe(data => {
      this.selectedFromAddress = data.display_name;
    });

    this.mapService.getToAddress().subscribe(data => {
      this.selectedToAddress = data.display_name;
    });


  }

  calculate() {

    if (this.CalculateForm.valid) {

      this.mapService.setFromAddress(this.selectedFromAddress + ", Novi Sad");

      this.mapService.setToAddress(this.selectedToAddress + ", Novi Sad");

      this.CalculateForm.reset(this.CalculateForm.value);

      this.mapService.getDistance().subscribe(data => {
        if (Object.keys(data).length === 0) {
          this.distance = '...';
        } else {
          this.distance = (Math.round((data / 1000) * 100) / 100) + ' km';  
        }
      });

      this.mapService.getDuration().subscribe(data => {
        if (Object.keys(data).length === 0) {
          this.duration = '...';
        } else {
          this.duration = Math.floor(data / 60) + ' min ' + (Math.round(data - Math.floor(data / 60) * 60)) + ' s';
        }
      });

      let departure: Locations = {
        address: '',
        latitude: 0,
        longitude: 0
      }

      let destination: Locations = {
        address: '',
        latitude: 0,
        longitude: 0
      }
      /**
       *
      this.mapService.getDeparture().subscribe(data => {
        console.log(data);
        this.departureLat = data.lat;
        this.departureLng = data.lng;

        console.log("Flat " + this.departureLat + " Flng " + this.departureLng);
        this.mapService.getDestination().subscribe(data => {
          console.log(data);
          this.destinationLat = data.lat;
          this.destinationLng = data.lng;

          console.log("Tlat " + this.destinationLat + " Tlng " + this.destinationLng);

          departure = {
            address: this.selectedFromAddress,
            latitude: this.departureLat,
            longitude: this.departureLng
          }

          destination = {
            address: this.selectedToAddress,
            latitude: this.destinationLat,
            longitude: this.destinationLng
          }
        });

        this.unregisteredUserSerivce
          .calculatePrice(ride)
          .subscribe({
            next: (res) => {
              console.log(res);
              this.price = Math.round(res.estimatedCost) + " RSD";
            }
          });

      }); 
       */

      this.mapService.getDeparture().subscribe(data => {
        console.log(data);
        this.departureLat = data.lat;
        this.departureLng = data.lng;

        console.log("Flat " + this.departureLat + " Flng " + this.departureLng);
      }); 

      this.mapService.getDestination().subscribe(data => {
        console.log(data);
        this.destinationLat = data.lat;
        this.destinationLng = data.lng;

        console.log("Tlat " + this.destinationLat + " Tlng " + this.destinationLng);

        
      });

      departure = {
        address: this.selectedFromAddress,
        latitude: this.departureLat,
        longitude: this.departureLng
      };

      destination = {
        address: this.selectedToAddress,
        latitude: this.destinationLat,
        longitude: this.destinationLng
      };

      const location: LocationDTO = {
        departure: departure,
        destination: destination
      };

      const locations: LocationDTO[] = [location];

      const ride: Ride = {
        id: 0,
        startTime: '',
        endTime: '',
        totalCost: 0,
        estimatedTimeInMinutes: 0,
        locations: locations,
        passengers: []

      };

      this.unregisteredUserSerivce
          .calculatePrice(ride)
          .subscribe({
            next: (res) => {
              console.log(res);
              this.price = Math.round(res.estimatedCost) + " RSD";
            }
          });



    }
  }
  sendToMap() {
    //TODO
    this.newItemEvent.emit(this.selectedToAddress);
  }
}