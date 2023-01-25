import { Component, Input, OnInit } from '@angular/core';
import { Chart, registerables } from 'node_modules/chart.js';
import { DriverService } from 'src/app/services/driver/driver.service';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
  totalRides!: number;
  totalEarnings!: number;
  earningsPerDay!: Map<String, Number>;
  ridesPerDay!: Map<String, Number>;
  validForm: Boolean = false;
  dates!: String[];
  rides!: Number[];
  chartRides!: Chart;
  chartEarnings!: Chart;
  averageEarnings!: number;
  averageRides!: number;



  ngOnInit(): void {
    this.totalRides = 0;
    this.totalEarnings = 0;
    this.averageEarnings = 0;
    this.averageRides = 0;
    this.chartRides = new Chart('ridesPerDay', {
      type: 'bar',
      data: {
        labels: [2, 1, 0],
        datasets: [{
          label: 'Rides per day',
          data: [1, "dsda", "dsda"],
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

    this.chartEarnings = new Chart('earningsPerDay', {
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
      this.route.params.subscribe((params) => {
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


        this.driverService.getRidesPerDay(+params['driverId'], start, end)
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

        this.driverService.getEarningsPerDay(+params['driverId'], start, end)
          .subscribe(
            (earningsPerDay) => {
              console.log(earningsPerDay);
              this.earningsPerDay = earningsPerDay;
              this.updateChartEarnings(Array.from(Object.keys(this.earningsPerDay)), Array.from(Object.values(this.earningsPerDay)));
              this.totalEarnings = 0;
              let counter:number =0;
              for (let value in Object.values(this.earningsPerDay)) {
                counter++;
                this.totalEarnings += Number(Object.values(this.earningsPerDay)[value]);
                this.averageEarnings = this.totalEarnings/counter;
              }

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

  updateChartEarnings(labelData: any, mainData: any) {
    this.chartEarnings.data.labels = labelData;
    this.chartEarnings.data.datasets[0].data = mainData
    this.chartEarnings.update();
  }
}


