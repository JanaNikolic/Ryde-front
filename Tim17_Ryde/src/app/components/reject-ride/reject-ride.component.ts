import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RejectionRequest } from 'src/app/model/request/RejectionRequest';
import { RideResponse } from 'src/app/model/response/RideResponse';
import { RideService } from 'src/app/services/ride/ride.service';
import { AcceptRideComponent } from '../accept-ride/accept-ride.component';

@Component({
  selector: 'app-reject-ride',
  templateUrl: './reject-ride.component.html',
  styleUrls: ['./reject-ride.component.css']
})
export class RejectRideComponent {
  constructor(public dialogRef: MatDialogRef<AcceptRideComponent>, @Inject(MAT_DIALOG_DATA) public data: RideResponse, public rideService: RideService) { }

  rejection: RejectionRequest = { 
    reason : ""
  }
  givenReason: string = "";

  ngOnInit() {
  }

  sendRejection() {
    let reason = document.getElementById("reason");
    if (reason != null) {
      this.rejection.reason = this.givenReason;
      this.rideService.rejectRide(this.data.id, this.rejection).subscribe({
        next: (res) => {
          console.log(res);
        }
      });
      this.dialogRef.close();
    }
  }
}
