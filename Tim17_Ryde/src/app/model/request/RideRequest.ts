import { Locations } from "../Locations";
import { UserResponse } from "../response/UserResponse";

export interface RideRequest {
    locations: Location[]
    passengers: UserResponse[]
    vehicleType: string
    babyTransport: boolean
    petTransport: boolean
    scheduledTime: string | null
}

export interface Location {
    departure: Locations
    destination: Locations
  }

