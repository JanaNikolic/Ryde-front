import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Passenger } from 'src/app/model/Passenger';
import { PasswordChangeRequest } from 'src/app/model/request/PasswordChangeRequest';
import { PasswordResetRequest } from 'src/app/model/request/PasswordResetRequest';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user/user.service';
import { ChangePasswordComponent } from '../change-password/change-password.component';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  EditForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.minLength(1)]),
    newPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
    resetCode: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(4)])
  });

  request: PasswordResetRequest = {
    newPassword: '',
    code: ''
  }

  emailSent:boolean = false;

  constructor(public snackBar: MatSnackBar, public dialogRef: MatDialogRef<ResetPasswordComponent>, @Inject(MAT_DIALOG_DATA) public data: Passenger, private userService: UserService, private authService:AuthService) {}

  ngOnInit() {}


  changePassword() {
    this.userService.resetCode(this.EditForm.value.email as string).subscribe({
      next: (res) => {
        this.emailSent = true;
      }
    })
  }

  resetPassword() {
    this.request.newPassword = this.EditForm.value.newPassword as string;
    this.request.code = this.EditForm.value.resetCode as string;
    this.userService.resetPassword(this.EditForm.value.email as string, this.request).subscribe({
      next: (res) => {
        this.dialogRef.close();
        let snackBarRef = this.snackBar.open('Succesfully reset password!', "", {duration: 2000});
      }
    })

  }
}
