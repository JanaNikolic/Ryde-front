export interface Note{
    id?:number;
    date?:string;
    message:string;
}

export interface pageNote{
    count:number
    results:Note[]
}