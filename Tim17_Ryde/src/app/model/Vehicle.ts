export interface Vehicle{
    id?:number,
    driverId?:number,
    vehicleType:string,
    model:string,
    licenseNumber:string,
    currentLocation?:Location,
    passengerSeats:number,
    babyTransport:boolean,
    petTransport:boolean,

}