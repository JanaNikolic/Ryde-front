import { Passenger } from "./Passenger"

export interface Review{
    id:number,
    rating:number,
    comment:string,
    passenger:Passenger
}

export interface RideReview{
    vehicleReview: Review[],
    driverReview:Review[]
}