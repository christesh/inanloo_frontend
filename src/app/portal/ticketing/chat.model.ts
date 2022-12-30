

export class Message {
    public type: string;
    public text: string;
    public reply: string;
    public user:{name:string,avatar:string};
    public date: Date;
    public quote:string;
    public latitude: number;
    public longitude: number;

}