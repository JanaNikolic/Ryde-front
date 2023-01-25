import { Component } from '@angular/core';
import { MapService } from 'src/app/services/map/map.service';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { environment } from 'src/app/environment/environment';
import { AuthService } from 'src/app/services/auth/auth.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AppComponent } from 'src/app/app.component';
import { RideResponse } from 'src/app/model/response/RideResponse';
import { AcceptRideComponent } from '../accept-ride/accept-ride.component';
import { Passenger } from 'src/app/model/Passenger';
import { PassengerService } from 'src/app/services/passenger/passenger.service';
import { RideService } from 'src/app/services/ride/ride.service';
import { UserResponse } from 'src/app/model/response/UserResponse';
import { RejectRideComponent } from '../reject-ride/reject-ride.component';
import { DriverService } from 'src/app/services/driver/driver.service';
import { PanicComponent } from '../panic/panic.component';

@Component({
  selector: 'app-driver-main',
  templateUrl: './driver-main.component.html',
  styleUrls: ['./driver-main.component.css']
})
export class DriverMainComponent {
  private serverUrl = environment.apiHost + '/example-endpoint'
  private stompClient: any;
  active:Boolean = false;
  departure = "";
  destination = "";
  passenger!: Passenger;
  name = "";
  email = "";
  startBtn = document.getElementById("start");
  driverId: any = 0;
  currentActiveRide: boolean = false;
  started: boolean= false;
  passengers: UserResponse[] = [];
  isLoaded: boolean = false;
  ride: RideResponse = {
    id: 0,
    startTime: '',
    endTime: '',
    totalCost: 0,
    estimatedTimeInMinutes: 0,
    babyTransport: false,
    petTransport: false,
    status: false,
    locations: [],
    passengers: this.passengers,
    scheduledTime: ''
  };

  constructor(private mapService: MapService, private authService: AuthService, public matDialog: MatDialog, public passengerService: PassengerService, public rideService: RideService, public driverService: DriverService) {}

  ngOnInit() {

    this.driverId = this.authService.getId();
    this.initializeWebSocketConnection();
    }

  initializeWebSocketConnection() {
    // serverUrl je vrednost koju smo definisali u registerStompEndpoints() metodi na serveru
    let ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    let that = this;

    this.stompClient.connect({}, function () {
      that.isLoaded = true;
      that.openSocket()
    });

  }

  openSocket() {
    if (this.isLoaded) {
      this.stompClient.subscribe("/topic/driver/" + this.driverId, (message: { body: string; }) => {
        this.handleResult(message);
        this.openModal();
      });
    }
  }

  // Funkcija koja se poziva kada server posalje poruku na topic na koji se klijent pretplatio
  handleResult(rideResponse: { body: string; }) {
    if (rideResponse.body) {
      this.ride = JSON.parse(rideResponse.body);
    }
  }

    openModal() {
      
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.id = "modal-component";
      dialogConfig.height = "350px";
      dialogConfig.width = "600px";
      dialogConfig.data = this.ride;

      const modalDialog = this.matDialog.open(AcceptRideComponent, dialogConfig);
      let that = this;

      modalDialog.afterClosed().subscribe(result => {
        if (result) {
          console.log("closed");
          if (result === "accepted") {
            that.currentActiveRide = true;
            this.departure = this.ride.locations[0].departure.address;
            this.destination = this.ride.locations[0].destination.address;
            that.setPassenger();
          } else {
            that.openRejection();
          }
        }
      });
    }

    openRejection() {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.id = "rejection-component";
      dialogConfig.height = "350px";
      dialogConfig.width = "600px";
      dialogConfig.data = this.ride;

      const modalDialog = this.matDialog.open(RejectRideComponent, dialogConfig);
      let that = this;
    }

    setPassenger() {
      console.log(this.currentActiveRide);
      this.passengerService.getPassenger(this.ride.passengers[0].id).subscribe({
        next: (res) => {
          console.log(res);
          this.name = res.name + " " + res.surname;
          this.email = res.email;
      },
    });
    }

    startRide() {
      let that = this;
      this.rideService.startRide(this.ride.id).subscribe({
        next: (res) => {
          that.started = true;
        },
        error: (error) => {
          // if (error instanceof HttpErrorResponse) {
          //   this.hasError = true;
          // }
        }
      });

    }

    endRide() {
      let that = this;
      this.rideService.endRide(this.ride.id).subscribe({
        next: (res) => {
          that.started = false;
          that.currentActiveRide = false;
        },
        error: (error) => {
        }
      });
    }

    sendPanic() {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.id = "panic-component";
      dialogConfig.height = "350px";
      dialogConfig.width = "600px";
      dialogConfig.data = this.ride;
      this.currentActiveRide = false;
      const modalDialog = this.matDialog.open(PanicComponent, dialogConfig);
      let that = this;
    }
}
