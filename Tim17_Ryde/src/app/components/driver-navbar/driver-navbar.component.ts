import { Component } from '@angular/core';
import { WorkingHourResponse } from 'src/app/model/response/WorkingHourResponse';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DriverService } from 'src/app/services/driver/driver.service';

@Component({
  selector: 'app-driver-navbar',
  templateUrl: './driver-navbar.component.html',
  styleUrls: ['./driver-navbar.component.css']
})
export class DriverNavbarComponent {
  driverId: number = 0;
  workingHour: WorkingHourResponse = {
    id: 0,
    start: "",
    end: ""
  }
  toggle: any;
  checked: Boolean = false;
  constructor(public authService: AuthService, public driverService: DriverService){}

  ngOnInit(): void {
    this.driverId = this.authService.getId();
    this.toggle = document.getElementById("toggle");
    this.getActive();
  }

  ngOnDestroy() : void {
    if (this.workingHour.id != 0) {
    this.driverService.endWorkingHour(this.workingHour.id).subscribe({
      next: (res) => {
        this.workingHour = res;
      }
    })
    }
  }

  getActive() {
    this.driverService.getDriver(this.authService.getId()).subscribe({
      next: (res) => {
        if (res.active == true) {
          this.driverService.getWorkingHour(this.authService.getId()).subscribe({
            next: (result) => {
              this.workingHour = result;
              this.checked = res.active;
            }
          })
        }
      }
    })
  }

  changed(){
    if (this.checked) {
        this.driverService.startWorkingHour(this.authService.getId()).subscribe({
          next: (res) => {
            this.workingHour = res;
          }
        })
    } else {
      this.driverService.endWorkingHour(this.workingHour.id).subscribe({
        next: (res) => {
          this.workingHour = res;
        }
      })
    }
  }

  logout() {
    localStorage.removeItem("user");
  }
  
  openMenu() {
    let element = document.getElementById('navigation');
    if (element != undefined) {
      if (element.style.display == 'none') {
        element.style.display = 'block';
      } else {
        element.style.display = 'none';
      }
    }
  }
}
