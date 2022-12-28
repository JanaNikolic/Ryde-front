import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environment/environment';
import { Ride } from 'src/app/model/Ride';

@Injectable({
  providedIn: 'root'
})
export class UnregisteredUserService {

  constructor(private http: HttpClient) { }

  calculatePrice(ride: Ride): Observable<any> {
    return this.http.post<Ride>(environment.apiHost + '/api/unregisteredUser', ride);
  }
}
