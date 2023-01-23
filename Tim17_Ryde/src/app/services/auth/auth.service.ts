import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Token } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/app/environment/environment';
import { JwtAuthenticationRequest } from 'src/app/model/JwtAuthenticationRequest';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    skip: 'true',
  });

  user$ = new BehaviorSubject(null);
  userState$ = this.user$.asObservable();

  constructor(private http: HttpClient) {
    this.user$.next(this.getRole());
  }

  login(auth: any): Observable<Token> {
    return this.http.post<Token>(environment.apiHost + '/api/user/login', auth, {
      headers: this.headers,
    });
  }

  logout(): Observable<string> {
    return this.http.get(environment.apiHost + 'logOut', {
      responseType: 'text',
    });
  }

  getRole(): any {
    if (this.isLoggedIn()) {
      const accessToken: any = localStorage.getItem('user');
      const helper = new JwtHelperService();
      const role = helper.decodeToken(accessToken).role;
      return role;
    }
    return null;
  }

  isLoggedIn(): boolean {
    if (localStorage.getItem('user') != null) {
      return true;
    }
    return false;
  }

  setUser(): void {
    this.user$.next(this.getRole());
  }
}
