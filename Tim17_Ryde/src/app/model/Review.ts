import { Passenger } from "./Passenger"

export interface ReviewResponse{
    id:number,
    rating:number,
    comment:string,
    passenger:Passenger
}

export interface ReviewRequest{
    rating:number,
    comment:string
}

export interface RideReview{
    vehicleReview: ReviewResponse[],
    driverReview:ReviewResponse[]
}

export interface pageReview{
    count:number
    results:ReviewResponse[]
}