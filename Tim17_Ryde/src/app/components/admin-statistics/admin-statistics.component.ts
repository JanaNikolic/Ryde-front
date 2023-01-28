import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Chart, registerables } from 'node_modules/chart.js';
import { KilometersResponse, MoneyResponse, RideCountResponse } from 'src/app/model/Ride';
import { RideService } from 'src/app/services/ride/ride.service';
Chart.register(...registerables);

const today = new Date();
const todayDate = today.getDate();
const month = today.getMonth();
const year = today.getFullYear();
@Component({
  selector: 'app-admin-statistics',
  templateUrl: './admin-statistics.component.html',
  styleUrls: ['./admin-statistics.component.css']
})
export class AdminStatisticsComponent {
  campaignOne = new FormGroup({
    start: new FormControl(new Date(year, month-1, todayDate)),
    end: new FormControl(new Date(year, month, todayDate)),
  });
  constructor(private rideService: RideService) { }
  chartRides!: Chart;
  chartMoney!: Chart;
  chartKilometers!:Chart;
  rideCount!:RideCountResponse;
  moneyCount!:MoneyResponse;
  kilometersCount!:KilometersResponse;
  totalKilometers!:number;
  averageKilometers!:number;
  totalRides!: number;
  averageRides!: number;
  totalMoney!: number;
  averageMoney!: number;
  validForm: Boolean = false;

  ngOnInit(): void {
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

    this.chartMoney = new Chart('moneyPerDay', {
      type: 'bar',
      data: {
        labels: [0, 0, 0],
        datasets: [{
          label: 'Earnings per day',
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
    this.rideService.getRidesPerDay( start, end)
            .subscribe(
              (rideCount) => {
  
                this.rideCount = rideCount;
                this.updateChartRides(Array.from(Object.keys(this.rideCount.countsByDay)), Array.from(Object.values(this.rideCount.countsByDay)));
                this.averageRides = this.rideCount.averageCount;
                this.totalRides = rideCount.totalCount;
              }
            );
            this.rideService.getMoneyPerDay( start, end)
          .subscribe(
            (moneyCount) => {
              
              this.moneyCount = moneyCount;
              this.updateChartMoney(Array.from(Object.keys(this.moneyCount.money)), Array.from(Object.values(this.moneyCount.money)));
              this.totalMoney = this.moneyCount.totalCount;
              this.averageMoney = this.moneyCount.averageCount;

            }
          );
          this.rideService.getKilometersPerDay( start, end)
          .subscribe(
            (kilometersCount) => {
              
              this.kilometersCount = kilometersCount;
              this.updateChartKilometers(Array.from(Object.keys(this.kilometersCount.kilometersByDay)), Array.from(Object.values(this.kilometersCount.kilometersByDay)));
              this.totalKilometers = this.kilometersCount.totalCount;
              this.averageKilometers = this.kilometersCount.averageCount;
      }
          );
    
  }

    Submit() {

      if (this.campaignOne.valid) {
        this.validForm = true;
        let start:string = this.getStartDateValue();
        let end:string = this.getEndDateValue();
          this.rideService.getRidesPerDay( start, end)
            .subscribe(
              (rideCount) => {
  
                this.rideCount = rideCount;
                this.updateChartRides(Array.from(Object.keys(this.rideCount.countsByDay)), Array.from(Object.values(this.rideCount.countsByDay)));
                this.averageRides = this.rideCount.averageCount;
                this.totalRides = rideCount.totalCount;
              }
            );
            this.rideService.getMoneyPerDay( start, end)
          .subscribe(
            (moneyCount) => {
              
              this.moneyCount = moneyCount;
              this.updateChartMoney(Array.from(Object.keys(this.moneyCount.money)), Array.from(Object.values(this.moneyCount.money)));
              this.totalMoney = this.moneyCount.totalCount;
              this.averageMoney = this.moneyCount.averageCount;

            }
          );
          this.rideService.getKilometersPerDay( start, end)
          .subscribe(
            (kilometersCount) => {
              
              this.kilometersCount = kilometersCount;
              this.updateChartKilometers(Array.from(Object.keys(this.kilometersCount.kilometersByDay)), Array.from(Object.values(this.kilometersCount.kilometersByDay)));
              this.totalKilometers = this.kilometersCount.totalCount;
              this.averageKilometers = this.kilometersCount.averageCount;
      }
          );
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
    updateChartKilometers(labelData: any, mainData: any){
      this.chartKilometers.data.labels = labelData;
      this.chartKilometers.data.datasets[0].data = mainData
      this.chartKilometers.update();
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
