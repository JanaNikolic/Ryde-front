import { ThisReceiver } from '@angular/compiler';
import { Component, AfterViewInit, Input } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';

import { MapService } from '../../../services/map/map.service';
import { Driver } from 'src/app/model/Driver';
import { Vehicle } from 'src/app/model/Vehicle';
import { DriverService } from 'src/app/services/driver/driver.service';
import { forkJoin, map } from 'rxjs';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {
  private map: any;
  drivers: Driver[] = [];
  vehicle: Vehicle = {
    vehicleType: '',
    model: '',
    licenseNumber: '',
    passengerSeats: 0,
    petTransport: false,
    babyTransport: false
  };
  greenCarIcon = L.icon({
    iconUrl: "assets/images/greenCar.png",
    iconSize: [30, 30],
    popupAnchor: [-3, -76],
    iconAnchor: [30, 30]


  })

  redCarIcon = L.icon({
    iconUrl: "assets/images/redCar.png",
    iconSize: [30, 30],
    popupAnchor: [-3, -76],
    iconAnchor: [30, 30]

  })

  constructor(private mapService: MapService, private driverService: DriverService) { }

  fromAddress: string = '';
  toAddress: string = '';

  fromLat: number = 0;
  fromLng: number = 0;
  toLat: number = 0;
  toLng: number = 0;

  currentLocation: any;

  currentRoute: any;

  planOptions: Object = { addWaypoints: false, draggableWaypoints: false };
  distance: any;
  time: any;


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

    this.setFromAddress();
    this.setToAddress();

    this.map.on('click', (e: any) => {
      const container = L.DomUtil.create('div');
      const startBtn = this.createButton('Departure', container);
      const destBtn = this.createButton('Destination', container);

      const coord = e.latlng;
      const lat = coord.lat;
      const lng = coord.lng;

      L.popup()
        .setContent(container)
        .setLatLng(coord)
        .openOn(this.map);


      L.DomEvent.on(startBtn, 'click', () => {
        this.fromLat = lat;
        this.fromLng = lng;
        if (this.currentRoute == null) {
          this.currentRoute = L.Routing.control({
            waypoints: [L.latLng(this.fromLat, this.fromLng)],
            addWaypoints: false
          }).addTo(this.map);

        } else {
          this.currentRoute.spliceWaypoints(0, 1, e.latlng);
          this.currentRoute.on('routesfound', (e: any) => {
            this.distance = e.routes[0].summary.totalDistance;
            this.time = e.routes[0].summary.totalTime;

            this.mapService.setDistance(this.distance);
            this.mapService.setDuration(this.time);
          });
        }
        this.mapService.reverseSearch(this.fromLat, this.fromLng).subscribe((address) => {
          this.fromAddress = address;
          this.mapService.setFromAddress(address);
        });
        this.map.closePopup();

        this.mapService.setDeparture({ lat: this.fromLat, lng: this.fromLng });

      });

      L.DomEvent.on(destBtn, 'click', () => {
        this.toLat = lat;
        this.toLng = lng;

        if (this.currentRoute == null) {
          this.currentRoute = L.Routing.control({
            waypoints: [L.latLng(this.toLat, this.toLng)],
            addWaypoints: false,
          }).addTo(this.map);

        } else {
          this.currentRoute.spliceWaypoints(this.currentRoute.getWaypoints().length - 1, 1, e.latlng);
          this.currentRoute.on('routesfound', (e: any) => {
            this.distance = e.routes[0].summary.totalDistance;
            this.time = e.routes[0].summary.totalTime;

            this.mapService.setDistance(this.distance);
            this.mapService.setDuration(this.time);
          });
        }
        this.mapService.reverseSearch(this.toLat, this.toLng).subscribe((address) => {
          this.toAddress = address;
          this.mapService.setToAddress(address);
        });
        this.map.closePopup();
        this.mapService.setDestination({ lat: this.toLat, lng: this.toLng });
      });
    });
    this.mapService.setDeparture({ lat: this.fromLat, lng: this.fromLng });
    this.mapService.setDestination({ lat: this.toLat, lng: this.toLng });
  }

  private setFromAddress(): void {
    this.mapService.getFromAddress().subscribe({
      next: (address) => {
        this.fromAddress = address;
      },
      error: () => { },
    });
  }

  private setToAddress(): void {
    this.mapService.getToAddress().subscribe({
      next: (address) => {
        this.toAddress = address;
        this.setFromAndToLatLngFromAddress(this.fromAddress, this.toAddress);
      },
      error: () => { },
    });
  }

  search(address: string): void {
    this.mapService.search(address).subscribe({
      next: (result) => {
        L.marker([result[0].lat, result[0].lon], { draggable: false })
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
      });
      console.log(
        'You clicked the map at latitude: ' + lat + ' and longitude: ' + lng
      );
      const mp = new L.Marker([lat, lng]).addTo(this.map);
      alert(mp.getLatLng());
    });
  }

  route(): void {
    // this.currentLocation.remove();
    this.map.eachLayer((layer: any) => {
      if (layer.options.waypoints && layer.options.waypoints.length) {
        this.map.removeLayer(layer);
        if (this.currentRoute != null) {
          this.map.removeControl(this.currentRoute);
          this.currentRoute = null;
        }
      }
    });

    this.currentRoute = L.Routing.control({
      waypoints: [L.latLng(this.fromLat, this.fromLng), L.latLng(this.toLat, this.toLng)],
      addWaypoints: false,
    }).addTo(this.map);
    // get markers and set them as draggable false
    this.mapService.setDeparture({ lat: this.fromLat, lng: this.fromLng });
    this.mapService.setDestination({ lat: this.toLat, lng: this.toLng });

    this.currentRoute.on('routesfound', (e: any) => {
      this.distance = e.routes[0].summary.totalDistance;
      this.time = e.routes[0].summary.totalTime;

      this.mapService.setDistance(this.distance);
      this.mapService.setDuration(this.time);
    });
  }

  private setFromAndToLatLngFromAddress(from: string, to: string): void {
    forkJoin([this.mapService.search(from), this.mapService.search(to)])
      .pipe(map(([dep, des]) => {
        
        if (this.fromLat != dep[0].lat && this.fromLng != dep[0].lon) {
          this.fromLat = dep[0].lat;
          this.fromLng = dep[0].lon;
        }
        this.mapService.setDeparture({ lat: this.fromLat, lng: this.fromLng });

        if (this.toLat != des[0].lat && this.toLng != des[0].lon) {
          this.toLat = des[0].lat;
          this.toLng = des[0].lon;
        }
        this.mapService.setDestination({ lat: this.toLat, lng: this.toLng });
        this.route();
        this.map.setView([this.fromLat, this.fromLng], 15);

      })).subscribe();
  }

  private addCurrentLocation(): void {
    this.map.locate({ setView: true, maxZoom: 25, minZoom: 15, enableHighAccuracy: true }).on('locationerror', function () {
      alert("Location access has been denied.");
    }).on('locationfound', (e: { latlng: L.LatLng; }) => {
      this.fromLat = e.latlng.lat;
      this.fromLng = e.latlng.lng;

      this.currentLocation = L.marker([this.fromLat, this.fromLng]);

      this.map.addLayer(this.currentLocation);
      this.currentLocation.bindPopup('Trenutno se nalazite ovde.').openPopup();


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

  private createButton(label: string, container: HTMLElement): HTMLButtonElement {
    const btn = L.DomUtil.create('button', 'button-popup', container);
    btn.setAttribute('type', 'button');
    btn.setAttribute('style', "margin: 5px 0;padding: 8px 0;width: 100%;font-family: Verdana, Geneva, Tahoma, sans-serif;font-style: normal;font-weight: 400;font-size: 12px;line-height: 12px;letter-spacing: .1rem;text-transform: uppercase;text-decoration: none;white-space: nowrap;background-color: transparent;border-radius: 4px;border: 1px solid #bbb;cursor: pointer;");
    btn.innerHTML = label;
    return btn;
  }

  ngAfterViewInit(): void {
    let DefaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-icon.png',
      iconAnchor: [10, 45]
    });

    L.Marker.prototype.options.icon = DefaultIcon;
    this.initMap();

    this.driverService.getAllDrivers()
      .subscribe(

        (pageDriver) => {

          this.drivers = pageDriver.results;
          for (let driver of this.drivers) {

            if (driver.blocked === false) {

              this.driverService.getVehicle(driver.id as number).
                subscribe(
                  (vehicle) => {

                    this.vehicle = vehicle
                    if (driver.active == true) {
                      L.marker([vehicle.currentLocation?.latitude as number, vehicle.currentLocation?.longitude as number],
                        { icon: this.greenCarIcon }).addTo(this.map);
                    }
                    else {
                      L.marker([vehicle.currentLocation?.latitude as number, vehicle.currentLocation?.longitude as number],
                        { icon: this.redCarIcon }).addTo(this.map);
                    }

                  }
                );
            }
          }
        }

      );
  }
}
