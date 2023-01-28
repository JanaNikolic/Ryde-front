import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PanicRequest } from 'src/app/model/request/PanicRequest';
import { RideResponse } from 'src/app/model/response/RideResponse';
import { RideService } from 'src/app/services/ride/ride.service';
import { AcceptRideComponent } from '../accept-ride/accept-ride.component';

@Component({
  selector: 'app-panic',
  templateUrl: './panic.component.html',
  styleUrls: ['./panic.component.css']
})
export class PanicComponent {
  constructor(public dialogRef: MatDialogRef<PanicComponent>, @Inject(MAT_DIALOG_DATA) public data: RideResponse, public rideService: RideService) { }

  panic: PanicRequest = { 
    reason : ""
  }

  givenReason: string = "";

  ngOnInit() {
  }

  sendPanic() {
    let reason = document.getElementById("reason");
    if (reason != null) {
      this.panic.reason = this.givenReason;
      this.rideService.panic(this.data.id, this.panic).subscribe({
        next: (res) => {
          console.log(res);
        }
      });
      this.dialogRef.close();
    }
  }

  close() {
    this.dialogRef.close();
  }
}
