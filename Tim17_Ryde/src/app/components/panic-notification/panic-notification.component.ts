import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PanicResponse } from 'src/app/model/response/PanicResponse';
import { RideService } from 'src/app/services/ride/ride.service';
import { PanicComponent } from '../panic/panic.component';

@Component({
  selector: 'app-panic-notification',
  templateUrl: './panic-notification.component.html',
  styleUrls: ['./panic-notification.component.css']
})
export class PanicNotificationComponent {
  constructor(public dialogRef: MatDialogRef<PanicComponent>, @Inject(MAT_DIALOG_DATA) public data: PanicResponse) { }

  name = "";
  email = "";
  reason = "";

  ngOnInit() : void {
    this.name = this.data.user.name + " " + this.data.user.surname;
    this.email = this.data.user.email;
    this.reason = this.data.reason;
  }

  close() {
    this.dialogRef.close();
  }
}
