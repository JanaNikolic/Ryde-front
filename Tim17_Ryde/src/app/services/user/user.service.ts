import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environment/environment';
import { Driver } from 'src/app/model/Driver';
import { pageNote } from 'src/app/model/Note';
import { Note } from 'src/app/model/Note';
import { PasswordChangeRequest } from 'src/app/model/request/PasswordChangeRequest';


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
    getNotes(userId:number):Observable<pageNote>{
      return this.http.get<pageNote>(environment.apiHost + '/api/user/'+ userId + "/note");
    }
    createNote(note: any, userId:Number): Observable<any> {
      
      return this.http.post<Note>(environment.apiHost + '/api/user/'+ userId + "/note",note);
    }

    changePassword(userId:number, request:PasswordChangeRequest):Observable<string>{
      return this.http.put<string>(environment.apiHost + '/api/user/'+ userId + "/changePassword", request);
    }
}