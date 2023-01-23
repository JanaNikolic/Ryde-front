import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environment/environment';
import { Ride } from 'src/app/model/Ride';
@Injectable({
  providedIn: 'root'
})
export class RideService {

  constructor(private http: HttpClient) { }


  getRide(rideId:number):Observable<Ride>{
    return this.http.get<Ride>(environment.apiHost+'/api/ride/' + rideId);
  }
  getRidesPerDay(from:string, to:string):Observable<Map<String, Number>>{
    return this.http.get<Map<String, Number>>(environment.apiHost+"/api/ride/ridesPerDate?" + "from="+ from + "&to=" + to);  
  }
  getTotalCostPerDay(from:string, to:string):Observable<Map<String, Number>>{
    return this.http.get<Map<String, Number>>(environment.apiHost+"/api/ride/totalCostPerDate?" + "from="+ from + "&to=" + to);  
  }
}