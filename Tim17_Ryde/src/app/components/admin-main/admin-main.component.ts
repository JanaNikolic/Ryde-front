import { Component, OnInit} from '@angular/core';
import { Driver } from 'src/app/model/Driver';
import { DriverService } from 'src/app/services/driver/driver.service';

@Component({
  selector: 'app-admin-main',
  templateUrl: './admin-main.component.html',
  styleUrls: ['./admin-main.component.css']
})
export class AdminMainComponent implements OnInit{

  mapa: Map<String, Object> = new Map<String,Object>();

  driver1: Driver = {name: '',
  surname: '',
  telephoneNumber: '',
  email: '',
  profilePicture: '',
  password: '',
  address: '',
  blocked: false,
  active: false};
  drivers1: Driver[] = [];
  

  constructor(private driverService: DriverService) {}
  ngOnInit(): void {
    
    this.driverService.getAllDrivers()
    .subscribe(
      
      (pageDriver) => {
        console.log(this.driver1.blocked);
        this.drivers1 = pageDriver.drivers; console.log(this.drivers1[0].blocked);
        /*this.drivers1.forEach(function(driver){
            driver.blocked = false;
            driver.active = false;
            //TODO TREBA DA VRATI I DA LI JE VOZAC ACTIVE I BLOKIRAN DA ZNA DA LI DA BUDE CRVEN ILI ZELEN
        })*/
      
      }
    
    );

    

    
    

    
  }

  

}
