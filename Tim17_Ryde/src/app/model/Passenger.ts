export interface Passenger{
    id?:number;
    name:string;
    surname:string;
    telephoneNumber:string;
    profilePicture?: string;
    email:string;
    address:string;
    password:string;
    blocked: Boolean;
    active: Boolean;
}
export interface pagePassenger{
    count:number
    results:Passenger[]
}