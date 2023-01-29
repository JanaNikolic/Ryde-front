import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environment/environment';
import { Interceptor } from 'src/app/interceptor/interceptor.interceptor';
import { RejectionRequest } from 'src/app/model/request/RejectionRequest';
import { RideResponse } from 'src/app/model/response/RideResponse';
import { AuthService } from '../auth/auth.service';
import { KilometersResponse, MoneyResponse, Ride } from 'src/app/model/Ride';
import { RideCountResponse } from 'src/app/model/Ride';
import { PanicResponse } from 'src/app/model/response/PanicResponse';
import { PanicRequest } from 'src/app/model/request/PanicRequest';
import { FavoriteRidePage, FavoriteRideResponse } from 'src/app/model/response/FavoriteRidePage';
import { RideRequest } from 'src/app/model/request/RideRequest';
import { FavoriteRideRequest } from 'src/app/model/request/FavoriteRideRequest';
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

  panic(rideId: number, reason: PanicRequest):Observable<PanicResponse> {
    return this.http.put<PanicResponse>(environment.apiHost+"/api/ride/" + rideId + "/panic", reason);
  }

  getActive(driverId: number): Observable<RideResponse> {
    return this.http.get<RideResponse>(environment.apiHost + "/api/ride/driver/" + driverId + "/active");
  }

  getFavorites(): Observable<FavoriteRidePage> {
    return this.http.get<FavoriteRidePage>(environment.apiHost + "/api/ride/favorites");
  }

  deleteFavorite(favoriteId:number): Observable<string>{
    return this.http.delete<string>(environment.apiHost + "/api/ride/favorites/" + favoriteId);
  }

  postRide(ride: RideRequest):Observable<RideResponse> {
    return this.http.post<RideResponse>(environment.apiHost + '/api/ride', ride);
  }

  postFavoriteRide(ride: FavoriteRideRequest): Observable<FavoriteRideResponse> {
    return this.http.post<FavoriteRideResponse>(environment.apiHost + "/api/ride/favorites", ride);
  }

  getPassengerActive(passengerId: number): Observable<RideResponse> {
    return this.http.get<RideResponse>(environment.apiHost + "/api/ride/passenger/" + passengerId + "/active");
  }
}