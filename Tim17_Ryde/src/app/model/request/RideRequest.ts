import { Locations } from "../Locations";

export interface RideRequest {
    locations: Location[]
    passengers: Passenger[]
    vehicleType: string
    babyTransport: boolean
    petTransport: boolean
    scheduledTime: string | null
}

export interface Location {
    departure: Locations
    destination: Locations
  }


export interface Passenger {
    id: number,
    email: string
}
