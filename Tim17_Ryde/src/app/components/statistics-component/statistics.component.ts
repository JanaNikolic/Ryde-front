import { Component, Input, OnInit } from '@angular/core';
import { Chart, registerables } from 'node_modules/chart.js';
import { DriverService } from 'src/app/services/driver/driver.service';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RideCountResponse, MoneyResponse, KilometersResponse } from 'src/app/model/Ride';
Chart.register(...registerables);

const today = new Date();
const todayDate = today.getDate();
const month = today.getMonth();
const year = today.getFullYear();

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {


  constructor(private driverService: DriverService, private route: ActivatedRoute) { }

  campaignOne = new FormGroup({
    start: new FormControl(new Date(year, month, todayDate - 3)),
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

  ngOnInit(): void {
    this.totalKilometers = 0;
    this.averageKilometers = 0;
    this.totalRides = 0;
    this.totalEarnings = 0;
    this.averageEarnings = 0;
    this.averageRides = 0;
    this.chartRides = new Chart('ridesPerDay', {
      type: 'bar',
      data: {
        labels: [0, 0, 0],
        datasets: [{
          label: 'Rides per day',
          data: [0, 0, 0],
          backgroundColor: ['rgba(0, 0, 0, 1)'],
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
        labels: [0, 0, 0],
        datasets: [{
          label: 'Earnings per day',
          data: [0, 0, 0],
          backgroundColor: ['rgba(255, 99, 132, 1)'],
          borderColor: [
            'rgba(255, 99, 132, 1)'
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
          backgroundColor: ['rgba(255, 99, 132, 1)'],
          borderColor: [
            'rgba(255, 99, 132, 1)'
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
  }

  Submit() {

    if (this.campaignOne.valid) {
      this.validForm = true;
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
}


