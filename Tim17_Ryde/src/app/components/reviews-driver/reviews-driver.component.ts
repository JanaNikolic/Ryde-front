import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Chart, registerables } from 'node_modules/chart.js';
import { ReviewResponse } from 'src/app/model/Review';
import { ReviewService } from 'src/app/services/review/review.service';

Chart.register(...registerables);

@Component({
  selector: 'app-reviews-driver',
  templateUrl: './reviews-driver.component.html',
  styleUrls: ['./reviews-driver.component.css']
})
export class ReviewsDriverComponent {

  constructor( private reviewService: ReviewService, private route: ActivatedRoute){}

  driverReviews:ReviewResponse[] = [];
  vehicleReviews:ReviewResponse[] = [];

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
    this.reviewService.getDriverReviews(+params['driverId'])
      .subscribe(
        (driverReviews) => {
          this.driverReviews = driverReviews.results;
          let numOf1 = 0;
          let numOf2 = 0;
          let numOf3 = 0;
          let numOf4 = 0;
          let numOf5 = 0;
          this.driverReviews.forEach(function (review){
            if (review.rating === 1){
              numOf1 ++
            }
            else if(review.rating === 2){
              numOf2++
            }
            else if(review.rating ===3){
              numOf3++
            }
            else if(review.rating ===4){
              numOf4++
            }
            else if(review.rating === 5){
              numOf5++
            }
          });
          
          const chartDriverReviews  = new Chart('driverReviews', {
            type: 'bar',
            data: {
              labels: [1, 2, 3, 4, 5],
              datasets: [{
                data: [numOf1, numOf2, numOf3, numOf4, numOf5],
                backgroundColor: ['#01ACAB'],
                
                borderColor: [
                  'rgba(0, 0, 0, 1)'
                ],
                borderWidth: 1
              }]
            },
            options: {
              scales: {
                x: {
                  ticks: {
                    color: "white"
                  }
                },
                y: {
                  ticks: {
                    color: "white"
                  }
                }
              },
              indexAxis: 'y',
              elements: {
                bar: {
                  borderWidth: 2,
                }
              },
              responsive: true,
              plugins: {
                legend: {
                  display: false,
                },
                title: {
                  display: true,
                  text: 'Driver reviews'
                }
              }
            },
          });
        }

      )
    
      this.reviewService.getVehicleReviews(+params['driverId'])
      .subscribe(
        (vehicleReviews) => {
          this.vehicleReviews = vehicleReviews.results;
          let numOf1 = 0;
          let numOf2 = 0;
          let numOf3 = 0;
          let numOf4 = 0;
          let numOf5 = 0;
          this.vehicleReviews.forEach(function (review){
            if (review.rating === 1){
              numOf1 ++
            }
            else if(review.rating === 2){
              numOf2++
            }
            else if(review.rating ===3){
              numOf3++
            }
            else if(review.rating ===4){
              numOf4++
            }
            else if(review.rating === 5){
              numOf5++
            }
          });
          const chartVehicleReviews  = new Chart('vehicleReviews', {
            type: 'bar',
            data: {
              labels: [1, 2, 3, 4, 5],
              datasets: [{
                data: [numOf1, numOf2, numOf3, numOf4, numOf5],
                backgroundColor: ['#01ACAB'],
                borderColor: [
                  'rgba(0, 0, 0, 1)'
                ],
                borderWidth: 1
              }]
            },
            options: {
              scales: {
                x: {
                  ticks: {
                    color: "white"
                  }
                },
                y: {
                  ticks: {
                    color: "white"
                  }
                }
              },
              indexAxis: 'y',
              elements: {
                bar: {
                  borderWidth: 2,
                }
              },
              responsive: true,
              plugins: {
                legend: {
                  display: false,
                },
                title: {
                  display: true,
                  text: 'Vehicle reviews'
                }
              }
            },
          });
        }
      )
    });



    

    
  }




}
