import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { Passenger } from 'src/app/model/Passenger';
import { PassengerUpdateResponse } from 'src/app/model/response/PassengerUpdateResponse';
import { RideResponse } from 'src/app/model/response/RideResponse';
import { AuthService } from 'src/app/services/auth/auth.service';
import { PassengerService } from 'src/app/services/passenger/passenger.service';
import { ChangePasswordComponent } from '../change-password/change-password.component';

@Component({
  selector: 'app-edit-passenger',
  templateUrl: './edit-passenger.component.html',
  styleUrls: ['./edit-passenger.component.css']
})
export class EditPassengerComponent {

  editRequest: PassengerUpdateResponse = {
    id: 0,
    name: "",
    surname: "",
    email: "",
    telephoneNumber: "",
    address: "",
    profilePicture: ""
  }

  EditForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(1)]),
    surname: new FormControl('', [Validators.required, Validators.minLength(1)]),
    email: new FormControl('', [Validators.required, Validators.minLength(1)]),
    telephoneNumber: new FormControl('', [Validators.required, Validators.minLength(1)]),
    address: new FormControl('', [Validators.required, Validators.minLength(1)]),
  })

  constructor(private matDialog: MatDialog, public snackBar: MatSnackBar, public dialogRef: MatDialogRef<EditPassengerComponent>, @Inject(MAT_DIALOG_DATA) public data: Passenger, private passengerService: PassengerService, private authService:AuthService) {}

  ngOnInit() : void {
    this.EditForm.controls['name'].setValue(this.data.name);
    this.EditForm.controls['surname'].setValue(this.data.surname);
    this.EditForm.controls['email'].setValue(this.data.email);
    this.EditForm.controls['email'].disable();
    this.EditForm.controls['address'].setValue(this.data.address);
    this.EditForm.controls['telephoneNumber'].setValue(this.data.telephoneNumber);
  }

  edit() {
    this.editRequest.address = this.EditForm.value.address as string;
    this.editRequest.name = this.EditForm.value.name as string;
    this.editRequest.surname = this.EditForm.value.surname as string;
    this.editRequest.email = this.data.email;
    this.editRequest.telephoneNumber = this.EditForm.value.telephoneNumber as string;
    this.passengerService.edit(this.authService.getId(), this.editRequest).subscribe({
      next: (res) => {
        let snackBarRef = this.snackBar.open('Edit successful!', "", {duration: 2000});
        this.dialogRef.close();
      }
    })

  }

  cancel() {
    this.dialogRef.close();
  }

  changePassword() {
    this.dialogRef.close();
    const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.id = "edit-password";
      dialogConfig.height = "300px";
      dialogConfig.width = "450px";
      dialogConfig.data = this.data;

      const modalDialog = this.matDialog.open(ChangePasswordComponent, dialogConfig);
  }
}
