
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environment/environment';
import { Driver } from 'src/app/model/Driver';
@Injectable({
    providedIn: 'root'
  })
  export class DriverService {
  
    constructor(private http: HttpClient) { }
  
  
    get(driverId:number):Observable<Driver>{
      console.log((environment.apiHost+'/api/driver/' + driverId));
      return this.http.get<Driver>(environment.apiHost+'/api/driver/' + driverId);
      
      
    }

    add(driver: any): Observable<any> {
      const options: any = {
        responseType: 'text',
      };
      return this.http.post<Driver>(environment.apiHost + '/api/driver',driver, options);
    }


      
  
    getAll():Observable<Driver[]>{
      return this.http.get<Driver[]>(environment.apiHost + '/api/driver');
    }
  }