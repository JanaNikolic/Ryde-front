import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReviewRequest, ReviewResponse } from 'src/app/model/Review';
import { ReviewService } from 'src/app/services/review/review.service';
import { CreateRideComponent } from '../create-ride/create-ride.component';


@Component({
  selector: 'app-rate-driver-vehicle',
  templateUrl: './rate-driver-vehicle.component.html',
  styleUrls: ['./rate-driver-vehicle.component.css']
})
export class RateDriverVehicleComponent {

  constructor(public dialogRef: MatDialogRef<CreateRideComponent>, @Inject(MAT_DIALOG_DATA) public data: number, private reviewService: ReviewService, private snackBar: MatSnackBar) { }

  driverReview: ReviewRequest = {
    rating: 1,
    comment: ''
  }

  vehicleReview: ReviewRequest = {
    rating: 1,
    comment: ''
  }

  rateDriver: number = 1;
  rateVehicle: number = 1;

  CreateReviewForm = new FormGroup({
    driverComment: new FormControl('', [ Validators.maxLength(250), Validators.minLength(3), Validators.required]),
    driverRating: new FormControl(1, Validators.required),
    vehicleComment: new FormControl('', [ Validators.maxLength(250), Validators.minLength(3), Validators.required]),
    vehicleRating: new FormControl(1, Validators.required)
  })

  ngOnInit() {
  }

  sendReview() {
    
    if (this.CreateReviewForm.valid) {
      
      this.reviewService.postDriverReview(this.data, this.driverReview).subscribe({
        next: (res) => {
          console.log(res);
          this.snackBar.open('Your review is succesfuly submited!', "", {duration: 2000});
        },
        error: (error) => {
          this.snackBar.open('Error occured while subbmiting review! Try again', "", {duration: 2000});
        }
      });
      this.reviewService.postVehicleReview(this.data, this.vehicleReview).subscribe({
        next: (res) => {
          console.log(res);
          this.snackBar.open('Your review is succesfuly submited!', "", {duration: 2000});
        },
        error: (error) => {
          this.snackBar.open('Error occured while subbmiting review! Try again', "", {duration: 2000});
        }
      });
      this.dialogRef.close();
    }
  }

  close() {
    this.dialogRef.close();
  }

}
