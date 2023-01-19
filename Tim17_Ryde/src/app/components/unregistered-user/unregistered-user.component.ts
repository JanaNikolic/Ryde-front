import { Component, ElementRef, EventEmitter, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
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

  private departure: Locations = {
    address: '',
    latitude: 0,
    longitude: 0
  }

  private destination: Locations = {
    address: '',
    latitude: 0,
    longitude: 0
  }

  constructor(private renderer: Renderer2, private router: Router, private mapService: MapService, private unregisteredUserSerivce: UnregisteredUserService) {

    // this.renderer.addClass(document.body, 'black');

  }

  ngOnInit(): void {

    this.mapService.selectedFromAddress$.subscribe(data => {
      this.selectedFromAddress = data.display_name;
    });

    this.mapService.selectedToAddress$.subscribe(data => {
      this.selectedToAddress = data.display_name;
    });

  }

  calculate() {
    if (this.CalculateForm.valid) {

      this.mapService.setFromAddress(this.selectedFromAddress + ", Novi Sad");

      this.mapService.setToAddress(this.selectedToAddress + ", Novi Sad");

      const location: LocationDTO = {
        departure: this.departure,
        destination: this.destination
      };

      const locations: LocationDTO[] = [location];

      const request: UnregisteredUserRequest = {
        locations: locations,
        babyTransport: false,
        petTransport: false,
        vehicleType: 'STANDARD'
      };

      // this.mapService.search(this.selectedFromAddress + ", Novi Sad").subscribe({
      //   next: (result) => {
      //     this.departureLat = result[0].lat;
      //     this.departureLng = result[0].lon;

      //     this.departure = {
      //       address: this.selectedFromAddress,
      //       latitude: this.departureLat,
      //       longitude: this.departureLng
      //     }
      //     console.log("DepLat: " + this.departureLat + " DepLng: " + this.departureLng);

      //     this.mapService.search(this.selectedToAddress + ", Novi Sad").subscribe({
      //       next: (result) => {
      //         this.destinationLat = result[0].lat;
      //         this.destinationLng = result[0].lon;

      //         this.destination = {
      //           address: this.selectedToAddress,
      //           latitude: this.destinationLat,
      //           longitude: this.destinationLng
      //         }

      //         this.unregisteredUserSerivce
      //         .calculatePrice(ride)
      //         .subscribe({
      //           next: (res) => {
      //             console.log(res);
      //             this.price = Math.round(res.estimatedCost) + " RSD";
      //           },
      //           // error: (error) => {
      //           //   if (error instanceof HttpErrorResponse) {
      //           //     this.hasError = true;
      //           //   }
      //           // }
      //         });

      //         console.log("DeSLat: " + this.destinationLat + " DesLng: " + this.destinationLng);

      //       },
      //       error: () => { },
      //     });

      //   },
      //   error: () => { },
      // });

      forkJoin([this.mapService.search(this.selectedFromAddress), this.mapService.search(this.selectedToAddress)])
      .pipe(map(([dep, des]) => {
        
        if (this.departureLat != dep[0].lat && this.departureLng != dep[0].lon) {
          this.departureLat = dep[0].lat;
          this.departureLng = dep[0].lon;
        }
        this.mapService.setDeparture({ lat: this.departureLat, lng: this.departureLng });

        if (this.destinationLat != des[0].lat && this.destinationLng != des[0].lon) {
          this.destinationLat = des[0].lat;
          this.destinationLng = des[0].lon;
        }
        this.mapService.setDestination({ lat: this.destinationLat, lng: this.destinationLng });

        console.log("Aloo breee 11111111");

          this.departureLat = dep.lat;
          this.departureLng = dep.lng;
          console.log("Flat " + this.departureLat + " Flng " + this.departureLng);

          this.destinationLat = des.lat;
          this.destinationLng = des.lng;
          console.log("Flat " + this.departureLat + " Flng " + this.departureLng);

          this.departure = {
            address: this.selectedFromAddress,
            latitude: this.departureLat,
            longitude: this.departureLng
          }

          this.destination = {
            address: this.selectedToAddress,
            latitude: this.destinationLat,
            longitude: this.destinationLng
          }

          const location: LocationDTO = {
            departure: this.departure,
            destination: this.destination
          };
    
          const locations: LocationDTO[] = [location];

          this.unregisteredUserSerivce
          .calculatePrice(request)
          .subscribe({
            next: (res) => {
              console.log(res);
              this.price = Math.round(res.estimatedCost) + " RSD";
            },
            // error: (error) => {
            //   if (error instanceof HttpErrorResponse) {
            //     this.hasError = true;
            //   }
            // }
          });

      })).subscribe();

/**
      forkJoin([this.mapService.selectedDeparture$, this.mapService.selectedDestination$])
        .pipe(map(([dep, des]) => {


          console.log("Aloo breee ");

          console.log(dep);
          console.log(des);

          this.departureLat = dep.lat;
          this.departureLng = dep.lng;
          console.log("Flat " + this.departureLat + " Flng " + this.departureLng);

          this.destinationLat = des.lat;
          this.destinationLng = des.lng;
          console.log("Flat " + this.departureLat + " Flng " + this.departureLng);

          this.departure = {
            address: this.selectedFromAddress,
            latitude: this.departureLat,
            longitude: this.departureLng
          }

          this.destination = {
            address: this.selectedToAddress,
            latitude: this.destinationLat,
            longitude: this.destinationLng
          }

          const location: LocationDTO = {
            departure: this.departure,
            destination: this.destination
          };
    
          const locations: LocationDTO[] = [location];

          this.unregisteredUserSerivce
          .calculatePrice(ride)
          .subscribe({
            next: (res) => {
              console.log(res);
              this.price = Math.round(res.estimatedCost) + " RSD";
            },
            // error: (error) => {
            //   if (error instanceof HttpErrorResponse) {
            //     this.hasError = true;
            //   }
            // }
          });

        })).subscribe(); */
        //data => {
      //     console.log("Alooo breee" + data);
      //     this.unregisteredUserSerivce
      //     .calculatePrice(ride)
      //     .subscribe({
      //       next: (res) => {
      //         console.log(res);
      //         this.price = Math.round(res.estimatedCost) + " RSD";
      //       },
      //     });
      // });

      // this.unregisteredUserSerivce.calculatePrice(ride).pipe(
      //   mergeMap((res1) => this.mapService.selectedDeparture$),
      //   mergeMap((res2) => this.mapService.selectedDestination$)
      // ).subscribe({
      //   next: (res: any) => {
      //     console.log(res);
      //     this.price = Math.round(res.estimatedCost) + " RSD";
      //   },
      // });

      /** 
      this.mapService.selectedDeparture$.subscribe(data => {
        // console.log(data);
        this.departureLat = data.lat;
        this.departureLng = data.lng;

        // console.log("Flat " + this.departureLat + " Flng " + this.departureLng);
        this.mapService.selectedDestination$.subscribe(data => {
          console.log(data);
          this.destinationLat = data.lat;
          this.destinationLng = data.lng;

          console.log("Tlat " + this.destinationLat + " Tlng " + this.destinationLng);

          this.departure = {
            address: this.selectedFromAddress,
            latitude: this.departureLat,
            longitude: this.departureLng
          }

          this.destination = {
            address: this.selectedToAddress,
            latitude: this.destinationLat,
            longitude: this.destinationLng
          }
        });

        const location: LocationDTO = {
          departure: this.departure,
          destination: this.destination
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
            },
            // error: (error) => {
            //   if (error instanceof HttpErrorResponse) {
            //     this.hasError = true;
            //   }
            // }
          });
      });
      */

      this.mapService.selectedDistance$.subscribe(data => {
        if (Object.keys(data).length === 0) {
          this.distance = '';
        }
        this.distance = (Math.round((data / 1000) * 100) / 100) + ' km';
      });

      this.mapService.selectedDuration$.subscribe(data => {
        if (Object.keys(data).length === 0) {
          this.duration = '';
        }
        this.duration = Math.floor(data / 60) + ' min ' + (Math.round(data - Math.floor(data / 60) * 60)) + ' s';
      });


      // this.mapService.getDeparture().subscribe(data => {
      //   console.log(data);
      //   this.departureLat = data.lat;
      //   this.departureLng = data.lng;

      //   console.log("Flat " + this.departureLat + " Flng " + this.departureLng);
      // });

      // this.mapService.getDestination().subscribe(data => {
      //   console.log(data);
      //   this.destinationLat = data.lat;
      //   this.destinationLng = data.lng;

      //   console.log("Tlat " + this.destinationLat + " Tlng " + this.destinationLng);


      // });

      // departure = {
      //   address: this.selectedFromAddress,
      //   latitude: this.departureLat,
      //   longitude: this.departureLng
      // };

      // destination = {
      //   address: this.selectedToAddress,
      //   latitude: this.destinationLat,
      //   longitude: this.destinationLng
      // };

      // const location: LocationDTO = {
      //   departure: departure,
      //   destination: destination
      // };

      // const locations: LocationDTO[] = [location];

      // const ride: Ride = {
      //   id: 0,
      //   startTime: '',
      //   endTime: '',
      //   totalCost: 0,
      //   estimatedTimeInMinutes: 0,
      //   locations: locations,
      //   passengers: []

      // };

      // this.unregisteredUserSerivce
      //   .calculatePrice(ride)
      //   .subscribe({
      //     next: (res) => {
      //       console.log(res);
      //       this.price = Math.round(res.estimatedCost) + " RSD";
      //     }
      //   });
      this.CalculateForm.reset(this.CalculateForm.value);


    }
  }
}