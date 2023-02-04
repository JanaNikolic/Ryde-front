import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { icon, latLng, LayerGroup, marker, tileLayer, Map } from 'leaflet';
import { forkJoin, map } from 'rxjs';
import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';
import { environment } from 'src/app/environment/environment';
import { Driver } from 'src/app/model/Driver';
import { Vehicle } from 'src/app/model/Vehicle';
import { MapService } from 'src/app/services/map/map.service';
import { RoutingResponse } from 'src/app/model/response/RoutingResponse';
import { Locations } from 'src/app/model/Locations';
import { VehicleService } from 'src/app/services/vehicle/vehicle.service';
import { DriverService } from 'src/app/services/driver/driver.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Passenger } from 'src/app/model/Passenger';
import { RideService } from 'src/app/services/ride/ride.service';
import { RideResponse } from 'src/app/model/response/RideResponse';
import { RouterConfigurationFeature } from '@angular/router';
import { Ride } from 'src/app/model/Ride';

@Component({
  selector: 'app-routing-map',
  templateUrl: './routing-map.component.html',
  styleUrls: ['./routing-map.component.css'],
})
export class RoutingMapComponent implements OnInit {
  private serverUrl = environment.apiHost + '/example-endpoint';
  options = {
    layers: [
      tileLayer(
        'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png',
        {
          maxZoom: 18,
          attribution:
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }
      ),
    ],
    zoom: 14,
    center: latLng(45.253434, 19.831323),
  };
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
  passenger: Passenger = {
    id: 0,
    name: '',
    surname: '',
    telephoneNumber: '',
    email: '',
    address: '',
    password: '',
    blocked: false,
    active: false,
  };
  rideVehicle: any = {};
  vehicles: any = {};
  rides: any = {};
  mainGroup: LayerGroup[] = [];
  private stompClient: any;

  departureLng: number = 0;
  departureLat: number = 0;
  destinationLat: number = 0;
  destinationLng: number = 0;

  currentRoute: any;

  color: string = '01ACAB';
  timerId: any;
  currentRide: RideResponse = {
    id: 0,
    startTime: '',
    endTime: '',
    totalCost: 0,
    estimatedTimeInMinutes: 0,
    babyTransport: false,
    petTransport: false,
    status: '',
    locations: [],
    passengers: [],
    scheduledTime: '',
    vehicleType: '',
    driver: { id: 0, email: '' },
  };
  // ride: RoutingResponse = {
  //   id: 0,
  //   rideStatus: '',
  //   vehicle: this.vehicle,
  //   locations: []
  // };
  ride: any = {};
  private map: any;
  route: any;

  constructor(
    private mapService: MapService,
    private vehicleService: VehicleService,
    private driverService: DriverService,
    private authService: AuthService,
    private rideService: RideService
  ) {}

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
    if (this.driver.id !== 0) {
      this.stompClient.subscribe(
        '/topic/driver/' + this.driver.id,
        (message: { body: string }) => {
          let ride: RideResponse = JSON.parse(message.body);
          this.currentRide = ride;
          if (ride.status == "FINISHED") {
            this.mainGroup = [];
          } else if (ride.status == "ACCEPTED") { 
            this.currentRoute = L.Routing.control({
              waypoints: [
                L.latLng(
                  this.vehicle.currentLocation.latitude,
                  this.vehicle.currentLocation.longitude
                ),
                L.latLng(
                  this.currentRide.locations[0].destination.latitude,
                  this.currentRide.locations[0].destination.longitude
                ),
              ],
              addWaypoints: false,
            }).addTo(this.map);
          } else if (ride.status == "ACCEPTED") { 
            this.currentRoute = L.Routing.control({
              waypoints: [
                L.latLng(
                  this.currentRide.locations[0].departure.latitude,
                  this.currentRide.locations[0].departure.longitude
                ),
                L.latLng(
                  this.currentRide.locations[0].destination.latitude,
                  this.currentRide.locations[0].destination.longitude
                ),
              ],
              addWaypoints: false,
            }).on('routesfound', (e) => {
              this.route = e.routes;
              console.log(this.route);
            }).addTo(this.map);
          }
        }
      );
    }

    this.stompClient.subscribe(
      '/topic/ride/' + this.currentRide.id,
      (message: { body: string }) => {
        let ride: Ride = JSON.parse(message.body);
        if (ride.status == "FINISHED") {
          this.mainGroup = [];
        } else if (ride.status == "ACCEPTED") { 
          this.currentRoute = L.Routing.control({
            waypoints: [
              L.latLng(
                this.vehicle.currentLocation.latitude,
                this.vehicle.currentLocation.longitude
              ),
              L.latLng(
                this.currentRide.locations[0].destination.latitude,
                this.currentRide.locations[0].destination.longitude
              ),
            ],
            addWaypoints: false,
          }).addTo(this.map);
        } else if (ride.status == "STARTED") { 
          this.currentRoute = L.Routing.control({
            waypoints: [
              L.latLng(
                this.currentRide.locations[0].departure.latitude,
                this.currentRide.locations[0].departure.longitude
              ),
              L.latLng(
                this.currentRide.locations[0].destination.latitude,
                this.currentRide.locations[0].destination.longitude
              ),
            ],
            addWaypoints: false,
          }).on('routesfound', (e) => {
            this.route = e.routes;
            console.log(this.route);
          }).addTo(this.map);
        }
      }
    );

  }
  openGlobalSocket2() {
    this.stompClient.subscribe(
      '/topic/map-update/update-location',
      (message: { body: string }) => {
        let vehicle: Vehicle = JSON.parse(message.body);
        let existingVehicle = this.rideVehicle[vehicle.id];
        console.log(existingVehicle);
        console.log(vehicle);
        console.log(vehicle.currentLocation.longitude);
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
        // this.currentRide = ride;

        this.driverService.getVehicle(this.authService.getId()).subscribe({
          next: (vehicle) => {
            this.vehicle = vehicle;
            let geoLayerRouteGroup: LayerGroup = new LayerGroup();

            if (this.currentRide.status == 'STARTED') {
              console.log('started');
              this.currentRoute = L.Routing.control({
                waypoints: [
                  L.latLng(
                    this.currentRide.locations[0].departure.latitude,
                    this.currentRide.locations[0].departure.longitude
                  ),
                  L.latLng(
                    this.currentRide.locations[0].destination.latitude,
                    this.currentRide.locations[0].destination.longitude
                  ),
                ],
                addWaypoints: false,
              }).on('routesfound', (e) => {
                this.route = e.routes;
                console.log(this.route);
              });
            } else if (this.currentRide.status == 'ACCEPTED') {
              this.currentRoute = L.Routing.control({
                waypoints: [
                  L.latLng(
                    this.vehicle.currentLocation.latitude,
                    this.vehicle.currentLocation.longitude
                  ),
                  L.latLng(
                    this.currentRide.locations[0].destination.latitude,
                    this.currentRide.locations[0].destination.longitude
                  ),
                ],
                addWaypoints: false,
              })
                .on('routesfound', (e) => {
                  this.route = e.routes;
                  console.log(this.route);
                  console.log(this.route[0]);
                  console.log('accepted');
                  console.log(this.route);

                  let i = 0;
                  this.timerId = setInterval(() => {
                    let step = this.route[0].coordinates[i];

                    if (step == undefined) {
                      clearInterval(this.timerId);
                    }

                    console.log(step);
                    let routeLayer = L.geoJSON(step.geometry);
                    routeLayer.setStyle({ color: `#${this.color}` });
                    routeLayer.addTo(geoLayerRouteGroup);
                    this.ride.id = geoLayerRouteGroup;
                    let markerLayer = marker(
                      [
                        this.vehicle.currentLocation.longitude,
                        this.vehicle.currentLocation.latitude,
                      ]
                    );
                    markerLayer.addTo(geoLayerRouteGroup);
                    const loc: Locations = {
                      address: 'Adresa',
                      latitude: step.lat,
                      longitude: step.lng,
                    };
                    this.vehicleService
                      .updateLocation(this.vehicle.id, loc)
                      .subscribe({
                        next: (res) => {
                        },
                      });
                    i = i + 2;
                    this.rideVehicle[this.vehicle.id] = markerLayer;
                    
                  }, 3000);
                  this.mainGroup = [...this.mainGroup, geoLayerRouteGroup];
                })
                .addTo(this.map);
            }
          },
        });
      },
    );
    this.stompClient.subscribe(
      '/topic/map-update/ended-ride',
      (message: { body: string }) => {
        let ride: RoutingResponse = JSON.parse(message.body);
        this.ride = ride;
        this.mainGroup = this.mainGroup.filter(
          (lg: LayerGroup) => lg !== this.ride.id
        );
        delete this.rideVehicle[this.vehicle.id];
        // delete this.rides[ride.id];
        if (
          this.ride.status === 'FINISHED' ||
          this.ride.status === 'CANCELED'
        ) {
          clearTimeout(this.timerId);
        }
        this.ride = {};
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
    if (this.authService.getRole() === 'ROLE_DRIVER') {
      this.driver.id = this.authService.getId();
      // this.timerId = setInterval(() => {
        this.rideService.getActive(this.authService.getId()).subscribe({
          next: (ride) => {
            this.currentRide = ride;
            console.log(this.currentRide);
  
            this.driverService.getVehicle(this.authService.getId()).subscribe({
              next: (vehicle) => {
                this.vehicle = vehicle;
                let geoLayerRouteGroup: LayerGroup = new LayerGroup();
  
                if (this.currentRide.status == 'STARTED') {
                  console.log('started');
                  this.currentRoute = L.Routing.control({
                    waypoints: [
                      L.latLng(
                        this.currentRide.locations[0].departure.latitude,
                        this.currentRide.locations[0].departure.longitude
                      ),
                      L.latLng(
                        this.currentRide.locations[0].destination.latitude,
                        this.currentRide.locations[0].destination.longitude
                      ),
                    ],
                    addWaypoints: false,
                  }).on('routesfound', (e) => {
                    this.route = e.routes;
                    console.log(this.route);
                  }).addTo(this.map);
                } else if (this.currentRide.status == 'ACCEPTED') {
                  this.currentRoute = L.Routing.control({
                    waypoints: [
                      L.latLng(
                        this.vehicle.currentLocation.latitude,
                        this.vehicle.currentLocation.longitude
                      ),
                      L.latLng(
                        this.currentRide.locations[0].destination.latitude,
                        this.currentRide.locations[0].destination.longitude
                      ),
                    ],
                    addWaypoints: false,
                  }).addTo(this.map);
                }
              },
            });
          },
        });
      // }, 2000);
      
    } else if (this.authService.getRole() === 'ROLE_PASSENGER') {
      this.passenger.id = this.authService.getId();
      this.rideService.getPassengerActive(this.authService.getId()).subscribe({
        next: (ride) => {
          this.currentRide = ride;
          console.log(this.currentRide);

          let geoLayerRouteGroup: LayerGroup = new LayerGroup();
          this.currentRoute = L.Routing.control({
            waypoints: [
              L.latLng(
                this.currentRide.locations[0].departure.latitude,
                this.currentRide.locations[0].departure.longitude
              ),
              L.latLng(
                this.currentRide.locations[0].destination.latitude,
                this.currentRide.locations[0].destination.longitude
              ),
            ],
            addWaypoints: false,
          }).addTo(this.map);
        },
      });
    } else if (this.authService.getRole() === 'ROLE_ADMIN') {
    }

    let DefaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-icon.png',
      iconAnchor: [10, 45],
    });

    L.Marker.prototype.options.icon = DefaultIcon;

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
              vehicle = vehicle;
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
      this.mainGroup = [...this.mainGroup, geoLayerRouteGroup];
    });
  }

  onMapReady(map: Map) {
    this.map = map;
  }
}
