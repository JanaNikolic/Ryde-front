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


  

  getAll():Observable<Vehicle[]>{
    return this.http.get<Vehicle[]>(environment.apiHost + '/api/vehicle');
  }


  
}