import { LocationForRide } from "../LocationForRide";
import { UserResponse } from "./UserResponse";

export interface FavoriteRidePage {
    count: number,
    results: FavoriteRideResponse[];
}

export interface FavoriteRideResponse {
    id: number,
    favoriteName: string,
    locations: LocationForRide[],
    passengers: UserResponse[],
    vehicleType: string,
    babyTransport: boolean,
    petTransport: boolean;
}