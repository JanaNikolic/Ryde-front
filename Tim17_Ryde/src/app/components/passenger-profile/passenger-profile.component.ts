import { formatDate, Location } from '@angular/common';
import { Component, Inject, LOCALE_ID } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { Passenger } from 'src/app/model/Passenger';
import {
  FavoriteRidePage,
  FavoriteRideResponse,
} from 'src/app/model/response/FavoriteRidePage';
import { AuthService } from 'src/app/services/auth/auth.service';
import { PassengerService } from 'src/app/services/passenger/passenger.service';
import { RideService } from 'src/app/services/ride/ride.service';
import { EditPassengerComponent } from '../edit-passenger/edit-passenger.component';
Chart.register(...registerables);

@Component({
  selector: 'app-passenger-profile',
  templateUrl: './passenger-profile.component.html',
  styleUrls: ['./passenger-profile.component.css'],
})
export class PassengerProfileComponent {
  passenger!: Passenger;
  name = '';
  email = '';
  address = '';
  phoneNumber = '';
  totalRideCount = 0;
  totalKilometers = 0;
  totalMoney = 0;
  averageRideCount = 0;
  averageKilometers = 0;
  averageMoney = 0;
  chartRides!: Chart;
  chartMoney!: Chart;
  chartDistance!: Chart;
  locations: FavoriteRideResponse[] = [];

  constructor(
    private route: ActivatedRoute,
    private matDialog: MatDialog,
    private rideService: RideService,
    private passengerService: PassengerService,
    private authService: AuthService,
    @Inject(LOCALE_ID) private locale: string,
    private router: Router
  ) {}

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  ngOnInit(): void {
    this.rideService.getFavorites().subscribe({
      next: (res) => {
        this.locations = res.results;
      },
    });

    this.chartRides = new Chart('MyChart', {
      type: 'bar',
      data: {
        labels: [0, 0, 0],
        datasets: [
          {
            barThickness: 50,
            label: 'Rides per day',

            data: [0, 0, 0],
            backgroundColor: ['#01ACAB'],
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            suggestedMin: 0,
            suggestedMax: 8,
            grid: {
              color: ['#D9D9D9'],
              lineWidth: 0.2,
            },
            ticks: {
              // forces step size to be 50 units
              stepSize: 1,
            },
          },
          x: {
            grid: {
              color: ['#D9D9D9'],
              lineWidth: 0.2,
            },
          },
        },
        aspectRatio: 2.5,
      },
    });

    this.chartMoney = new Chart('MoneyChart', {
      type: 'line',
      data: {
        labels: [0, 0, 0],
        datasets: [
          {
            label: 'Money spent',
            data: [0, 0, 0],
            backgroundColor: ['#01ACAB'],
            borderColor: ['#01ACAB'],
            borderWidth: 2,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            suggestedMax: 3000,
            grid: {
              color: ['#D9D9D9'],
              lineWidth: 0.2,
            },
            ticks: {
              stepSize: 100,
            },
          },
          x: {
            grid: {
              color: ['#D9D9D9'],
              lineWidth: 0.2,
            },
          },
        },
        aspectRatio: 2.5,
      },
    });

    this.chartDistance = new Chart('DistanceChart', {
      type: 'line',
      data: {
        labels: [0, 0, 0],
        datasets: [
          {
            label: 'Distance crossed',
            data: [0, 0, 0],
            backgroundColor: ['#01ACAB'],
            borderColor: ['#01ACAB'],
            borderWidth: 2,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            suggestedMax: 30,
            grid: {
              color: ['#D9D9D9'],
              lineWidth: 0.2,
            },
            ticks: {
              stepSize: 2,
            },
          },
          x: {
            grid: {
              color: ['#D9D9D9'],
              lineWidth: 0.2,
            },
          },
        },
        aspectRatio: 2.5,
      },
    });

    this.route.params.subscribe((params) => {
      this.passengerService.getPassenger(+params['passengerId']).subscribe({
        next: (res) => {
          this.passenger = res;
          this.name = res.name + ' ' + res.surname;
          this.email = res.email;
          this.address = res.address;
          this.phoneNumber = res.telephoneNumber;
        },
      });
    });

    let date = new Date();
    let firstDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    let lastDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + 6
    );

    let start: string = formatDate(firstDay, 'yyyy-MM-dd', this.locale);

    let end: string = formatDate(lastDay, 'yyyy-MM-dd', this.locale);

    this.getRideCount(start, end);
    this.getKilometers(start, end);
    this.getMoney(start, end);
  }

  getRideCount(start: string, end: string) {
    this.route.params.subscribe((params) => {
      this.passengerService
        .getRidesPerDay(start, end, +params['passengerId'])
        .subscribe({
          next: (res) => {
            this.totalRideCount = res.totalCount;
            this.averageRideCount = parseFloat(res.averageCount.toFixed(2));
            this.updateChartRides(
              Array.from(Object.keys(res.countsByDay)),
              Array.from(Object.values(res.countsByDay))
            );
          },
        });
    });
  }

  getKilometers(start: string, end: string) {
    this.route.params.subscribe((params) => {
      this.passengerService
        .getKilometersPerDay(start, end, +params['passengerId'])
        .subscribe({
          next: (res) => {
            this.totalKilometers = parseFloat(res.totalCount.toFixed(2));
            this.averageKilometers = parseFloat(res.averageCount.toFixed(2));
            this.updateChartDistance(
              Array.from(Object.keys(res.kilometersByDay)),
              Array.from(Object.values(res.kilometersByDay))
            );
          },
        });
    });
  }

  getMoney(start: string, end: string) {
    this.route.params.subscribe((params) => {
      this.passengerService
        .getMoneyPerDay(start, end, +params['passengerId'])
        .subscribe({
          next: (res) => {
            this.totalMoney = res.totalCount;
            this.averageMoney = parseFloat(res.averageCount.toFixed(2));
            this.updateChartMoney(
              Array.from(Object.keys(res.money)),
              Array.from(Object.values(res.money))
            );
          },
        });
    });
  }

  updateChartRides(labelData: any, mainData: any) {
    this.chartRides.data.labels = labelData;
    this.chartRides.data.datasets[0].data = mainData;
    this.chartRides.update();
  }

  updateChartMoney(labelData: any, mainData: any) {
    this.chartMoney.data.labels = labelData;
    this.chartMoney.data.datasets[0].data = mainData;
    this.chartMoney.update();
  }

  updateChartDistance(labelData: any, mainData: any) {
    this.chartDistance.data.labels = labelData;
    this.chartDistance.data.datasets[0].data = mainData;
    this.chartDistance.update();
  }

  editProfile() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = 'edit-profile';
    dialogConfig.height = '600px';
    dialogConfig.width = '350px';
    dialogConfig.data = this.passenger;

    const modalDialog = this.matDialog.open(
      EditPassengerComponent,
      dialogConfig
    );
  }

  onChange() {
    let firstDay = new Date(
      this.range.value.start.getFullYear(),
      this.range.value.start.getMonth(),
      this.range.value.start.getDate()
    );
    let lastDay = new Date(
      this.range.value.end.getFullYear(),
      this.range.value.end.getMonth(),
      this.range.value.end.getDate()
    );
    let start: string = formatDate(firstDay, 'yyyy-MM-dd', this.locale);
    let end: string = formatDate(lastDay, 'yyyy-MM-dd', this.locale);
    this.getRideCount(start, end);
    this.getKilometers(start, end);
    this.getMoney(start, end);
  }

  deleteFavorite(location: FavoriteRideResponse) {
    this.rideService.deleteFavorite(location.id).subscribe({
      next: (res) => {
        let index = this.locations.indexOf(location);
        this.locations.splice(index, 1);
      },
    });
  }

  orderRide(location: FavoriteRideResponse) {
    // let ride = {
    //   departure: location.locations[0].departure.address,
    //   destination: location.locations[0].destination.address,
    //   vehicleType: location.vehicleType,
    //   petTransport: location.petTransport,
    //   babyTransport: location.babyTransport,
    // };
    this.router.navigate([
      '/get-ryde'],
      {
        queryParams: {
          departure: location.locations[0].departure.address,
          destination: location.locations[0].destination.address,
          vehicleType: location.vehicleType,
          petTransport: location.petTransport,
          babyTransport: location.babyTransport,
        },
      },
    );
  }
}
