import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environment/environment';
import { pageNote } from 'src/app/model/Note';
import { Note } from 'src/app/model/Note';
import { PasswordChangeRequest } from 'src/app/model/request/PasswordChangeRequest';
import { PasswordResetRequest } from 'src/app/model/request/PasswordResetRequest';


@Injectable({
    providedIn: 'root'
  })
  export class UserService {
  
    constructor(private http: HttpClient) { }
  
  
    blockUser(userId:number):Observable<any>{
      return this.http.put<any>(environment.apiHost+'/api/user/' + userId + "/block", HttpRequest);
      
    }

    unblockUser(userId:number):Observable<any>{
        return this.http.put<any>(environment.apiHost+'/api/user/' + userId + "/unblock", HttpRequest);
        
      }
    getNotes(userId:number):Observable<pageNote>{
      return this.http.get<pageNote>(environment.apiHost + '/api/user/'+ userId + "/note");
    }
    createNote(note: Note, userId:Number): Observable<Note> {
      
      return this.http.post<Note>(environment.apiHost + '/api/user/'+ userId + "/note",note);
    }

    changePassword(userId:number, request:PasswordChangeRequest):Observable<string>{
      return this.http.put<string>(environment.apiHost + '/api/user/'+ userId + "/changePassword", request);
    }

    resetCode(email:string):Observable<string> {
      return this.http.get<string>(environment.apiHost + "/api/user/" + email + "/resetPassword");
    }

    resetPassword(email:string, request:PasswordResetRequest):Observable<string> {
      return this.http.put(environment.apiHost + "/api/user/" + email + "/resetPassword", request, {responseType: 'text'});
    }
}