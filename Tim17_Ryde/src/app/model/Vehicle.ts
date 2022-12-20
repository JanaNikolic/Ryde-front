import { Locations } from "./Locations";

export interface Vehicle{
    id?:number,
    driverId?:number,
    vehicleType:string,
    model:string,
    licenseNumber:string,
    currentLocation?:Locations,
    passengerSeats:number,
    babyTransport:boolean,
    petTransport:boolean,

}