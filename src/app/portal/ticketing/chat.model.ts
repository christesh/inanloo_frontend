import { NbChatMessageFile } from "@nebular/theme";

export class Message {
    public type: string;
    public text: string;
    public reply: string;
    public user:{name:string,avatar:string};
    public date: Date;
    public quote:string;
    public files: NbChatMessageFile[];
    public latitude: number;
    public longitude: number;

}