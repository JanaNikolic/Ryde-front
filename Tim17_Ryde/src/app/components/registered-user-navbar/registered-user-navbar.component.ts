import { Component } from '@angular/core';
import { WorkingHourResponse } from 'src/app/model/response/WorkingHourResponse';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DriverService } from 'src/app/services/driver/driver.service';

@Component({
  selector: 'app-registered-user-navbar',
  templateUrl: './registered-user-navbar.component.html',
  styleUrls: ['./registered-user-navbar.component.css']
})
export class RegisteredUserNavbarComponent {
  workingHour: WorkingHourResponse = {
    id: 0,
    start: "",
    end: ""
  }

  toggle: any;
  passengerId:number = 0;
  checked: Boolean = false;
  constructor(public authService: AuthService, public driverService: DriverService){}

  ngOnInit(): void {
    this.passengerId = this.authService.getId();
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
