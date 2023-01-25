import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Chart, registerables } from 'node_modules/chart.js';
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
    start: new FormControl(new Date(year, month, todayDate - 3)),
    end: new FormControl(new Date(year, month, todayDate)),
  });
  constructor(private rideService: RideService) { }
  chartRides!: Chart;
  chartTotalCost!: Chart;
  ridesPerDay!: Map<String, Number>;
  totalCostPerDay!: Map<String, Number>;
  totalRides!: number;
  averageRides!: number;
  totalCost!: number;
  averageCost!: number;
  validForm: Boolean = false;

  ngOnInit(): void { this.totalRides = 0;
    this.totalCost = 0;
    this.averageCost = 0;
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

    this.chartTotalCost = new Chart('totalCostPerDay', {
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
            +start_date;
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
            +end_date;
          this.rideService.getRidesPerDay( start, end)
            .subscribe(
              (ridesPerDay) => {
  
                this.ridesPerDay = ridesPerDay;
                this.updateChartRides(Array.from(Object.keys(this.ridesPerDay)), Array.from(Object.values(this.ridesPerDay)));
                this.totalRides = 0;
                let counter:number =0;
                for (let value in Object.values(this.ridesPerDay)) {
                  counter++;
                  this.totalRides += Number(Object.values(this.ridesPerDay)[value]);
                  this.averageRides = this.totalRides/counter;
                }
              }
            );
            this.rideService.getTotalCostPerDay( start, end)
          .subscribe(
            (totalCostPerDay) => {
              
              this.totalCostPerDay = totalCostPerDay;
              this.updateChartTotalCost(Array.from(Object.keys(this.totalCostPerDay)), Array.from(Object.values(this.totalCostPerDay)));
              this.totalCost = 0;
              let counter:number =0;
              for (let value in Object.values(this.totalCostPerDay)) {
                counter++;
                this.totalCost += Number(Object.values(this.totalCostPerDay)[value]);
                this.averageCost = this.totalCost/counter;
              }

            }
          );
      }
    }
  
    updateChartRides(labelData: any, mainData: any) {
      this.chartRides.data.labels = labelData;
      this.chartRides.data.datasets[0].data = mainData
      this.chartRides.update();
    }

    updateChartTotalCost(labelData: any, mainData: any) {
      this.chartTotalCost.data.labels = labelData;
      this.chartTotalCost.data.datasets[0].data = mainData
      this.chartTotalCost.update();
    }
}
