import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environment/environment';
import { pageReview, ReviewResponse, ReviewRequest } from 'src/app/model/Review';
import { RideReview } from 'src/app/model/Review';
@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor(private http: HttpClient) { }


  getRideReviews(rideId:number):Observable<RideReview>{
    return this.http.get<RideReview>(environment.apiHost+'/api/review/' + rideId);
  }
  getDriverReviews(driverId:number):Observable<pageReview>{
    return this.http.get<pageReview>(environment.apiHost+'/api/review/driver/' + driverId);
  }
  getVehicleReviews(vehicleId:number):Observable<pageReview>{
    return this.http.get<pageReview>(environment.apiHost+'/api/review/vehicle/' + vehicleId);
  }

  postDriverReview(rideId: number, review: ReviewRequest): Observable<ReviewResponse>{
    return this.http.post<ReviewResponse>(environment.apiHost + '/api/review/' + rideId + '/driver', review);
  }
  postVehicleReview(rideId: number, review: ReviewRequest): Observable<ReviewResponse>{
    return this.http.post<ReviewResponse>(environment.apiHost + '/api/review/' + rideId + '/vehicle', review);
  }
}