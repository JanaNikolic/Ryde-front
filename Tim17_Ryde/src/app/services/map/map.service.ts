import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';  
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

  private departure$  = new BehaviorSubject<any>({});
  private destination$ = new BehaviorSubject<any>({});
  
  selectedFromAddress$ = this.fromAddress$.asObservable();
  selectedToAddress$ = this.toAddress$.asObservable();

  selectedDuration$ = this.duration$.asObservable();
  selectedDistance$ = this.distance$.asObservable();

  selectedDeparture$ = this.departure$.asObservable();
  selectedDestination$ = this.destination$.asObservable();

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
  
  routing(departureLat: number, departureLng: number, destinationLat: number, destinationLng: number): Observable<any> {
    return this.http.get(
      `https://routing.openstreetmap.de/routed-car/route/v1/driving/${departureLng},${departureLat};${destinationLng},${destinationLat}?geometries=geojson&overview=false&alternatives=true&steps=true`, 
      // {headers: new HttpHeaders({
      //   'Access-Control-Allow-Origin': '*',
      //   'Access-Control-Allow-Headers': 'Origin, X-Api-Key, X-Requested-With, Content-Type, Accept, Authorization', 
      //   'Access-Control-Allow-Methods': 'POST, PUT, PATCH, GET, DELETE, OPTIONS',
      //   'Authorization': 'Bearer '})}
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

  getDestination() {
    return this.destination$;
  }

  setDestination(value: any) {
    this.destination$.next(value);
  }

  getDeparture() {
    return this.departure$;
  }
  
  setDeparture(value: any) {
    this.departure$.next(value);
  }
}
