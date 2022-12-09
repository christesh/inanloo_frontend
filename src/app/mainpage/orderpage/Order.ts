import { LocalDataSource } from "ng2-smart-table";

export class Problem{
    ID:number;
    kind:string;
    title:string;
    checked:boolean;
    description:string;
    lowprice:string;
    highprice:string;
}
export class Order {
    customerID:number;
    registerID:number;
    orderNumber:string;
    applienceID:number;
    brandID:number;
    modelID?:number;
    deviceSerial:string;
    hasGuarantee:boolean;
    guaranteePic:File;
    guaranteeStartDate:string;
    guaranteeEndDate:string;
    invoicePic:File;
    problem:Problem[];
    problemComment:string;
    problemPics:File[];
    orderDate:string;
    timeRange:number;
    orderAddressID:number;
    orderConfirm:boolean;
    orderCost:number;
    statusID:number;
    technicianID:number;

}
export class Models{
    ID:number;
    model: string;
    description: string;
    modelProblems:LocalDataSource;
    modelChecklist:LocalDataSource;
}
export class Brands{
    ID:number;
    brand: string;
    brandpic: string;
    description: string;
    brandProblems:LocalDataSource;
    brandChecklist:LocalDataSource;
    models:Models[]
}
export class Applience{
    ID: number;
    title: string;
    pic: string;
    description: string;
    appProblems:LocalDataSource;
    appChecklist:LocalDataSource;
    brands:Brands[]
}
export class TimeRange{
    ID:number;
    title:string
}
