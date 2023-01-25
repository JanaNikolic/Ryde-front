import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  navigation: any; 
  currentRoute!: string;

  constructor(private router: Router){}
  
  ngOnInit(): void {
    this.navigation = document.getElementById("navigation");
    this.router.events.subscribe((event) => {
    if (event instanceof NavigationEnd ) {
      let that = this;
      this.currentRoute = event.url;
      if (event.url == "/register") {
        if (that.navigation  != null) {
          that.navigation.setAttribute("style", "float: left;");
          that.navigation.style.marginLeft = "10%";
        }
      } else {
        if (that.navigation  != null) {
        that.navigation.style.float = "right";
        }
      }}
    }
  );
  }
}