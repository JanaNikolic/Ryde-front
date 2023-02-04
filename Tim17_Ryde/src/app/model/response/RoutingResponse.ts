import { LocationForRide } from "../LocationForRide";
import { Vehicle } from "../Vehicle";

export interface RoutingResponse{
    id: number,
    route: string,
    rideStatus:string,
    vehicle: Vehicle,
    locations: LocationForRide[]
}
