import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { MapService } from '../../../services/map/map.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {
  private map: any;
  fromAddress = '';
  toAddress = '';

  // fromLat!: number;
  // fromLng!: number;
  // toLat!: number;
  // toLng!: number;
  fromLat: number = 0;
  fromLng: number = 0;
  toLat: number = 0;
  toLng: number = 0;

  constructor(private mapService: MapService) { }

  private initMap(): void {
    this.map = L.map('map', {
      center: [45.249734, 19.832662],
      zoom: 14,
    });

    const tiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 18,
        minZoom: 3,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    );
    tiles.addTo(this.map);

    // this.addCurrentLocation();

    // this.mapService.selectedFromAddress$.subscribe((from) => {
    //   this.search(from);
    // });

    this.setFromAddress();
    // this.setToAddress();

    // this.setFromAndToLatLngFromAddress(this.fromAddress, this.toAddress);

    // console.log("L1: " + this.fromLat + " lng: " + this.fromLng);
    // console.log("L2: " + this.toLat + " lng: " + this.toLng);

    // this.route();

    // L.control.locate().addTo(this.map);

  }

  private setFromAddress() {
    this.mapService.getFromAddress().subscribe({
      next: (address) => {
        console.log(address);
        this.search(address);
        this.fromAddress = address;

        this.setToAddress();
        // this.setFromAndToLatLngFromAddress(this.fromAddress, this.toAddress);

      },
      error: () => { },
    });
    // this.route();
  }

  private setToAddress() {
    this.mapService.getToAddress().subscribe({
      next: (address) => {
        this.search(address);
        this.toAddress = address;
        this.setFromAndToLatLngFromAddress(this.fromAddress, this.toAddress);
      },
      error: () => { },
    });
  }

  search(address: string): void {
    this.mapService.search(address).subscribe({
      next: (result) => {
        L.marker([result[0].lat, result[0].lon])
          .addTo(this.map)
          .openPopup();
      },
      error: () => { },
    });
  }

  registerOnClick(): void {
    this.map.on('click', (e: any) => {
      const coord = e.latlng;
      const lat = coord.lat;
      const lng = coord.lng;
      this.mapService.reverseSearch(lat, lng).subscribe((res) => {
        console.log(res.display_name);
      });
      console.log(
        'You clicked the map at latitude: ' + lat + ' and longitude: ' + lng
      );
      const mp = new L.Marker([lat, lng]).addTo(this.map);
      alert(mp.getLatLng());
    });
  }

  route(): void {
    L.Routing.control({
      waypoints: [L.latLng(this.fromLat, this.fromLng), L.latLng(this.toLat, this.toLng)],
    }).addTo(this.map);
    console.log("Ruuuuun");
  }

  private setFromAndToLatLngFromAddress(from: string, to: string): void {

    this.mapService.search(from).subscribe({
      next: (result1) => {
        if (this.fromLat != result1[0].lat && this.fromLng != result1[0].lon) {
          this.fromLat = result1[0].lat;
          this.fromLng = result1[0].lon;
        }        
      },
      error: () => { },
    });
    this.mapService.search(to).subscribe({
      next: (result2) => {
        if (this.toLat != result2[0].lat && this.toLng != result2[0].lon) {
          this.toLat = result2[0].lat;
          this.toLng = result2[0].lon;
        }

        this.route();
      },
      error: () => { },
    });

  }

  private addCurrentLocation(): void {
    this.map.locate({ setView: true, maxZoom: 25, minZoom: 15, enableHighAccuracy: true }).on('locationerror', function () {
      alert("Location access has been denied.");
    }).on('locationfound', (e: { latlng: L.LatLng; }) => {
      this.fromLat = e.latlng.lat;
      this.fromLng = e.latlng.lng;

      L.marker([this.fromLat, this.fromLng]).addTo(this.map)
        .bindPopup('Trenutno se nalazite ovde.').openPopup();

      this.mapService.reverseSearch(e.latlng.lat, e.latlng.lng).subscribe(result => {
        this.mapService.setFromAddress(result);
      });



    });

    // this.map.addControl(
    //   L.control.locate({
    //     locateOptions: {
    //       enableHighAccuracy: true
    //     }
    //   })
    // );

    // const lc: any = L.control.locate().addTo(this.map);
    // L.Control.Locate().addTo(this.map);
    // L.control.Locate.addTo(this.map);
  }

  ngAfterViewInit(): void {
    let DefaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-icon.png',
    });

    L.Marker.prototype.options.icon = DefaultIcon;
    this.initMap();
  }

}
