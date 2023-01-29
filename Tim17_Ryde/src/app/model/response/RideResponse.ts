import { Locations } from "../Locations";
import { UserResponse } from "./UserResponse";

export interface RideResponse{
    id:number;
    startTime: string,
    endTime: string,
    totalCost: number,
    estimatedTimeInMinutes: number,
    babyTransport: boolean,
    petTransport: boolean,
    status: string,
    locations:LocationDTO[],
    passengers:UserResponse[],
    scheduledTime: string,
    vehicleType: string,
    driver: UserResponse
}

export interface LocationDTO{
    departure:Locations,
    destination:Locations
}
