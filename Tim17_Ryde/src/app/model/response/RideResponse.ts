import { Locations } from "../Locations";
import { Passenger } from "../Passenger";
import { UserResponse } from "./UserResponse";

export interface RideResponse{
    id:number;
    startTime: string,
    endTime: string,
    totalCost: number,
    estimatedTimeInMinutes: number,
    babyTransport: boolean,
    petTransport: boolean,
    status: boolean,
    locations:LocationDTO[],
    passengers:UserResponse[],
    scheduledTime: string;
}

export interface LocationDTO{
    departure:Locations,
    destination:Locations
}
