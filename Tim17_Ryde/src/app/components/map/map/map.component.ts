import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { MapService } from '../map.service';
import { Driver } from 'src/app/model/Driver';
import { Vehicle } from 'src/app/model/Vehicle';
import { DriverService } from 'src/app/services/driver/driver.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {
  private map: any;
  drivers:Driver[] = [];
  vehicle:Vehicle = {
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
    popupAnchor:  [-3, -76],
    iconAnchor:   [30, 30]

  })

  redCarIcon = L.icon({
    iconUrl: "assets/images/redCar.png",
    iconSize: [30, 30],
    popupAnchor:  [-3, -76],
    iconAnchor:   [30, 30]

  })

  constructor(private mapService: MapService, private driverService: DriverService) {}

  private initMap(): void {
    this.map = L.map('map', {
      center: [45.2396, 19.8227],
      zoom: 13,
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

    // this.search();
    this.addMarker();
    // this.registerOnClick();
    // this.route();
  }

  search(): void {
    // this.mapService.search('Strazilovska 19').subscribe({
    //   next: (result) => {
    //     console.log(result);
    //     L.marker([result[0].lat, result[0].lon])
    //       .addTo(this.map)
    //       .bindPopup('Pozdrav iz Strazilovske 19.')
    //       .openPopup();
    //   },
    //   error: () => {},
    // });
  }

  registerOnClick(): void {
    this.map.on('click', (e: any) => {
      const coord = e.latlng;
      const lat = coord.lat;
      const lng = coord.lng;
      // this.mapService.reverseSearch(lat, lng).subscribe((res) => {
      //   console.log(res.display_name);
      // });
      console.log(
        'You clicked the map at latitude: ' + lat + ' and longitude: ' + lng
      );
      const mp = new L.Marker([lat, lng]).addTo(this.map);
      alert(mp.getLatLng());
    });
  }

  route(): void {
    L.Routing.control({
      waypoints: [L.latLng(57.74, 11.94), L.latLng(57.6792, 11.949)],
    }).addTo(this.map);
  }

  private addMarker(): void {
    const lat: number = 45.25;
    const lon: number = 19.8228;

    L.marker([lat, lon])
      .addTo(this.map)
      .bindPopup('Trenutno se nalazite ovde.')
      .openPopup();
  }

  ngAfterViewInit(): void {
    let DefaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-icon.png',
    });

    L.Marker.prototype.options.icon = DefaultIcon;
    this.initMap();

    this.driverService.getAllDrivers()
    .subscribe(
      
      (pageDriver) => {
        
        this.drivers = pageDriver.drivers;
        for(let driver of this.drivers){
          
            if (driver.blocked === false){
              
              this.driverService.getVehicle(driver.id as number).
              subscribe(
                (vehicle) =>{
                  
                  this.vehicle = vehicle
                  if (driver.active== true){
                  L.marker([vehicle.currentLocation?.latitude as number, vehicle.currentLocation?.longitude as number],
                     {icon: this.greenCarIcon}).addTo(this.map);
                  }
                  else{
                    L.marker([vehicle.currentLocation?.latitude as number, vehicle.currentLocation?.longitude as number],
                      {icon: this.redCarIcon}).addTo(this.map);
                  }
                
                }
                );
            }
        }
      }
    
      );
  }

}
