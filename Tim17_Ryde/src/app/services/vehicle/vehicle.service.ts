import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environment/environment';
import { Vehicle } from 'src/app/model/Vehicle';
@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  constructor(private http: HttpClient) { }


  get(vehicleId:number):Observable<Vehicle>{
    return this.http.get<Vehicle>(environment.apiHost+'/api/vehicle/' + vehicleId);
    
  }

  getAll():Observable<Vehicle[]>{
    return this.http.get<Vehicle[]>(environment.apiHost + '/api/vehicle');
  }


  add(driverId:number, vehicle: any): Observable<any> {
    const options: any = {
      responseType: 'text',
    };
    return this.http.post<Vehicle>(environment.apiHost + '/api/driver/' + driverId + '/vehicle',vehicle, options);
  }
}