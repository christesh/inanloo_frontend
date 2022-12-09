import { Component, ViewChild, ElementRef, OnInit, ChangeDetectionStrategy, Renderer2 } from '@angular/core';
import { ChatService } from './chat.service';
import { Chat } from './chat.model';

@Component({
  selector: 'app-ticketing',
  templateUrl: './ticketing.component.html',
  styleUrls: ['./ticketing.component.scss'],
  providers: [ChatService]
})
export class TicketingComponent implements OnInit {
  chat: Chat[];
  activeChatUser: string;
  activeChatUserImg: string;
  @ViewChild('messageInput', {static: false}) messageInputRef: ElementRef;
  @ViewChild('chatSidebar', {static: false}) sidebar:ElementRef;
  @ViewChild('contentOverlay', {static: false}) overlay:ElementRef;

  messages = new Array();
  item: number = 0;
  constructor(private elRef: ElementRef, private renderer: Renderer2, private chatService: ChatService) {
    this.chat=chatService.chat1;
    this.activeChatUser = "الیزابت الیوت";
    this.activeChatUserImg = "assets/img/portrait/small/avatar-s-3.png";
  }
  public chat1: Chat[] = [
    new Chat(
        'right',
        'chat',
        'assets/img/portrait/small/avatar-s-1.png',
        '',
        [
            'چطور میتونم بهتون کمک کنم؟'
        ],
        'text'),
    new Chat(
        'left',
        'chat chat-left',
        'assets/img/portrait/small/avatar-s-3.png',
        '1 ساعت قبل',
        [
            'سلام خانم کاظمی، من به دنبال یکی از بهترین قالب های مدیریت هستم',
            'میشه کمکم کنی تا اینو پیدا کنم؟',
            'من دنبال قالب مدیریت با انگولار 8 هستم'
        ]
        , 'text'),
    new Chat(
        'right',
        'chat',
        'assets/img/portrait/small/avatar-s-1.png',
        '30 دقیقه قبل',
        [
            'حتتتتتما!',
            'من بهت پیشنهاد میکنم که همینو بخر خیلی خوبه'
        ]
        , 'text'),
    new Chat(
        'left',
        'chat chat-left',
        'assets/img/portrait/small/avatar-s-3.png',
        '20 دقیقه قبل',
        [
            'میشه برام فایل صوتی بفرستی؟'
        ]
        , 'text'),
    new Chat(
        'right',
        'chat',
        'assets/img/portrait/small/avatar-s-1.png',
        '',
        [
            'http://static.videogular.com/assets/audios/videogular.mp3'
        ]
        , 'audio'),
    new Chat(
        'left',
        'chat chat-left',
        'assets/img/portrait/small/avatar-s-3.png',
        '10 دقیقه قبل',
        [
            'میشه حالا برام فایل ویدئویی بفرستی؟'
        ]
        , 'text'),
    new Chat(
        'right',
        'chat',
        'assets/img/portrait/small/avatar-s-1.png',
        '',
        [
            'http://static.videogular.com/assets/videos/videogular.mp4'
        ]
        , 'video'),
    new Chat(
        'left',
        'chat chat-left',
        'assets/img/portrait/small/avatar-s-3.png',
        'همین حالا',
        [
            'به به ببین چه قالب تمیز و خوشگلیه',
            'این واسه پروژه بعدی من عالیه',
            'چطوری میتونم این قالبو خریداری کنم؟'
        ]
        , 'text'),
    new Chat(
        'right',
        'chat',
        'assets/img/portrait/small/avatar-s-1.png',
        '',
        [
            'ممنونم. از سایت راستچین'
        ]
        , 'text'),
    new Chat(
        'left',
        'chat chat-left',
        'assets/img/portrait/small/avatar-s-3.png',
        '',
        [
            'من برای اطمینان اینو ازت میخرم',
            'ممنونم.'
        ]
        , 'text'),
];
  ngOnInit() {
    // $.getScript('./assets/js/chat.js');
   
    
  }

  //send button function calls
  onAddMessage() {
    if (this.messageInputRef.nativeElement.value != "") {
      this.messages.push(this.messageInputRef.nativeElement.value);
    }
    this.messageInputRef.nativeElement.value = "";
    this.messageInputRef.nativeElement.focus();
  }

  //chat user list click event function
  SetActive(event:any, chatId: string) {
    var hElement: HTMLElement = this.elRef.nativeElement;
    //now you can simply get your elements with their class name
    var allAnchors = hElement.getElementsByClassName('list-group-item');
    //do something with selected elements
    [].forEach.call(allAnchors, function (item: HTMLElement) {
      item.setAttribute('class', 'list-group-item no-border');
    });
    //set active class for selected item
    event.currentTarget.setAttribute('class', 'list-group-item bg-blue-grey bg-lighten-5 border-right-primary border-right-2');

    this.messages = [];

    if (chatId === 'chat1') {
      this.chat = this.chatService.chat1;
      this.activeChatUser = "الیزابت الیوت";
      this.activeChatUserImg = "assets/img/portrait/small/avatar-s-3.png";
    }
    else if (chatId === 'chat2') {
      this.chat = this.chatService.chat2;
      this.activeChatUser = "کریستوفر کندی";
      this.activeChatUserImg = "assets/img/portrait/small/avatar-s-7.png";
    }
    else if (chatId === 'chat3') {
      this.chat = this.chatService.chat3;
      this.activeChatUser = "سارا کریمی";
      this.activeChatUserImg = "assets/img/portrait/small/avatar-s-8.png";
    }
    else if (chatId === 'chat4') {
      this.chat = this.chatService.chat4;
      this.activeChatUser = "بروس راید";
      this.activeChatUserImg = "assets/img/portrait/small/avatar-s-5.png";
    }
    else if (chatId === 'chat5') {
      this.chat = this.chatService.chat5;
      this.activeChatUser = "هادر هاول";
      this.activeChatUserImg = "assets/img/portrait/small/avatar-s-9.png";
    }
    else if (chatId === 'chat6') {
      this.chat = this.chatService.chat6;
      this.activeChatUser = "کلی رایز";
      this.activeChatUserImg = "assets/img/portrait/small/avatar-s-4.png";
    }
    else if (chatId === 'chat7') {
      this.chat = this.chatService.chat7;
      this.activeChatUser = "وینسنت نلسون";
      this.activeChatUserImg = "assets/img/portrait/small/avatar-s-14.png";
    }

  }

  onSidebarToggle() {
    this.renderer.removeClass(this.sidebar.nativeElement, 'd-none');
    this.renderer.removeClass(this.sidebar.nativeElement, 'd-sm-none');
    this.renderer.addClass(this.sidebar.nativeElement, 'd-block');
    this.renderer.addClass(this.sidebar.nativeElement, 'd-sm-block');
    this.renderer.addClass(this.overlay.nativeElement, 'show');
  }

  onContentOverlay() {
    this.renderer.removeClass(this.overlay.nativeElement, 'show');
    this.renderer.removeClass(this.sidebar.nativeElement, 'd-block');
    this.renderer.removeClass(this.sidebar.nativeElement, 'd-sm-block');
    this.renderer.addClass(this.sidebar.nativeElement, 'd-none');
    this.renderer.addClass(this.sidebar.nativeElement, 'd-sm-none');

  }

}
