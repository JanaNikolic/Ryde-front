import { Component, OnInit } from '@angular/core';
import { Driver } from 'src/app/model/Driver';
import { DriverService } from 'src/app/services/driver/driver.service';
import { PassengerService } from 'src/app/services/passenger/passenger.service';
import { UserService } from 'src/app/services/user/user.service';
import { Passenger } from 'src/app/model/Passenger';
import { Note } from 'src/app/model/Note';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-main',
  templateUrl: './admin-main.component.html',
  styleUrls: ['./admin-main.component.css']
})
export class AdminMainComponent implements OnInit {

  passengersInfo: boolean = false;
  driversInfo: boolean = true;
  mapa: Map<String, Object> = new Map<String, Object>();

  driver1: Driver = {
    name: '',
    surname: '',
    telephoneNumber: '',
    email: '',
    profilePicture: '',
    password: '',
    address: '',
    blocked: false,
    active: false
  };
  drivers1: Driver[] = [];
  passengers: Passenger[] = [];
  userNotes: Note[] = [];
  showButtons: Boolean = true;
  showNotes: Boolean = false;
  showNoteCreateForm: Boolean = false;
  currentUserId: number = 0;
  currentUserName: string = "";
  noteCreate: Note = {
    message: ""
  };



  constructor(private driverService: DriverService, private userService: UserService, private passengerService: PassengerService) { }
  ngOnInit(): void {

    this.driverService.getAllDrivers()
      .subscribe(

        (pageDriver) => {

          this.drivers1 = pageDriver.results; console.log(this.drivers1[0].blocked);
          console.log(this.drivers1);

        }
      );
    this.passengerService.getAll().subscribe((pagePassenger) => {
      this.passengers = pagePassenger.results;
    })
  }

  CreateNoteForm = new FormGroup({


    message: new FormControl('', [Validators.required, Validators.minLength(1)]),
  })



  blockUser(id: number) {
    if (confirm("Are you sure you want to block user: " + id)) {
      this.userService.
        blockUser(id)
        .subscribe((res: any) => {
        });
    }
  }

  unblockUser(id: number) {
    if (confirm("Are you sure you want to unblock user: " + id)) {
      this.userService.
        unblockUser(id)
        .subscribe((res: any) => {
        });
    }
  }
  getNotesOfUser(id: number, name: string) {
    this.showNoteCreateForm = false;
    this.showButtons = false;
    this.showNotes = true;
    this.currentUserId = id;
    this.currentUserName = name;
    this.userService.getNotes(id).subscribe((pageNote) => {
      this.userNotes = pageNote.results;
    })
  }

  showButtonsDriverPassenger() {
    this.showNoteCreateForm = false;
    this.showNotes = false;
    this.showButtons = true;
  }

  showFormForNoteCreateion() {
    this.showNotes = false;
    this.showButtons = false;
    this.showNoteCreateForm = true;
  }

  showDrivers() {
    this.showNoteCreateForm = false;
    this.passengersInfo = false;
    this.driversInfo = true;
  }

  showPassengers() {
    this.driversInfo = false;
    this.passengersInfo = true;

  }
  createNote() {
    if (!this.CreateNoteForm.valid) {
      alert("Can't be blank note!");
    }
    else {
      this.noteCreate.message = this.CreateNoteForm.value.message as string
      this.userService.createNote(this.noteCreate, this.currentUserId).subscribe((res: any) => {
      });
      alert("Note created!");
      this.showButtonsDriverPassenger();
    }
  }



}
