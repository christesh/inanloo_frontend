
export class Province {
    id: number;
    provinceName: string;
    counties:Counties[];
}

export class Counties {
    id: number;
    countyName: string;
    cities:Cities[];
}

export class Cities {
    id: number;
    cityName: string;
    regions:Regions[];
}
export class Regions {
    id: number;
    regionName: string;
    neighbourhoods:Nighbourhoods[];
}
export class Nighbourhoods {
    id: number;
    neighbourhoodName: string;
    neighbourhoodDescription:string;
}
export class Address{
    id:number
    province: Province;
    addressStreet: string;
    addressLane: string;
    addressNo: string;
    addressUnit: string;
    addressFloor: string;
    isMain: string;
    addressLat: string;
    addressLong: string;
   
}




export class Mobile{
    id:number;
    mobileNumber: string;
    isMain: boolean;
    person:number;
}
export class Telephone{
    id:number;
    phoneNumber: string;
}
export class CustomerProfile {
    id:number;
    firstName: string;
    lastName: string;
    nationalId: string;
    birthDate: string;
    mobile: Mobile[];
    phones: Telephone[];
    address: Address[];
    customerCategory:number;
}

export class ThechnicianProfile{
    id:number;
    firstName: string;
    lastName: string;
    nationalId: string;
    birthDate: string;
    mobile: Mobile[];
    phones: Telephone[];
    address: Address[];
    technicianCategory:number;
    technicianSkills:[];
    technicianRate:number;
}

export class MembersPermission{
    title:string;
    active:boolean;
    description:string;
}
export class MembersGroup{
    group:string;
    description:string;
    permissions:MembersPermission[];
}
export class CompanyMembers{
    id:number;
    firstName: string;
    lastName: string;
    nationalId: string;
    birthDate: string;
    mobile: Mobile[];
    phones: Telephone[];
    address: Address[];
    membersGroup:MembersGroup[];
    hireDate:Date;
    quitDate:Date;
}