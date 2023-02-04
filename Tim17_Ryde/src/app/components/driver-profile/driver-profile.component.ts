import { Component } from '@angular/core';
import { DriverService } from 'src/app/services/driver/driver.service';
import { Chart, registerables } from 'node_modules/chart.js';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { Driver } from 'src/app/model/Driver';
import { Vehicle } from 'src/app/model/Vehicle';
import { KilometersResponse, MoneyResponse, Ride, RideCountResponse } from 'src/app/model/Ride';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EditDriverComponent } from '../edit-driver/edit-driver.component';
Chart.register(...registerables);

const today = new Date();
const todayDate = today.getDate();
const month = today.getMonth();
const year = today.getFullYear();




@Component({
  selector: 'app-driver-profile',
  templateUrl: './driver-profile.component.html',
  styleUrls: ['./driver-profile.component.css']
})
export class DriverProfileComponent {

  constructor(private driverService: DriverService, private route: ActivatedRoute, private matDialog: MatDialog){
  
  }
  
  campaignOne = new FormGroup({
    start: new FormControl(new Date(year, month-1, todayDate)),
    end: new FormControl(new Date(year, month, todayDate)),
  });
  
  chartRides!: Chart;
  chartMoney!: Chart;
  chartKilometers!: Chart;
  rideCount!: RideCountResponse;
  moneyCount!: MoneyResponse;
  kilometersCount!: KilometersResponse;
  totalKilometers!: number;
  averageKilometers!: number;
  totalRides!: number;
  averageRides!: number;
  totalEarnings!: number;
  averageEarnings!: number;
  validForm: Boolean = false;
  rides: Ride[] = [];
  driverInfo: boolean = true;
  vehicleInfo: boolean = false;
  statisticInfo: boolean = false;
  model = "";
  numOfSeats = 0;
  type = "";
  babyTransport = false;
  petTransport = false;
  registration = "";
  
  driver: Driver = {
    id: 1,
    name: '',
    surname: '',
    telephoneNumber: '',
    email: '',
    password: '',
    profilePicture: '',
    address: '',
    blocked: false,
    active: false,
    activeRide: false
  };
  vehicle: Vehicle = {
    vehicleType: '',
    model: '',
    licenseNumber: '',
    passengerSeats: 0,
    babyTransport: false,
    petTransport: false,
    currentLocation: null!,
  };
  


  ngOnInit(): void {

    this.route.params.subscribe((params) => {
      this.driverService.getVehicle(+params['driverId'])
      .subscribe(
        (res) => {    
        this.vehicle = res;
        this.model = res.model;
        this.babyTransport = res.babyTransport;
        this.petTransport = res.petTransport;
        this.numOfSeats = res.passengerSeats;
        this.registration = res.licenseNumber;
        this.type = res.vehicleType;
    })
  });

    this.route.params.subscribe((params) => {
      this.driverService.getDriver(+params['driverId'])
      .subscribe(
        (driver) => {    
          this.driver = driver;
        }
      ); 
  

let start:string = this.getStartDateValue();
let end:string = this.getEndDateValue();

this.chartRides = new Chart('ridesPerDay', {
  type: 'bar',
  data: {
    labels: [0, 0, 0],
    datasets: [{
      label: 'Rides per day',
      data: [0, 0, 0],
      backgroundColor: ['#01ACAB'],
      borderColor: [
        'rgba(0, 0, 0, 1)'
      ],
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});

this.chartMoney = new Chart('earningsPerDay', {
  type: 'bar',
  data: {
    
    datasets: [{
      label: 'Earnings per day',
      data: [],
      backgroundColor: ['#01ACAB'],
      borderColor: [
        'rgba(0, 0, 0, 1)'
      ],
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});

this.chartKilometers = new Chart('kilometersPerDay', {
  type: 'bar',
  data: {
    labels: [0, 0, 0],
    datasets: [{
      label: 'kilometers per day',
      data: [0, 0, 0],
      backgroundColor: ['#01ACAB'],
      borderColor: [
        'rgba(0, 0, 0, 1)'
      ],
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});

this.driverService.getRidesPerDay(+params['driverId'], start, end)
          .subscribe(
            (rideCount) => {
              this.rideCount = rideCount;
              this.updateChartRides(Array.from(Object.keys(this.rideCount.countsByDay)), Array.from(Object.values(this.rideCount.countsByDay)));
              this.averageRides = this.rideCount.averageCount;
              this.totalRides = rideCount.totalCount;
            }
          );

        this.driverService.getMoneyPerDay(+params['driverId'], start, end)
          .subscribe(
            (moneyCount) => {
              this.moneyCount = moneyCount;
              this.updateChartMoney(Array.from(Object.keys(this.moneyCount.money)), Array.from(Object.values(this.moneyCount.money)));
              this.totalEarnings = this.moneyCount.totalCount;
              this.averageEarnings = this.moneyCount.averageCount;
            }
          );

        this.driverService.getKilometersPerDay(+params['driverId'], start, end)
          .subscribe(
            (kilometersCount) => {
              console.log(this.kilometersCount);
              this.kilometersCount = kilometersCount;
              this.updateChartKilometers(Array.from(Object.keys(this.kilometersCount.kilometersByDay)), Array.from(Object.values(this.kilometersCount.kilometersByDay)));
              this.totalKilometers = this.kilometersCount.totalCount;
              this.averageKilometers = this.kilometersCount.averageCount;
            }
          );});

  }

  Submit() {

    if (this.campaignOne.valid) {
      this.validForm = true;
      let start:string = this.getStartDateValue();
      let end:string = this.getEndDateValue();
      this.route.params.subscribe((params) => {

        this.driverService.getRidesPerDay(+params['driverId'], start, end)
          .subscribe(
            (rideCount) => {
              this.rideCount = rideCount;
              this.updateChartRides(Array.from(Object.keys(this.rideCount.countsByDay)), Array.from(Object.values(this.rideCount.countsByDay)));
              this.averageRides = this.rideCount.averageCount;
              this.totalRides = rideCount.totalCount;
            }
          );

        this.driverService.getMoneyPerDay(+params['driverId'], start, end)
          .subscribe(
            (moneyCount) => {
              this.moneyCount = moneyCount;
              this.updateChartMoney(Array.from(Object.keys(this.moneyCount.money)), Array.from(Object.values(this.moneyCount.money)));
              this.totalEarnings = this.moneyCount.totalCount;
              this.averageEarnings = this.moneyCount.averageCount;
            }
          );

        this.driverService.getKilometersPerDay(+params['driverId'], start, end)
          .subscribe(
            (kilometersCount) => {
              console.log(this.kilometersCount);
              this.kilometersCount = kilometersCount;
              this.updateChartKilometers(Array.from(Object.keys(this.kilometersCount.kilometersByDay)), Array.from(Object.values(this.kilometersCount.kilometersByDay)));
              this.totalKilometers = this.kilometersCount.totalCount;
              this.averageKilometers = this.kilometersCount.averageCount;
            }
          );
      });
    }
  }

  updateChartRides(labelData: any, mainData: any) {
    this.chartRides.data.labels = labelData;
    this.chartRides.data.datasets[0].data = mainData
    this.chartRides.update();
  }

  updateChartMoney(labelData: any, mainData: any) {
    this.chartMoney.data.labels = labelData;
    this.chartMoney.data.datasets[0].data = mainData
    this.chartMoney.update();
  }
  updateChartKilometers(labelData: any, mainData: any) {
    this.chartKilometers.data.labels = labelData;
    this.chartKilometers.data.datasets[0].data = mainData
    this.chartKilometers.update();
  }
  editProfile() {
    const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.id = "edit-profile";
      dialogConfig.height = "600px";
      dialogConfig.width = "350px";
      dialogConfig.data = this.driver;

      const modalDialog = this.matDialog.open(EditDriverComponent, dialogConfig);
  }
  

  showDriverInfo(){
    console.log(this.driver)
    this.vehicleInfo = false;
    this.statisticInfo = false
    this.driverInfo = true;
  }

  showVehicleInfo(){
    this.driverInfo = false;
    this.statisticInfo = false;
    this.vehicleInfo = true;
    
  }

  showStatistics(){
    this.driverInfo = false;
    this.vehicleInfo = false;
    this.statisticInfo = true;
    
  }

  getStartDateValue(){
    let start_year: string = this.campaignOne.value.start!.getFullYear().toString();
      let start_month: string = (this.campaignOne.value.start!.getMonth() + 1).toString();
      if (this.campaignOne.value.start!.getMonth() + 1 < 10) {
        start_month = "0" + start_month;
      }
      let start_date: string = this.campaignOne.value.start!.getDate().toString();
      if (this.campaignOne.value.start!.getDate() < 10) {
        start_date = "0" + start_date;
      }
      let start: string =
        start_year +
        "-" +
        start_month +
        "-" +
        start_date;
      return start;
      
  }

  getEndDateValue(){
    let end_year: string = this.campaignOne.value.end!.getFullYear().toString();
      let end_month: string = (this.campaignOne.value.end!.getMonth() + 1).toString();
      if (this.campaignOne.value.end!.getMonth() + 1 < 10) {
        end_month = "0" + end_month;
      }
      let end_date: string = this.campaignOne.value.end!.getDate().toString();
      if (this.campaignOne.value.end!.getDate() < 10) {
        end_date = "0" + end_date;
      }
      let end: string =
        end_year +
        "-" +
        end_month +
        "-" +
        end_date;
      return end;
  }
  
}
