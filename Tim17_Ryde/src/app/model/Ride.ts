import { Driver } from "./Driver";
import { Locations } from "./Locations";
import { Passenger } from "./Passenger";

export interface Ride{
    id:number;
    startTime: string,
    endTime: string,
    totalCost: number,
    estimatedTimeInMinutes: number,
    status: string;
    locations:LocationDTO[],
    passengers:Passenger[],
    driver:Driver;
}
export interface pageRide{
    count:number
    results:Ride[]
}

export interface LocationDTO{
    departure:Locations,
    destination:Locations
}

export interface RideCountResponse {
    countsByDay:Map<string, number>,
    totalCount:number,
    averageCount:number
}

export interface KilometersResponse {
    kilometersByDay:Map<string, number>,
    totalCount:number,
    averageCount:number
}
export interface MoneyResponse {
    money:Map<string,number>,
    totalCount:number,
    averageCount:number
}
