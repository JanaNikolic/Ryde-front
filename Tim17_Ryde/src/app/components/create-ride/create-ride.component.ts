import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxMatTimepickerComponent } from 'ngx-mat-timepicker';
import { MapService } from 'src/app/services/map/map.service';

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

  date = new FormControl(new Date());
  CreateRideForm = new FormGroup({  
    departure: new FormControl('', { validators: [Validators.required, Validators.minLength(5)], nonNullable: true }),
    destination: new FormControl('', { validators: [Validators.required, Validators.minLength(5)], nonNullable: true }),
    babyTransport: new FormControl(),
    petTransport: new FormControl(),
    selectedTime: new FormControl(),
    vehicleType: new FormControl(),
    // standard: new FormControl(),
    // luxury: new FormControl(),
    // van: new FormControl(),
    // serializedDate = new FormControl(new Date().toISOString()),
  });
timePicker: any;


  constructor(private MapService: MapService, private router: Router) {}

  selectedFromAddress: string = '';
  selectedToAddress: string = '';
  picker: any;
  // date: string = new Date().toISOString;

  imageStandard: any = "assets/images/standard.png";
  imageLuxry: any = "assets/images/luxury.png";
  imageVan: any = "assets/images/van.png";

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }

  createRide() { }

}
