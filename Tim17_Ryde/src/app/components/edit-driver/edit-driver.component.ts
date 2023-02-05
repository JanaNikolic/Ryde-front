import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Driver } from 'src/app/model/Driver';
import { DriverUpdateRequest, Document } from 'src/app/model/request/DriverUpdateRequest';
import { PassengerUpdateResponse } from 'src/app/model/response/PassengerUpdateResponse';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DriverService } from 'src/app/services/driver/driver.service';
import { ChangePasswordComponent } from '../change-password/change-password.component';


@Component({
  selector: 'app-edit-driver',
  templateUrl: './edit-driver.component.html',
  styleUrls: ['./edit-driver.component.css']
})
export class EditDriverComponent {
  image = "";
  documentImage = "";
  document:Document = {
    name: "",
    documentImage: ""
  }
  documents: Document[] = [];
  editRequest: DriverUpdateRequest = {
    name: "",
    surname: "",
    email: "",
    telephoneNumber: "",
    address: "",
    profilePicture: "",
    documents: this.documents
  }


  EditForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(1)]),
    surname: new FormControl('', [Validators.required, Validators.minLength(1)]),
    email: new FormControl('', [Validators.required, Validators.minLength(1)]),
    telephoneNumber: new FormControl('', [Validators.required, Validators.minLength(1)]),
    address: new FormControl('', [Validators.required, Validators.minLength(1)]),
  })

  constructor(private matDialog: MatDialog, public snackBar: MatSnackBar, public dialogRef: MatDialogRef<EditDriverComponent>, @Inject(MAT_DIALOG_DATA) public data: Driver, private driverService: DriverService, private authService:AuthService) {}

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
    if (this.image == ""){
      this.editRequest.profilePicture = this.data.profilePicture as string;
     
    }
    else{
      this.editRequest.profilePicture = this.image;
    }
    
    this.document.name = "vozacka dozvola"
    this.document.documentImage = this.documentImage;
    this.editRequest.documents.push(this.document);
  
    this.driverService.postUpdateRequest(this.editRequest).subscribe(
        (res) => {
        console.log(res);
         let snackBarRef = this.snackBar.open('Edit request created!', "", {duration: 2000});
         this.dialogRef.close();
       });
     

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

  inputImage(image: any) {
    const file = image.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        this.image = reader.result!.toString();
    };
  }
  inputDocumentImage(image: any) {
    const file = image.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        this.documentImage = reader.result!.toString();
    };
  }

}
