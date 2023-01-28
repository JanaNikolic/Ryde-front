import { LocationForRide } from "../LocationForRide";
import { UserResponse } from "../response/UserResponse";

export interface FavoriteRideRequest {
    favoriteName: string,
    locations: LocationForRide[],
    passengers: UserResponse[],
    vehicleType: string,
    babyTransport: boolean,
    petTransport: boolean;
}