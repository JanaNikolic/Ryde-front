import { Component, OnInit} from '@angular/core';
import { Driver } from 'src/app/model/Driver';
import { DriverService } from 'src/app/services/driver/driver.service';

@Component({
  selector: 'app-admin-main',
  templateUrl: './admin-main.component.html',
  styleUrls: ['./admin-main.component.css']
})
export class AdminMainComponent implements OnInit{

  
  driver1: Driver = {name: '',
  surname: '',
  telephoneNumber: '',
  email: '',
  password: '',
  address: ''};
  drivers: Driver[] = [];

  constructor(private driverService: DriverService) {}
  ngOnInit(): void {
    this.driverService.getAll()
    .subscribe(
      (drivers) => (this.drivers = drivers)
    );


    console.log(this.driver1);
    console.log(this.drivers);
    console.log(this.drivers);
    
    

    
  }

  

}
