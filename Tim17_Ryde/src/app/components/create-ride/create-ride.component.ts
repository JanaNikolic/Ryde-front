import { AnimateTimings } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxMatTimepickerComponent } from 'ngx-mat-timepicker';
import { interval, isEmpty, Observable, Subscription } from 'rxjs';
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
import { FavoriteRideRequest } from 'src/app/model/request/FavoriteRideRequest';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TmplAstRecursiveVisitor } from '@angular/compiler';
import { PanicComponent } from '../panic/panic.component';

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

  passengerId: number = 0;
  isLoaded: boolean = false;
  private serverUrl = environment.apiHost + '/example-endpoint';
  private stompClient: any;
  private subscription!: Subscription;
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
  departure: string = '';
  destination: string = '';
  name: string = '';
  email: string = '';
  licensePlate: string = '';
  model: string = '';
  price: string = '';
  time: string = '';
  driverArrive: number = 0;
  dateNow: Date = new Date();
  milliSecondsInASecond = 1000;
  hoursInADay = 24;
  minutesInAnHour = 60;
  SecondsInAMinute = 60;
  arrivalTime: any;
  favorite = {
    departure: '',
    destination: '',
    vehicleType: '',
    babyTransport: false,
    petTransport: false,
  };
  
  constructor(
    private mapService: MapService,
    private router: Router,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialog,
    private authService: AuthService,
    private passengerService: PassengerService,
    private rideService: RideService,
    private driverService: DriverService,
    private route: ActivatedRoute,
    public snackBar: MatSnackBar,
    public matDialog: MatDialog,
  ) {}

  imageStandard: any = 'assets/images/standard.png';
  imageLuxry: any = 'assets/images/luxury.png';
  imageVan: any = 'assets/images/van.png';

  ngOnInit(): void {
    this.passengerId = this.authService.getId();

    this.getActiveRide();

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
      vehicleType: new FormControl('STANDARD'),
      date: new FormControl(new Date()),
      selectedTime: new FormControl(),
    });

    this.selectedFromAddress = this.CreateRideForm.get('departure');
    this.selectedToAddress = this.CreateRideForm.get('destination');

    this.CreateRideForm.controls['vehicleType'].setValue('STANDARD');

    this.route.queryParams.subscribe((params) => {
      this.favorite.departure = params['departure'];
      this.favorite.destination = params['destination'];
      this.favorite.petTransport = params['petTransport'] === 'true';
      this.favorite.babyTransport = params['babyTransport'] === 'true';
      this.favorite.vehicleType = params['vehicleType'];
    });

    this.mapService.selectedFromAddress$.subscribe((data) => {
      this.CreateRideForm.controls['departure'].setValue(data.display_name);
    });

    this.mapService.selectedToAddress$.subscribe((data) => {
      this.CreateRideForm.controls['destination'].setValue(data.display_name);
    });

    this.selectedTime = this.CreateRideForm.get('selectedTime');

    const today = new Date();
    this.date.setHours(this.date.getHours() + 5);
    if (today.getDate == this.date.getDate) {
      this.CreateRideForm.controls['date'].disable();
    }

    if (this.favorite.departure == undefined || this.favorite.departure.length > 0) {
      this.CreateRideForm.controls['departure'].setValue(this.favorite.departure);
      this.CreateRideForm.controls['destination'].setValue(
        this.favorite.destination
      );
      this.CreateRideForm.controls['petTransport'].setValue(
        this.favorite.petTransport
      );
      this.CreateRideForm.controls['babyTransport'].setValue(
        this.favorite.babyTransport
      );
      this.CreateRideForm.controls['vehicleType'].setValue(
        this.favorite.vehicleType
      );
    }
    

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
    // if (this.currentRide.status === 'ACCEPTED') {
    //   this.arrivalTime = new Date(this.currentRide.startTime);
    //   console.log(this.arrivalTime);

    //   this.subscription = interval(1000).subscribe((x) => {
    //     this.getTimeDifference();
    //   });
    // }
  }

  getActiveRide() {
    this.rideService.getPassengerActive(this.passengerId).subscribe({
      next: (res) => {
        this.currentRide = res;
        this.rideId = this.currentRide.id;
        
        this.openCurrentRide();

        this.arrivalTime = new Date(this.currentRide.startTime);
        this.subscription = interval(1000).subscribe((x) => {
          this.getTimeDifference();
        });

        this.initializeWebSocketConnection();
      },
      error: (error) => {
        this.currentActiveRide = false;
      }
    })
  }

  getTimeDifference() {
    const timeDifference = this.arrivalTime.getTime() - new Date().getTime();
    this.allocateTimeUnits(timeDifference);
  }

  allocateTimeUnits(timeDifference: number) {
    this.driverArrive = Math.floor(
      (timeDifference / (this.milliSecondsInASecond * this.minutesInAnHour)) %
        this.SecondsInAMinute
    );
    if (this.driverArrive == 0) {
      this.subscription.unsubscribe();
    }
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
    if (this.isLoaded && this.rideId != 0) {
      this.stompClient.subscribe(
        '/topic/ride/' + this.rideId,
        (message: { body: string }) => {
          console.log(message);
          this.handleResult(message);
          
          if (this.currentRide.status === 'ACCEPTED') {
            this.dialogRef.closeAll();
            this.currentActiveRide = true;
            this.openCurrentRide();
            this.snackBar.open('Your ride was accepted by driver!', '', {
              duration: 2000,
            });
            this.arrivalTime = new Date(this.currentRide.startTime);
            console.log(this.arrivalTime);

            this.subscription = interval(1000).subscribe((x) => {
              this.getTimeDifference();
            });
          } else if (this.currentRide.status === 'STARTED') {
            this.currentActiveRide = true;
            this.snackBar.open('Your ride has started!', '', {duration: 2000,});
            this.dialogRef.closeAll();
            this.openCurrentRide();
          } else if (this.currentRide.status === 'REJECTED') {
            this.snackBar.open('Your ride was rejected! Try again.', '', {duration: 3000,});
            this.dialogRef.closeAll();
            this.currentActiveRide = false;
          } else if (this.currentRide.status === 'FINISHED') {
            this.snackBar.open('Your ride has finished!', '', {duration: 2000,});
            this.dialogRef.closeAll();
            this.currentActiveRide = false;
          } else if (this.currentRide.status === 'CANCELED') {
            this.snackBar.open('Your ride has been canceled!', '', {duration: 2000,});
            this.dialogRef.closeAll();
            this.currentActiveRide = false;
          }
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
    const errorField = document.getElementById('no-user-error') as HTMLElement;
    errorField.style.display = 'none';
    const alreadyAddedError = document.getElementById(
      'already-added-error'
    ) as HTMLElement;
    alreadyAddedError.style.display = 'none';

    if (this.friendEmail.valid && divFriends != null) {
      let letter = this.friendEmail.value;
      console.log(letter);

      this.passengerService.getPassengerByEmail(letter).subscribe({
        next: (res) => {
          console.log(res);
          console.log(this.friendList);

          if (!this.friendList.find((e) => e.id === res.id)) {
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
          } else {
            alreadyAddedError.style.display = 'block';
          }
          this.friendEmail.setValue('');
        },
        error: (error) => {
          // passenger not found
          const errorField = document.getElementById(
            'no-user-error'
          ) as HTMLElement;
          errorField.style.display = 'block';
        },
      });
    }
  }

  formValidate(): RideRequest {
    const format: string = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'";

    let fromAddress: string = this.CreateRideForm.get('departure')?.value;
    let toAddress: string = this.CreateRideForm.get('destination')?.value;
    let vehicleType: string = this.CreateRideForm.get('vehicleType')?.value;
    let pets: boolean = this.CreateRideForm.get('petTransport')?.value;
    let babies: boolean = this.CreateRideForm.get('babyTransport')?.value;
    let time: any = this.CreateRideForm.controls['selectedTime']?.value;

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
    console.log(this.CreateRideForm);
    this.CreateRideForm.reset(this.CreateRideForm.value);
    this.CreateRideForm.controls['date'].setValue(new Date());
    console.log(this.CreateRideForm);
    return ride;
  }

  createRide() {
    if (this.CreateRideForm.valid) {
      const ride: RideRequest = this.formValidate();

      this.selectedFromAddress = ride.locations[0].departure.address;
      this.selectedToAddress = ride.locations[0].destination.address;

      this.mapService.setFromAddress(this.selectedFromAddress + ', Novi Sad');

      this.mapService.setToAddress(this.selectedToAddress + ', Novi Sad');

      this.rideService.postRide(ride).subscribe({
        next: (res) => {
          this.rideId = res.id;
          console.log(res);
          this.initializeWebSocketConnection();
        },
        error: (error) => {
          this.snackBar.open('No available drivers!', '', {duration: 2000,});
          this.dialogRef.closeAll();
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
      error: (error) => {},
    });

    this.driverService.getVehicle(this.currentRide.driver.id).subscribe({
      next: (res) => {
        this.licensePlate = res.licenseNumber;
        this.model = res.model;
      },
      error: (error) => {},
    });
  }

  addFavorite() {
    if (this.CreateRideForm.valid) {
      const fav = document.getElementById('favorite') as HTMLElement;
      fav.style.backgroundImage = "url('assets/images/favorite_fill.svg')";
      const ride: RideRequest = this.formValidate();

      let favoriteRide: FavoriteRideRequest = {
        favoriteName: 'Favorite',
        locations: ride.locations,
        passengers: [],
        vehicleType: ride.vehicleType,
        babyTransport: ride.babyTransport,
        petTransport: ride.petTransport,
      };

      this.rideService.postFavoriteRide(favoriteRide).subscribe({
        next: (res) => {
          fav.setAttribute('disabled', '');
          this.snackBar.open('Succesfuly added favorite route!', '', {
            duration: 2000,
          });
        },
        error: (error) => {
          console.log(error.message);
          fav.setAttribute('disabled', '');
          this.snackBar.open('You already have 10 favorite routes!', '', {
            duration: 2000,
          });
        },
      });

      this.CreateRideForm.reset(this.CreateRideForm.value);
      this.CreateRideForm.controls['date'].setValue(new Date());
    }
  }
  panic() {
    const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.id = "panic-component";
      dialogConfig.height = "350px";
      dialogConfig.width = "600px";
      dialogConfig.data = this.currentRide;
      const modalDialog = this.matDialog.open(PanicComponent, dialogConfig);
      let that = this;
      this.getActiveRide();
  }
}
