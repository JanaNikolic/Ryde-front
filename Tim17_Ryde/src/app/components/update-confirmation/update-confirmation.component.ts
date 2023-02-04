import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DriverUpdateResponse } from 'src/app/model/request/DriverUpdateRequest';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DriverService } from 'src/app/services/driver/driver.service';

@Component({
  selector: 'app-update-confirmation',
  templateUrl: './update-confirmation.component.html',
  styleUrls: ['./update-confirmation.component.css']
})
export class UpdateConfirmationComponent {

  constructor(private matDialog: MatDialog, public snackBar: MatSnackBar, public dialogRef: MatDialogRef<UpdateConfirmationComponent>, @Inject(MAT_DIALOG_DATA) public data: DriverUpdateResponse, private driverService: DriverService, private authService:AuthService) {}
  name:string = '';
  surname:string = '';
  email:string = '';
  address:string = '';
  telephoneNumber:string = '';
  profilePicture:string = '';
  documentImage:string = '';
  ngOnInit() : void {
    this.name = this.data.name;
    this.surname = this.data.surname;
    this.email = this.data.email;
    this.address = this.data.address;
    this.telephoneNumber = this.data.telephoneNumber;
    this.profilePicture = this.data.profilePicture;
    this.documentImage = this.data.documents[0].documentImage;
  }
  cancel() {
    this.dialogRef.close();
  }
  confirmation(){
   
    this.driverService.updateDriver(this.data).subscribe({
      next: (res) => {
        let snackBarRef = this.snackBar.open('Edit successful!', "", {duration: 2000});
        this.dialogRef.close();
      }
    })

  }
  rejection(){
    this.driverService.deleteUpdateRequest(this.data.id).subscribe({
      next: (res) => {
        let snackBarRef = this.snackBar.open('Update request deleted!', "", {duration: 2000});
        this.dialogRef.close();
      }
    })
  }
   
}
