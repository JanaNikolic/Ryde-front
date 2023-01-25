
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environment/environment';
import { Driver } from 'src/app/model/Driver';
import { pageDriver } from 'src/app/model/Driver';
import { Vehicle } from 'src/app/model/Vehicle';
import { pageRide } from 'src/app/model/Ride';
import { WorkingHourResponse } from 'src/app/model/response/WorkingHourResponse';
@Injectable({
    providedIn: 'root'
  })
  export class DriverService {
  
    constructor(private http: HttpClient) { }
  
  
    getDriver(driverId:number):Observable<Driver>{
      console.log((environment.apiHost+'/api/driver/' + driverId));
      return this.http.get<Driver>(environment.apiHost+'/api/driver/' + driverId);
      
      
    }

    addDriver(driver: any): Observable<any> {
      
      return this.http.post<Driver>(environment.apiHost + '/api/driver',driver);
    }

    getVehicle(driverId:number):Observable<Vehicle>{
      return this.http.get<Vehicle>(environment.apiHost+'/api/driver/' + driverId + '/vehicle')
    }


      
  
    getAllDrivers():Observable<pageDriver>{
      return this.http.get<pageDriver>(environment.apiHost + '/api/driver');
    }

    addVehicle(driverId:number, vehicle: any): Observable<any> {
      const options: any = {
        responseType: 'text',
      };
      return this.http.post<Vehicle>(environment.apiHost + '/api/driver/' + driverId + '/vehicle',vehicle, options);
    }


    getDriverRides(driverId:number):Observable<pageRide>{
      return this.http.get<pageRide>(environment.apiHost + '/api/driver/' + driverId + '/ride')

    }

    startWorkingHour(driverId:number):Observable<WorkingHourResponse>{
      return this.http.post<WorkingHourResponse>(environment.apiHost + '/api/driver/' + driverId + '/working-hour', null)
    }

    endWorkingHour(driverId:number):Observable<WorkingHourResponse>{
      return this.http.put<WorkingHourResponse>(environment.apiHost + '/api/driver/working-hour/' + driverId, null)
    }
  }