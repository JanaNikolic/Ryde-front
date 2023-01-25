import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environment/environment';
import { Interceptor } from 'src/app/interceptor/interceptor.interceptor';
import { RejectionRequest } from 'src/app/model/request/RejectionRequest';
import { RideResponse } from 'src/app/model/response/RideResponse';
import { Ride } from 'src/app/model/Ride';
import { AuthService } from '../auth/auth.service';
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

  acceptRide(rideId: number):Observable<RideResponse> {
    return this.http.put<RideResponse>(environment.apiHost+'/api/ride/' + rideId + '/accept', {});
  }

  rejectRide(rideId: number, rejection: RejectionRequest):Observable<RideResponse> {
    return this.http.put<RideResponse>(environment.apiHost+'/api/ride/' + rideId + '/cancel', rejection);
  }

  startRide(rideId: number):Observable<RideResponse> {
    return this.http.put<RideResponse>(environment.apiHost+'/api/ride/' + rideId + '/start', null);
  }

  endRide(rideId: number):Observable<RideResponse> {
    return this.http.put<RideResponse>(environment.apiHost+'/api/ride/' + rideId + '/end', null);
  }
}