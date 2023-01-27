import { AnimateTimings } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxMatTimepickerComponent } from 'ngx-mat-timepicker';
import { isEmpty, Observable } from 'rxjs';
import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';
import { environment } from 'src/app/environment/environment';
import { Locations } from 'src/app/model/Locations';
import { RideRequest } from 'src/app/model/request/RideRequest';
import { RideResponse } from 'src/app/model/response/RideResponse';
import { AuthService } from 'src/app/services/auth/auth.service';
import { MapService } from 'src/app/services/map/map.service';
import { DateTime } from 'ts-luxon';
import { SearchingForDriverComponent } from '../searching-for-driver/searching-for-driver.component';
import { UserResponse } from 'src/app/model/response/UserResponse';
import { PassengerService } from 'src/app/services/passenger/passenger.service';
import { RideService } from 'src/app/services/ride/ride.service';
import { DriverService } from 'src/app/services/driver/driver.service';

@Component({
  selector: 'app-create-ride',
  templateUrl: './create-ride.component.html',
  styleUrls: ['./create-ride.component.css'],
})
export class CreateRideComponent implements OnInit {
  CreateRideForm!: FormGroup;
  date: Date = new Date();
  hour: any = DateTime.local().hour;
  maxTime: DateTime = DateTime.local().set({
    hour: this.hour + 5,
  });
  minTime: DateTime = DateTime.local().set({
    hour: this.hour,
  });
  selectedFromAddress: any;
  selectedToAddress: any;
  selectedTime: any;
  friendEmail: FormControl = new FormControl('', {
    validators: [
      Validators.required,
      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
    ],
  });
  friendList: UserResponse[] = [];

  passengerId: number | undefined;
  isLoaded: boolean = false;
  private serverUrl = environment.apiHost + '/example-endpoint';
  private stompClient: any;
  rideId: number = 0;
  currentRide: RideResponse = {
    id: 0,
    startTime: '',
    endTime: '',
    totalCost: 0,
    estimatedTimeInMinutes: 0,
    babyTransport: false,
    petTransport: false,
    status: '',
    locations: [],
    passengers: [],
    scheduledTime: '',
    driver: { id: 0, email: '' },
  };
  currentActiveRide: boolean = false;
  departure: string = 'Adresa 123';
  destination: string = 'Adresa 12';
  name: string = 'Mika Mikic';
  email: string = 'mika@mikic.com';
  licensePlate: string = 'NS-069-PA';
  model: string = 'Model';
  price: string = '250 RSD';
  time: string = '7 minutes';

  constructor(
    private mapService: MapService,
    private router: Router,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialog,
    private authService: AuthService,
    private passengerService: PassengerService,
    private rideService: RideService,
    private driverService: DriverService
  ) {}

  imageStandard: any = 'assets/images/standard.png';
  imageLuxry: any = 'assets/images/luxury.png';
  imageVan: any = 'assets/images/van.png';

  ngOnInit(): void {
    this.passengerId = this.authService.getId();
    

    this.CreateRideForm = this.formBuilder.group({
      departure: new FormControl('', {
        validators: [Validators.required, Validators.minLength(5)],
        nonNullable: true,
      }),
      destination: new FormControl('', {
        validators: [Validators.required, Validators.minLength(5)],
        nonNullable: true,
      }),
      babyTransport: new FormControl(),
      petTransport: new FormControl(),
      vehicleType: new FormControl(),
      date: new FormControl(new Date()),
      selectedTime: new FormControl(),
    });

    this.selectedFromAddress = this.CreateRideForm.get('departure');
    this.selectedToAddress = this.CreateRideForm.get('destination');

    this.selectedTime = this.CreateRideForm.get('selectedTime');

    const today = new Date();
    this.date.setHours(this.date.getHours() + 5);
    if (today.getDate == this.date.getDate) {
      this.CreateRideForm.controls['date'].disable();
    }

    this.CreateRideForm.controls['vehicleType'].setValue('STANDARD');

    this.mapService.selectedFromAddress$.subscribe((data) => {
      this.CreateRideForm.controls['departure'].setValue(data.display_name);
      console.log(data.display_name);
    });

    this.mapService.selectedToAddress$.subscribe((data) => {
      this.CreateRideForm.controls['destination'].setValue(data.display_name);
    });

    // this.selectedFromAddress.valueChanges.subscribe(
    //   (value: string) => {
    //     if (value != null && value.length > 5) {
    //       // console.log(value);
    //       this.mapService.setFromAddress(value + ", Novi Sad");
    //     }

    //   }
    // );

    // this.selectedToAddress.valueChanges.subscribe(
    //   (value: string) => {
    //     if (value != null && value.length > 5) {
    //       // this.destination = value;
    //       this.mapService.setToAddress(value + ", Novi Sad");
    //     }
    //   }
    // );
  }

  initializeWebSocketConnection() {
    // serverUrl je vrednost koju smo definisali u registerStompEndpoints() metodi na serveru
    let ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    let that = this;

    this.stompClient.connect({}, function () {
      that.isLoaded = true;
      that.openSocket();
    });
  }

  openSocket() {
    if (this.isLoaded) {
      this.stompClient.subscribe(
        '/topic/ride/' + this.rideId,
        (message: { body: string }) => {
          console.log(message);
          this.handleResult(message);
          // this.openModal();
          // if (this.currentRide.status === "ACCEPTED")
          console.log(this.currentRide);
          if (this.currentRide.status === "ACCEPTED" || this.currentRide.status === "STARTED") {
            this.dialogRef.closeAll();
            this.openCurrentRide();
          } else if (this.currentRide.status === "REJECTED") {
            // Open snack bar => try again
            this.dialogRef.closeAll();
          } else if (this.currentRide.status === "FINISHED") {
            // Open snack bar => Finished
            this.dialogRef.closeAll();
            this.currentActiveRide = false;
          }
          

          // If rejected => False
        }
      );
    }
  }
  openCurrentRide() {
    this.departure = this.currentRide.locations[0].departure.address;
    this.destination = this.currentRide.locations[0].destination.address;
    this.price = this.currentRide.totalCost + ' RSD';
    this.time = this.currentRide.estimatedTimeInMinutes + ' minutes';

    this.setDriver();

    this.currentActiveRide = true;
  }

  // Funkcija koja se poziva kada server posalje poruku na topic na koji se klijent pretplatio
  handleResult(rideResponse: { body: string }) {
    if (rideResponse.body) {
      this.currentRide = JSON.parse(rideResponse.body);
    }
  }

  openPopup() {
    const popup = document.getElementById('popup') as HTMLElement | null;
    if (popup != null) {
      if (popup.style.display === 'none') {
        popup.style.display = 'initial';
      } else {
        popup.style.display = 'none';
      }
    }
  }

  addFriend() {
    const divFriends = document.getElementById('friends') as HTMLElement | null;
    if (this.friendEmail.valid && divFriends != null) {
      let letter = this.friendEmail.value;
      console.log(letter);

      this.passengerService.getPassengerByEmail(letter).subscribe({
        next: (res) => {
          console.log(res);

          this.friendList.push(res);
          letter = letter.toUpperCase().substring(0, 1);

          const f = document.createElement('span');
          f.style.height = '40px';
          f.style.width = '40px';
          f.style.display = 'inline-block';
          f.style.borderRadius = '50%';
          f.style.border = '1px solid #01acac';
          f.style.margin = '0 5px';
          f.style.color = '#D9D9D9';
          f.style.fontSize = '30px';
          f.style.fontWeight = '300';
          f.style.fontFamily = 'Outfit';

          f.textContent = letter;
          divFriends.appendChild(f);

          this.friendEmail.setValue('');
        },
        error: (error) => {
          // passenger not found
        },
      });
    }
  }

  createRide() {
    if (this.CreateRideForm.valid) {
      const format: string = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'";

      let fromAddress: string = this.CreateRideForm.get('departure')?.value;
      let toAddress: string = this.CreateRideForm.get('destination')?.value;
      let vehicleType: string = this.CreateRideForm.get('vehicleType')?.value;
      let pets: boolean = this.CreateRideForm.get('petTransport')?.value;
      let babies: boolean = this.CreateRideForm.get('babyTransport')?.value;
      let time: any = this.CreateRideForm.controls['selectedTime']?.value;

      this.selectedFromAddress = fromAddress;
      this.selectedToAddress = toAddress;

      this.mapService.setFromAddress(this.selectedFromAddress + ', Novi Sad');

      this.mapService.setToAddress(this.selectedToAddress + ', Novi Sad');

      // this.mapService.setFromAddress(fromAddress + ", Novi Sad");

      // this.mapService.setToAddress(toAddress + ", Novi Sad");

      if (pets == null) pets = false;
      if (babies == null) babies = false;

      if (time >= DateTime.local().toFormat('HH:mm')) {
        // if date disabled then same date
        time = DateTime.local().set({
          hour: +time.split(':')[0],
          minutes: time.split(':')[1],
        });
        time = time.toFormat(format);
        // else next day
      }

      // console.log(fromAddress);
      // console.log(toAddress);
      // console.log(vehicleType);
      // console.log(pets);
      // console.log(babies);
      // console.log(time);

      let departure: Locations = {
        address: fromAddress,
        latitude: 0,
        longitude: 0,
      };

      let destination: Locations = {
        address: toAddress,
        latitude: 0,
        longitude: 0,
      };

      // let passengers: UserResponse[] = [];

      // for (let f in this.friendList) {
      //   // TODO
      //   const passenger: UserResponse = ;
      //   passengers.push(passenger);
      // }

      let ride: RideRequest = {
        locations: [
          {
            departure: departure,
            destination: destination,
          },
        ],
        passengers: this.friendList,
        vehicleType: vehicleType,
        babyTransport: babies,
        petTransport: pets,
        scheduledTime: time,
      };

      this.rideService.postRide(ride).subscribe({
        next: (res) => {
          this.rideId = res.id;
          console.log(res);
          this.initializeWebSocketConnection();
        },
        error: (error) => {
          console.log(error.message);
        },
      });

      // this.CreateRideForm.reset(this.CreateRideForm.value);
      // console.log(this.selectedFromAddress);
      this.openDialog();
    }
  }

  openDialog() {
    this.dialogRef.open(SearchingForDriverComponent, { disableClose: true });
  }

  setDriver() {
    this.driverService.getDriver(this.currentRide.driver.id).subscribe({
      next: (res) => {
        this.name = res.name + ' ' + res.surname;
        this.email = res.email;
      },
      error: (error) => {}
    });

    this.driverService.getVehicle(this.currentRide.driver.id).subscribe({
      next: (res) => {
        this.licensePlate = res.licenseNumber;
        this.model = res.model;
      },
      error: (error) => {}
    });
  }
}
