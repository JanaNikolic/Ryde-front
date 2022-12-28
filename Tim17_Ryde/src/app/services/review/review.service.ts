import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environment/environment';
import { Review } from 'src/app/model/Review';
import { RideReview } from 'src/app/model/Review';
@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor(private http: HttpClient) { }


  getRideReviews(rideId:number):Observable<RideReview>{
    return this.http.get<RideReview>(environment.apiHost+'/api/review/' + rideId);
    
  }
}