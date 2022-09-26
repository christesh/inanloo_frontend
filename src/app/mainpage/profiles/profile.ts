
export class Province {
    id: number;
    name: string;
}
export class Shahrestan {
    id: number;
    name: string;
}
export class City {
    id: number;
    name: string;
}
export class Address{
    province: Province;
    shahrestan: Shahrestan;
    city: City;
    region: string;
    mainstreet: string;
    substreet: string;
    lane: string;
    building: string;
    no: string;
    unit: string;
    desciription: string;
}
export class Mobile{
    number: string;
    ismain: boolean;
}
export class Telephone{
    number: string;
}
export class CustomerProfile {
    firstName: string;
    lastName: string;
    nationalId: string;
    birthDate: string;
    mobileNumber: Mobile[];
    telNumber: Telephone[];
    address: Address[];
}