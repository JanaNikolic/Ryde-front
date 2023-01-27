import { RideResponse } from "./RideResponse";

export interface PanicResponse {
    id: number,
    user: UserPanicResponse,
    ride: RideResponse,
    time: string,
    reason: string;
}

export interface UserPanicResponse {
    id: number,
    name: string,
    surname: string,
    profilePicture: string,
    telephoneNumber: string,
    email: string,
    address: string;
}