import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environment/environment';
import { KilometersResponse, MoneyResponse, Ride } from 'src/app/model/Ride';
import { RideCountResponse } from 'src/app/model/Ride';
@Injectable({
  providedIn: 'root'
})
export class RideService {

  constructor(private http: HttpClient) { }


  getRide(rideId:number):Observable<Ride>{
    return this.http.get<Ride>(environment.apiHost+'/api/ride/' + rideId);
  }
  getRidesPerDay(from:string, to:string):Observable<RideCountResponse>{
    return this.http.get<RideCountResponse>(environment.apiHost+"/api/ride/rideCount?" + "startDate="+ from + "&endDate=" + to);  
  }
  getMoneyPerDay(from:string, to:string):Observable<MoneyResponse>{
    return this.http.get<MoneyResponse>(environment.apiHost+"/api/ride/money?" + "startDate="+ from + "&endDate=" + to);  
  }
  getKilometersPerDay(from:string, to:string):Observable<KilometersResponse>{
    return this.http.get<KilometersResponse>(environment.apiHost+"/api/ride/kilometers?" + "startDate="+ from + "&endDate=" + to);  
  }
}