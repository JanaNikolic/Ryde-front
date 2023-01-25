import { Component, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RejectionRequest } from 'src/app/model/request/RejectionRequest';
import { RideResponse } from 'src/app/model/response/RideResponse';
import { RideService } from 'src/app/services/ride/ride.service';

@Component({
  selector: 'app-accept-ride',
  templateUrl: './accept-ride.component.html',
  styleUrls: ['./accept-ride.component.css']
})
export class AcceptRideComponent {

  constructor(public dialogRef: MatDialogRef<AcceptRideComponent>, @Inject(MAT_DIALOG_DATA) public data: RideResponse, public rideService: RideService) { }

  departure: string = this.data.locations[0].departure.address;
  destination: string = this.data.locations[0].destination.address;
  passenger: string = this.data.passengers[0].email;
  rejection: RejectionRequest = { 
    reason : "Don't feel like it."
  }

  ngOnInit() {
  }

  actionFunction() {
    this.rideService.acceptRide(this.data.id).subscribe({
      next: (res) => {
        console.log(res);
      }
    });
    this.closeModal("accepted");
  }

  closeModal(result: string) {
    this.dialogRef.close(result);
  }

  rejectFunction() {

    this.rideService.rejectRide(this.data.id, this.rejection);
    this.closeModal("rejected");
  }
}
