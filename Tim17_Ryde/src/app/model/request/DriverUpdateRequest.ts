import { Driver } from "../Driver";
import {UserResponse} from "../response/UserResponse"

export interface DriverUpdateResponse {
    id:number;
    name:string,
    driver:UserResponse,
    surname:string,
    profilePicture:string,
    telephoneNumber:string,
    email:string,
    address:string,
    documents:Document[]
}
export interface DriverUpdateRequest {
    name:string,
    surname:string,
    profilePicture:string,
    telephoneNumber:string,
    email:string,
    address:string,
    documents:Document[]
}
export interface Document{
    name:string,
    documentImage:string
}
