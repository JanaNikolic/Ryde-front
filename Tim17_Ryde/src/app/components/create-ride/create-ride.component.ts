import { AnimateTimings } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxMatTimepickerComponent } from 'ngx-mat-timepicker';
import { isEmpty, Observable } from 'rxjs';
import { Locations } from 'src/app/model/Locations';
import { Passenger, RideRequest } from 'src/app/model/request/RideRequest';
import { MapService } from 'src/app/services/map/map.service';
import { DateTime } from 'ts-luxon';
import { SearchingForDriverComponent } from '../searching-for-driver/searching-for-driver.component';

@Component({
  selector: 'app-create-ride',
  templateUrl: './create-ride.component.html',
  styleUrls: ['./create-ride.component.css']
})
export class CreateRideComponent implements OnInit {


  CreateRideForm!: FormGroup;

  // timePicker: any;
  date: Date = new Date();
  // time: any = this.date.getTime;
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
  friendEmail: FormControl = new FormControl('', { validators: [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")] });
  friendList: string[] = [];

  constructor(private mapService: MapService, private router: Router, private formBuilder: FormBuilder, private dialogRef: MatDialog) { }

  // picker: any;
  // date: string = new Date().toISOString;

  imageStandard: any = "assets/images/standard.png";
  imageLuxry: any = "assets/images/luxury.png";
  imageVan: any = "assets/images/van.png";

  ngOnInit(): void {
    this.CreateRideForm = this.formBuilder.group({
      departure: new FormControl('', { validators: [Validators.required, Validators.minLength(5)], nonNullable: true }),
      destination: new FormControl('', { validators: [Validators.required, Validators.minLength(5)], nonNullable: true }),
      babyTransport: new FormControl(),
      petTransport: new FormControl(),
      vehicleType: new FormControl(),
      date: new FormControl(new Date()),
      selectedTime: new FormControl()
      // standard: new FormControl(),
      // luxury: new FormControl(),
      // van: new FormControl(),
      // serializedDate = new FormControl(new Date().toISOString()),
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

    this.mapService.selectedFromAddress$.subscribe(data => {
      this.CreateRideForm.controls['departure'].setValue(data.display_name);
      console.log(data.display_name);
    });

    this.mapService.selectedToAddress$.subscribe(data => {
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

  openPopup() {
    const popup = document.getElementById('popup') as HTMLElement | null;
    if (popup != null) {
      if (popup.style.display === "none") {
        popup.style.display = "initial";
      } else {
        popup.style.display = "none";
      }
    }
  }

  addFriend() {
    const divFriends = document.getElementById('friends') as HTMLElement | null;
    if (this.friendEmail.valid && divFriends != null && name != undefined) {
      const f = document.createElement("span");
      f.style.height = '40px';
      f.style.width = '40px';
      f.style.display = 'inline-block';
      f.style.borderRadius = "50%";
      f.style.border = "1px solid #01acac";
      f.style.margin = "0 5px";
      f.style.color = "#D9D9D9";
      f.style.fontSize = "30px";
      f.style.fontWeight = "300";
      f.style.fontFamily = "Outfit";

      let letter = this.friendEmail.value;
      console.log(letter)
      this.friendList.push(letter);
      letter = letter.toUpperCase().substring(0, 1);

      f.textContent = letter;
      divFriends.appendChild(f);


      console.log(this.friendList)
      this.friendEmail.setValue('');
    }

  }

  createRide() {
    if (this.CreateRideForm.valid) {

      // console.log(this.selectedFromAddress);
      // console.log(this.selectedToAddress);


      // console.log(this.CreateRideForm);
      const format: string = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'";

      let fromAddress: string = this.CreateRideForm.get('departure')?.value;
      let toAddress: string = this.CreateRideForm.get('destination')?.value;
      let vehicleType: string = this.CreateRideForm.get('vehicleType')?.value;
      let pets: boolean = this.CreateRideForm.get('petTransport')?.value;
      let babies: boolean = this.CreateRideForm.get('babyTransport')?.value;
      let time: any = this.CreateRideForm.controls['selectedTime']?.value;

      this.selectedFromAddress = fromAddress;
      this.selectedToAddress = toAddress;

      this.mapService.setFromAddress(this.selectedFromAddress + ", Novi Sad");

      this.mapService.setToAddress(this.selectedToAddress + ", Novi Sad");


      // this.mapService.setFromAddress(fromAddress + ", Novi Sad");

      // this.mapService.setToAddress(toAddress + ", Novi Sad");

      if (pets == null) pets = false;
      if (babies == null) babies = false;

      if (time >= DateTime.local().toFormat("HH:mm")) {
        // if date disabled then same date
        time = DateTime.local().set({ hour: +time.split(":")[0], minutes: time.split(":")[1] });
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
        longitude: 0
      }

      let destination: Locations = {
        address: toAddress,
        latitude: 0,
        longitude: 0
      }

      let passengers: Passenger[] = [];

      for (let f in this.friendList) {
        const passenger: Passenger = { id: 0, email: this.friendList[f] };
        passengers.push(passenger);
      }


      let ride: RideRequest = {
        locations: [{
          departure: departure,
          destination: destination
        }],
        passengers: passengers,
        vehicleType: vehicleType,
        babyTransport: babies,
        petTransport: pets,
        scheduledTime: time,
      }

      // TODO send request to back

      this.CreateRideForm.reset(this.CreateRideForm.value);
      console.log(this.selectedFromAddress);
      this.openDialog(ride);
    }
  }

  openDialog(ride: RideRequest) {
    this.dialogRef.open(SearchingForDriverComponent, { disableClose: true });
  }

}
