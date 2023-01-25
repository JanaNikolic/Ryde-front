import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Tim17_Ryde';
  constructor(private authService: AuthService) {}

  ngOnInit() : void {}


  isAdmin() {
    if (this.authService.isLoggedIn()) {
      if (this.authService.getRole()=="ROLE_ADMIN")
      return true;
    }
    return false;
  }

  isRegisteredUser() {
    if (this.authService.isLoggedIn()) {
      if (this.authService.getRole()=="ROLE_PASSENGER" || this.authService.getRole()=="ROLE_DRIVER") {
        return true;
      }
    }
    return false;
  }

  isUnregistered() {
    if (this.authService.isLoggedIn()) {
      return false;
    } else {
      return true
    }
  }
  
}
