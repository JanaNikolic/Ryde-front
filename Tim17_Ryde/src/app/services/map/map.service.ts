import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';  
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor(private http: HttpClient) {}

  private fromAddress$ = new BehaviorSubject<any>({});
  private toAddress$  = new BehaviorSubject<any>({});

  private duration$ = new BehaviorSubject<any>({});
  private distance$  = new BehaviorSubject<any>({});

  selectedFromAddress$ = this.fromAddress$.asObservable();
  selectedToAddress$ = this.toAddress$.asObservable();

  selectedduration$ = this.duration$.asObservable();
  selecteddistance$ = this.distance$.asObservable();

  search(street: string): Observable<any> {
    return this.http.get(
      'https://nominatim.openstreetmap.org/search?format=json&q=' + street
    );
  }

  reverseSearch(lat: number, lon: number): Observable<any> {
    return this.http.get(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&<params>`
    );
  }

  setFromAddress(address: string) {
    this.fromAddress$.next(address);
  }

  getFromAddress() {
    return this.fromAddress$;
  }

  setToAddress(address: string) {
    this.toAddress$.next(address);
  }

  getToAddress() {
    return this.toAddress$;
  }

  setDuration(duration: string) {
    this.duration$.next(duration);
  }

  getDuration() {
    return this.duration$;
  }

  setDistance(distance: string) {
    this.distance$.next(distance);
  }

  getDistance() {
    return this.distance$;
  }

}
