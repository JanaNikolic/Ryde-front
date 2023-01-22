import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxMatTimepickerComponent } from 'ngx-mat-timepicker';
import { isEmpty, Observable } from 'rxjs';
import { MapService } from 'src/app/services/map/map.service';
import { DateTime } from 'ts-luxon';

@Component({
  selector: 'app-create-ride',
  templateUrl: './create-ride.component.html',
  styleUrls: ['./create-ride.component.css']
})
export class CreateRideComponent implements OnInit {

  // toppings = this._formBuilder.group({
  //   pepperoni: false,
  //   extracheese: false,
  //   mushroom: false,
  // });

  // constructor(private _formBuilder: FormBuilder) {}

  // date = new FormControl(new Date());
  // departure: any;
  // destination: any;
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
  friendEmail: FormControl = new FormControl('', {validators: [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]});

  constructor(private mapService: MapService, private router: Router, private formBuilder: FormBuilder) { }

  // picker: any;
  // date: string = new Date().toISOString;

  imageStandard: any = "assets/images/standard.png";
  imageLuxry: any = "assets/images/luxury.png";
  imageVan: any = "assets/images/van.png";

  ngOnInit(): void {
    // this.selectedFromAddress$ = this.CreateRideForm.controls['departure'];
    // this.selectedToAddress$;
    // throw new Error('Method not implemented.');

    this.CreateRideForm = this.formBuilder.group({
      departure: new FormControl('', { validators: [Validators.required, Validators.minLength(5)], nonNullable: true }),
      destination: new FormControl('', { validators: [Validators.required, Validators.minLength(5)], nonNullable: true }),
      babyTransport: new FormControl(),
      petTransport: new FormControl(),
      vehicleType: new FormControl(),
      date: new FormControl(new Date()),
      selectedTime: new FormControl(DateTime.local())
      // standard: new FormControl(),
      // luxury: new FormControl(),
      // van: new FormControl(),
      // serializedDate = new FormControl(new Date().toISOString()),
    });

    this.selectedFromAddress = this.CreateRideForm.get('departure');
    this.selectedToAddress = this.CreateRideForm.get('destination');

    const today = new Date();
    this.date.setHours(this.date.getHours() + 5);
    if (today.getDate == this.date.getDate) {
      this.CreateRideForm.controls['date'].disable();
    }

    this.CreateRideForm.controls['vehicleType'].setValue('standard');

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

  ngAfterViewInit() {
    // setTimeout(() => {
    //   this.mapService.setFromAddress(this.departure + ", Novi Sad");
    //   console.log(this.departure);

    //   this.mapService.setToAddress(this.destination + ", Novi Sad");
    //   console.log(this.destination);

    //   this.mapService.selectedFromAddress$.subscribe(data => {
    //     this.departure = data.display_name;
    //   });

    //   this.mapService.selectedToAddress$.subscribe(data => {
    //     this.destination = data.display_name;
    //   });


    // }, 3000)

    //   this.selectedFromAddress.valueChanges.subscribe(
    //     (value: string) => {
    //       if (value != null && value.length > 5) {
    //         console.log(value);
    //         this.selectedFromAddress.setValue(value);
    //         this.mapService.setFromAddress(value + ", Novi Sad");
    //       }

    //     }
    //   );

    //   this.selectedToAddress.valueChanges.subscribe(
    //     (value: string) => {
    //       if (value != null && value.length > 5) {
    //         this.destination = value;
    //         this.mapService.setToAddress(value + ", Novi Sad");
    //       }
    //     }
    //   );

    //   this.mapService.selectedFromAddress$.subscribe(data => {
    //     // console.log(data);
    //     this.departure = data.display_name;
    //   });

    //   this.mapService.selectedToAddress$.subscribe(data => {
    //     // console.log(data);
    //     if (data != null) {
    //       this.destination = data.display_name;
    //     }
    //   });
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
      letter = letter.toUpperCase().substring(0,1);

      f.textContent = letter; 
      divFriends.appendChild(f);
      this.friendEmail.setValue('');
    }
    
  }

  createRide() {
    if (this.CreateRideForm.valid) {

      console.log(this.CreateRideForm);
    }
    // check if time is not null

    // if null schedule sor now


    // else schedule for future
  }

}
