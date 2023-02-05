import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environment/environment';
import { UnregisteredUserRequest } from 'src/app/model/request/UnregisteredUserRequest';

@Injectable({
  providedIn: 'root'
})
export class UnregisteredUserService {

  constructor(private http: HttpClient) { }

  calculatePrice(request: UnregisteredUserRequest): Observable<any> {
    return this.http.post<UnregisteredUserRequest>(environment.apiHost + '/api/unregisteredUser', request);
  }
}
