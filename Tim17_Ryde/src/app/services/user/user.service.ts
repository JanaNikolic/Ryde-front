import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environment/environment';
import { Driver } from 'src/app/model/Driver';


@Injectable({
    providedIn: 'root'
  })
  export class UserService {
  
    constructor(private http: HttpClient) { }
  
  
    blockUser(userId:number):Observable<1>{
      return this.http.put<1>(environment.apiHost+'/api/user/' + userId + "/block", HttpRequest);
      
    }

    unblockUser(userId:number):Observable<1>{
        return this.http.put<1>(environment.apiHost+'/api/user/' + userId + "/unblock", HttpRequest);
        
      }
}