import { ThisReceiver } from '@angular/compiler';
import { Component, AfterViewInit, OnInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';

import { MapService } from '../../../services/map/map.service';
import { Driver } from 'src/app/model/Driver';
import { Vehicle } from 'src/app/model/Vehicle';
import { DriverService } from 'src/app/services/driver/driver.service';
import { forkJoin, map } from 'rxjs';
import { icon, LayerGroup, marker } from 'leaflet';
import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';
import { environment } from 'src/app/environment/environment';
import { AuthService } from 'src/app/services/auth/auth.service';
import { RideResponse } from 'src/app/model/response/RideResponse';
import { RoutingResponse } from 'src/app/model/response/RoutingResponse';
import { VehicleService } from 'src/app/services/vehicle/vehicle.service';
import { Locations } from 'src/app/model/Locations';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit {
  private map: any;
  private serverUrl = environment.apiHost + '/example-endpoint';
  drivers: Driver[] = [];
  vehicle: Vehicle = {
    vehicleType: '',
    model: '',
    licenseNumber: '',
    passengerSeats: 0,
    petTransport: false,
    babyTransport: false,
    id: 0,
    driverId: 0,
    currentLocation: { address: '', longitude: 0, latitude: 0 },
  };
  greenCarIcon = L.icon({
    iconUrl: 'assets/images/greenCar.png',
    iconSize: [30, 30],
    popupAnchor: [-3, -76],
    iconAnchor: [30, 30],
  });

  redCarIcon = L.icon({
    iconUrl: 'assets/images/redCar.png',
    iconSize: [30, 30],
    popupAnchor: [-3, -76],
    iconAnchor: [30, 30],
  });
  departureLng: number = 0;
  departureLat: number = 0;
  destinationLat: number = 0;
  destinationLng: number = 0;

  constructor(
    private mapService: MapService,
    private driverService: DriverService,
    private authService: AuthService,
    private vehcleService: VehicleService
  ) {}

  fromAddress: string = '';
  toAddress: string = '';

  fromLat: number = 0;
  fromLng: number = 0;
  toLat: number = 0;
  toLng: number = 0;

  currentRoute: any;

  planOptions: Object = { addWaypoints: false, draggableWaypoints: false };
  distance: any;
  time: any;
  driver: Driver = {
    id: 0,
    name: '',
    surname: '',
    telephoneNumber: '',
    email: '',
    address: '',
    password: '',
    blocked: false,
    active: true,
    activeRide: false,
  };
  rideVehicle: any = {};
  ride: any = {};
  mainGroup: LayerGroup[] = [];
  private stompClient: any;

  color: string = '01ACAB';

  timerId: any;

  private initMap(): void {
    this.map = L.map('map', {
      center: [45.249734, 19.832662],
      zoom: 14,
    });

    const tiles = L.tileLayer(
      'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png',
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

      L.popup().setContent(container).setLatLng(coord).openOn(this.map);

      L.DomEvent.on(startBtn, 'click', () => {
        this.fromLat = lat;
        this.fromLng = lng;
        if (this.currentRoute == null) {
          this.currentRoute = L.Routing.control({
            waypoints: [L.latLng(this.fromLat, this.fromLng)],
            addWaypoints: false,
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
        this.mapService
          .reverseSearch(this.fromLat, this.fromLng)
          .subscribe((address) => {
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
          this.currentRoute.spliceWaypoints(
            this.currentRoute.getWaypoints().length - 1,
            1,
            e.latlng
          );
          this.currentRoute.on('routesfound', (e: any) => {
            this.distance = e.routes[0].summary.totalDistance;
            this.time = e.routes[0].summary.totalTime;

            this.mapService.setDistance(this.distance);
            this.mapService.setDuration(this.time);
          });
        }
        this.mapService
          .reverseSearch(this.toLat, this.toLng)
          .subscribe((address) => {
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
        // if (address.length !== 0) {
          this.fromAddress = address;
        // }
      },
      error: () => {},
    });
  }

  private setToAddress(): void {
    this.mapService.getToAddress().subscribe({
      next: (address) => {
        // if (address.length !== 0) {
          this.toAddress = address;
          this.setFromAndToLatLngFromAddress(this.fromAddress, this.toAddress);
        // }
      },
      error: () => {},
    });
  }

  search(address: string): void {
    this.mapService.search(address).subscribe({
      next: (result) => {
        L.marker([result[0].lat, result[0].lon], { draggable: false })
          .addTo(this.map)
          .openPopup();
      },
      error: () => {},
    });
  }

  registerOnClick(): void {
    this.map.on('click', (e: any) => {
      const coord = e.latlng;
      const lat = coord.lat;
      const lng = coord.lng;
      this.mapService.reverseSearch(lat, lng).subscribe((res) => {});
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
      waypoints: [
        L.latLng(this.fromLat, this.fromLng),
        L.latLng(this.toLat, this.toLng),
      ],
      addWaypoints: false,
    }).addTo(this.map);
    console.log(this.currentRoute);
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
      .pipe(
        map(([dep, des]) => {
          console.log(dep);
          console.log(des);
          if (this.fromLat != dep[0].lat && this.fromLng != dep[0].lon) {
            this.fromLat = dep[0].lat;
            this.fromLng = dep[0].lon;
          }
          this.mapService.setDeparture({
            lat: this.fromLat,
            lng: this.fromLng,
          });

          if (this.toLat != des[0].lat && this.toLng != des[0].lon) {
            this.toLat = des[0].lat;
            this.toLng = des[0].lon;
          }
          this.mapService.setDestination({ lat: this.toLat, lng: this.toLng });
          this.route();
          this.map.setView([this.fromLat, this.fromLng], 15);
        })
      )
      .subscribe();
  }

  private createButton(
    label: string,
    container: HTMLElement
  ): HTMLButtonElement {
    const btn = L.DomUtil.create('button', 'button-popup', container);
    btn.setAttribute('type', 'button');
    btn.setAttribute(
      'style',
      'margin: 5px 0;padding: 8px 0;width: 100%;font-family: Verdana, Geneva, Tahoma, sans-serif;font-style: normal;font-weight: 400;font-size: 12px;line-height: 12px;letter-spacing: .1rem;text-transform: uppercase;text-decoration: none;white-space: nowrap;background-color: transparent;border-radius: 4px;border: 1px solid #bbb;cursor: pointer;'
    );
    btn.innerHTML = label;
    return btn;
  }

  initializeWebSocketConnection() {
    let ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    // this.stompClient.debug = null;
    let that = this;
    this.stompClient.connect({}, function () {
      // that.isLoaded = true;
      that.openGlobalSocket();
    });
  }

  openGlobalSocket() {
    this.stompClient.subscribe(
      '/topic/map-update/update-vehicle-position',
      (message: { body: string }) => {
        let vehicle: Vehicle = JSON.parse(message.body);
        let existingVehicle = this.rideVehicle.id;
        existingVehicle.setLatLng([
          vehicle.currentLocation.longitude,
          vehicle.currentLocation.latitude,
        ]);
        existingVehicle.update();
      }
    );
    this.stompClient.subscribe(
      '/topic/map-update/started-ride',
      (message: { body: string }) => {
        let ride: RoutingResponse = JSON.parse(message.body);
        let geoLayerRouteGroup: LayerGroup = new LayerGroup();

        // if (ride.locations[0].departure.latitude == 0) {
        //   this.mapService.search(ride.locations[0].departure.address).subscribe({
        //     next: (res):
        //   })

        // }

        // if (ride.locations[0].destination.latitude == 0) {

        // }
        forkJoin([
          this.mapService.search(ride.locations[0].departure.address),
          this.mapService.search(ride.locations[0].destination.address),
        ])
          .pipe(
            map(([dep, des]) => {
              ride.locations[0].departure.latitude = dep[0].lat;
              ride.locations[0].departure.latitude = dep[0].lon;

              ride.locations[0].destination.latitude = des[0].lat;
              ride.locations[0].destination.latitude = des[0].lon;

              this.ride = ride;
              console.log(ride);
              if (ride.rideStatus == 'ACCEPTED') {
                console.log('accepted ride');
                this.departureLat = ride.vehicle.currentLocation.latitude;
                this.departureLng = ride.vehicle.currentLocation.longitude;

                this.destinationLat = ride.locations[0].departure.latitude;
                this.destinationLng = ride.locations[0].departure.longitude;
                // this.destinationLat = 45.255521;
                // this.destinationLng = 19.845071;
              } else if (ride.rideStatus == 'STARTED') {
                console.log('started ride');
                this.departureLat = ride.locations[0].departure.latitude;
                this.departureLng = ride.locations[0].departure.longitude;

                this.destinationLat = ride.locations[0].destination.latitude;
                this.destinationLng = ride.locations[0].destination.longitude;
              }
              console.log(this.departureLat);
              console.log(this.departureLng);
              console.log(this.destinationLat);
              console.log(this.destinationLng); //routes[0].legs[0].steps

              for (let step of this.currentRoute.routes[0].legs[0].steps) {
                let routeLayer = L.geoJSON(step.geometry);
                routeLayer.setStyle({ color: `#${this.color}` });
                routeLayer.addTo(geoLayerRouteGroup);
                this.ride.id = geoLayerRouteGroup;
                console.log('Pre timera');
                if (
                  this.ride.status === 'ACCEPTED' ||
                  this.ride.status === 'STARTED'
                ) {
                  this.timerId = setTimeout(() => {
                    console.log('TIMER');
                    const loc: Locations = {
                      address: step.name,
                      latitude: step.maneuver.location[1],
                      longitude: step.maneuver.location[0],
                    };
                    this.vehcleService.updateLocation(
                      this.ride.vehicle.id,
                      loc
                    );
                  }, 4 * 1000);
                }
                console.log('Posle timera');
              }
              let markerLayer = marker(
                [
                  this.rideVehicle.currentLocation.longitude,
                  this.rideVehicle.currentLocation.latitude,
                ],
                {
                  icon: icon({
                    iconUrl: 'assets/car.png',
                    iconSize: [35, 45],
                    iconAnchor: [18, 45],
                  }),
                }
              );
              markerLayer.addTo(geoLayerRouteGroup);
              this.rideVehicle.id = markerLayer;
              this.mainGroup = [...this.mainGroup, geoLayerRouteGroup];
            })
          )
          .subscribe();
      }
    );
    this.stompClient.subscribe(
      '/topic/map-update/ended-ride',
      (message: { body: string }) => {
        let ride: RoutingResponse = JSON.parse(message.body);
        this.ride = ride;
        this.mainGroup = this.mainGroup.filter(
          (lg: LayerGroup) => lg !== this.ride.id
        );
        // delete this.vehicles[ride.vehicle.id];
        this.ride = {};

        if (
          this.ride.status === 'FINISHED' ||
          this.ride.status === 'CANCELED'
        ) {
          clearTimeout(this.timerId);
        }
      }
    );
    this.stompClient.subscribe(
      '/topic/map-updates/delete-all-rides',
      (message: { body: string }) => {
        this.rideVehicle = {};
        this.ride = {};
        this.mainGroup = [];
      }
    );
  }

  ngOnInit(): void {
    this.driver.id = this.authService.getId();
    let DefaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-icon.png',
      iconAnchor: [10, 45],
    });

    L.Marker.prototype.options.icon = DefaultIcon;
    this.initMap();

    this.initializeWebSocketConnection();
    this.driverService.getAllDrivers().subscribe((pageDriver) => {
      this.drivers = pageDriver.results;
      let geoLayerRouteGroup: LayerGroup = new LayerGroup();
      for (let driver of this.drivers) {
        if (driver.id === this.driver.id) {
          this.driver = driver;
        }
        if (driver.blocked === false) {
          this.driverService
            .getVehicle(driver.id as number)
            .subscribe((vehicle) => {
              this.vehicle = vehicle;
              if (driver.active == true && driver.activeRide == false) {
                L.marker(
                  [
                    vehicle.currentLocation?.latitude as number,
                    vehicle.currentLocation?.longitude as number,
                    // 45.235866, 19.807387
                  ],
                  { icon: this.greenCarIcon }
                ).addTo(geoLayerRouteGroup);
              } else {
                L.marker(
                  [
                    vehicle.currentLocation?.latitude as number,
                    vehicle.currentLocation?.longitude as number,
                  ],
                  { icon: this.redCarIcon }
                ).addTo(geoLayerRouteGroup);
              }
            });
        }
      }

      geoLayerRouteGroup.addTo(this.map);
    });
    //TODO
  }

  get_new_coordinates() {
    this.mapService
      .routing(
        this.departureLat,
        this.departureLng,
        this.destinationLat,
        this.destinationLng
      )
      .subscribe({
        next: (res) => {
          console.log(res);
          return res;
        },
      });
  }
}
