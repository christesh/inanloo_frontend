import { Component, ViewChild, ElementRef, OnInit, ChangeDetectionStrategy, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Message } from './chat.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-ticketing',
  templateUrl: './ticketing.component.html',
  styleUrls: ['./ticketing.component.scss'],

})
export class TicketingComponent implements OnInit {
  messages: Message[] = []
  showchats:boolean=false;
  chatForm=new FormGroup ({
    message:new FormControl('', Validators.required),
  })
  users:{fullname:string,group:string,pic:string}[]=[]
  chats:{roomname:string,nickname:string,type:string,date:string,message: string }[]=[]
  nickname:string;
  roomname:string;
  datepipe:DatePipe;
  @ViewChild('chatcontent') chatcontent: ElementRef;
  scrolltop: number|null = null;
  constructor() {

  }
  public d:Date;
  c=0;
  ngOnInit(): void {

    this.users.push({fullname:"masih ebi",group:"tech",pic:"string"})
    this.users.push({fullname:"sheyda",group:"tech",pic:"string"})
    this.users.push({fullname:"hossein",group:"tech",pic:"string"})
  }
  onFormSubmit(form: any) {
    this.c++;
    const chat = form;
    chat.roomname = this.roomname;
    chat.nickname = this.nickname;
    // chat.date = this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss');
    chat.type = 'message';
    var nn=this.nickname
    if (this.c%2==0)
      nn="this.nickname"

    this.chats.push({roomname:"asda",nickname:nn,type:"text",date:"2022-12-12",message: form.message })
    this.chatForm.controls.message.patchValue("");
    this.chatForm.controls.message.markAsDirty();
    setTimeout(() => this.scrolltop = this.chatcontent.nativeElement.scrollHeight, 50);
  }
}