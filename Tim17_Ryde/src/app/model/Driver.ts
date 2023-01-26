export interface Driver{
    id?:number;
    name:string;
    surname:string;
    telephoneNumber:string;
    email:string;
    address:string;
    profilePicture?:string;
    password:string;
    blocked:Boolean;
    active:Boolean;
}
export interface pageDriver{
    count:number
    results:Driver[]
}
