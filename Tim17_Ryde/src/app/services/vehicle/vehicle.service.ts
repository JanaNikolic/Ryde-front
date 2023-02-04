import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environment/environment';
import { Locations } from 'src/app/model/Locations';
import { Vehicle } from 'src/app/model/Vehicle';
@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  constructor(private http: HttpClient) { }


  

  getAll():Observable<Vehicle[]>{
    return this.http.get<Vehicle[]>(environment.apiHost + '/api/vehicle');
  }

  updateLocation(vehicleId: number, location: Locations): Observable<any> {
    return this.http.put<any>(environment.apiHost+'/api/vehicle/' + vehicleId + '/location', location);
  }

  
}