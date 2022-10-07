export class Problem{
    ID:number;
    title:string;
    checked:boolean;
    description:string;
    lowprice:string;
    highprice:string;
}
export class Order {
    customerID:number;
    orderNumber:string;
    applienceID:number;
    brandID:number;
    modelID?:number;
    deviceSerial:string;
    hasGuarantee:boolean;
    problem:Problem[];
    problemComment:string;
    problemPics:string[];
    orderDate:string;
    timeRange:number;
    orderAddressID:number;
    orderComfirm:boolean;
    orderCost:number;
    statusID:number;
    technicianID:number 
}
export class Models{
    ID:number;
    model: string;
    description: string 
}export class Brands{
    ID:number;
    brand: string;
    brandpic: string;
    description: string;
    models:Models[]
}
export class Applience{
    ID: number;
    title: string;
    pic: string;
    description: string;
    brands:Brands[]
}
export class TimeRange{
    ID:number;
    title:string
}
