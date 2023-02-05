
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environment/environment';
import { Passenger } from 'src/app/model/Passenger';
import { pagePassenger } from 'src/app/model/Passenger';

import { pageRide } from 'src/app/model/Ride';

import { PassengerUpdateResponse } from 'src/app/model/response/PassengerUpdateResponse';
import { KilometersResponse, MoneyResponse, RideCountResponse } from 'src/app/model/Ride';
import { UserResponse } from 'src/app/model/response/UserResponse';

@Injectable({
  providedIn: 'root'
})
export class PassengerService {

  constructor(private http: HttpClient) { }


  getPassenger(passengerId:number):Observable<Passenger>{
    return this.http.get<Passenger>(environment.apiHost+'/api/passenger/' + passengerId);
    
  }
  
  getRidesPerDay(from:string, to:string, passengerID:number):Observable<RideCountResponse>{
    return this.http.get<RideCountResponse>(environment.apiHost+"/api/passenger/rideCount/"+ passengerID + "?startDate="+ from + "&endDate=" + to);  
  }
  getMoneyPerDay(from:string, to:string, passengerID:number):Observable<MoneyResponse>{
    return this.http.get<MoneyResponse>(environment.apiHost+"/api/passenger/money/"+ passengerID + "?startDate="+ from + "&endDate=" + to);  
  }
  getKilometersPerDay(from:string, to:string, passengerID:number):Observable<KilometersResponse>{
    return this.http.get<KilometersResponse>(environment.apiHost+"/api/passenger/kilometers/"+ passengerID + "?startDate="+ from + "&endDate=" + to);  
  }


  getAll():Observable<pagePassenger>{
    return this.http.get<pagePassenger>(environment.apiHost + '/api/passenger');
  }

  add(passenger: Passenger): Observable<any> {
    const options: any = {
      responseType: 'text',
    };
    return this.http.post<Passenger>(environment.apiHost + '/api/passenger',passenger, options);
  }


  getPassengerRides(passengerId:number):Observable<pageRide>{
    return this.http.get<pageRide>(environment.apiHost + '/api/passenger/' + passengerId + '/ride')
  }
  edit(passengerId:number, editRequest:PassengerUpdateResponse):Observable<Passenger>{
    return this.http.put<Passenger>(environment.apiHost + '/api/passenger/' + passengerId, editRequest);
  }

  getPassengerByEmail(email: string): Observable<UserResponse> {
    return this.http.get<UserResponse>(environment.apiHost + '/api/passenger/get/' + email);

  }
}