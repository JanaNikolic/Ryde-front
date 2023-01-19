import { LocationDTO } from "../Ride";

export interface UnregisteredUserRequest {
    locations: LocationDTO[];
    vehicleType: string;
    babyTransport: boolean;
    petTransport: boolean;
}
