import { Locations } from "./Locations";

export interface Ride{
    id:number;
    startTime: string,
    endTime: string,
    totalCost: number,
    estimatedTimeInMinutes: number,
    locations:LocationDTO[];
    
}
export interface pageRide{
    count:number
    rides:Ride[]
}

export interface LocationDTO{
    departure:Locations,
    destination:Locations
}
