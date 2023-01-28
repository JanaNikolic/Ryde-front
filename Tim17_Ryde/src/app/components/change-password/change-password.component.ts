import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Passenger } from 'src/app/model/Passenger';
import { PasswordChangeRequest } from 'src/app/model/request/PasswordChangeRequest';
import { AuthService } from 'src/app/services/auth/auth.service';
import { PassengerService } from 'src/app/services/passenger/passenger.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {

  EditForm = new FormGroup({
    oldPassword: new FormControl('', [Validators.required, Validators.minLength(1)]),
    newPassword: new FormControl('', [Validators.required, Validators.minLength(1)])
  });

  constructor(public snackBar: MatSnackBar, public dialogRef: MatDialogRef<ChangePasswordComponent>, @Inject(MAT_DIALOG_DATA) public data: Passenger, private userService: UserService, private authService:AuthService) {}

  ngOnInit() {}
  changePassword() {
    let request: PasswordChangeRequest = {
      oldPassword: this.EditForm.value.oldPassword as string,
      newPassword: this.EditForm.value.newPassword as string
    }


    this.userService.changePassword(this.authService.getId(), request).subscribe({
      next: (res) => {
        this.dialogRef.close();
        let snackBarRef = this.snackBar.open('Edit successful!', "", {duration: 2000});
        localStorage.removeItem("user");
      }
    })

  }
}
