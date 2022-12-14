import { Component } from '@angular/core';

@Component({
  selector: 'app-registered-user-navbar',
  templateUrl: './registered-user-navbar.component.html',
  styleUrls: ['./registered-user-navbar.component.css']
})
export class RegisteredUserNavbarComponent {
  ngOnInit(): void {
    
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
