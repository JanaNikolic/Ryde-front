import { Locations } from "./Locations";
import { Passenger } from "./Passenger";

export interface Ride{
    id:number;
    startTime: string,
    endTime: string,
    totalCost: number,
    estimatedTimeInMinutes: number,
    locations:LocationDTO[],
    passengers:Passenger[];
}
export interface pageRide{
    count:number
    results:Ride[]
}

export interface LocationDTO{
    departure:Locations,
    destination:Locations
}
