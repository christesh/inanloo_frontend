import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ApiServicesService } from '../api-services.service';
import { environment } from '../../environments/environment';
import * as moment from 'jalali-moment';
@Component({
  selector: 'app-Chat',
  templateUrl: './Chat.component.html',
  styleUrls: ['./Chat.component.css']
})
export class ChatComponent implements OnInit {
  picurl = environment.PIC_URL + "/media/"
  constructor(
    private api: ApiServicesService,
    private tokencookies: CookieService,
  ) { }
  users: { uid: string, pid: string, fullname: string, subname: string, pic: string, status: string, active: string, unread: string, nobadge: boolean }[] = []
  selected: { uid: string, pid: string, fullname: string, subname: string, pic: string, status: string, active: string, unread: string, nobadge: boolean }
  messages: { id: string, sender: string, text: string, datetime: string }[] = []
  sendmessage: string;
  curentuid = ""
  selectedpic = ""
  showbadge: boolean = true
  ngOnDestroy() {
    localStorage.setItem("chat", "off")
  }
  ngOnInit() {
    var token = this.tokencookies.get('T')
    this.api.connectedusers(token).subscribe(
      res => {
       // console.log(res)
        var uid: any[] = []
        var unread: { uid: string, count: string }[] = []
        this.curentuid = localStorage.getItem('userID')!
        for (let i = 0; i < res.length; i++) {
          if (res[i]['receiver'] == this.curentuid && res[i]['read'] == false)
            unread.push({ uid: res[i]['sender_id'], count: res[i]['read__count'] })

          var indx = -1;
          indx = uid.findIndex(item => item == res[i]['sender_id']);
          if (indx == -1)
            if (res[i]['sender_id'] != this.curentuid) {
              uid.push(Number(res[i]['sender_id']))
            }
          var indx = -1;
          indx = uid.findIndex(item => item == res[i]['receiver']);
          if (indx == -1)
            if (res[i]['receiver'] != this.curentuid) {
              uid.push(Number(res[i]['receiver']))
            }
        }
       // console.log(uid)
        this.api.getuserorderstech(token).subscribe(
          res => {
            for (let i = 0; i < res.length; i++) {
              uid.push(Number(res[i]['tid']))
            }
            this.api.getuserchatstatus(token, uid).subscribe(
              res => {
               // console.log(res)
                this.users.push(
                  {
                    uid: '0',
                    pid: '0',
                    fullname: "پشتیبانی اینانلو سرویس",
                    subname: "Masih",
                    pic: "https://therichpost.com/wp-content/uploads/2020/06/avatar2.png",
                    status: "online",
                    active: "active",
                    unread: "0",
                    nobadge: true
                  }
                )
                for (let i = 0; i < res.length; i++) {
                  var idx = -1
                  var unreadc = "0"
                 // console.log(unread)
                 // console.log(res[i]['user_id'])
                  if (unread.length != 0)
                    idx = unread.findIndex(item => item.uid == res[i]['user_id'])
                  if (idx != -1)
                    unreadc = unread[idx].count
                  this.users.push(
                    {
                      uid: res[i]['user_id'],
                      pid: res[i]['person_id']!,
                      fullname: res[i]['firstName'] + " " + res[i]['lastName'],
                      subname: "Masih",
                      pic: this.picurl + res[i]['pic'],
                      status: res[i]['status'],
                      active: "deactive",
                      unread: unreadc,
                      nobadge: Number(unreadc) == 0 ? true : false
                    }
                  )
                }
                this.selected = this.users[0]
                localStorage.setItem("chat", "on")
                // this.SelectUser('0')
              },
              err => {
                console.log(err)
              }
            )
          },
          err => {
            console.log(err)
          }
        )
      },
      err => {
        console.log(err)
      }
    )

  }
  SelectUser(user: any) {
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].uid == user.uid) {
        this.users[i].active = "active"
        this.users[i].nobadge = true;
        this.users[i].unread = "0";
        this.selected = this.users[i]
        this.selectedpic = this.users[i].pic
        this.getUserMessage(user.uid)
      }
      else
        this.users[i].active = "deactive"

    }
  }
  getUserMessage(rid: any) {
    this.messages = []
    var token = this.tokencookies.get('T')
   // console.log(rid)
    this.api.getusermessages(token, rid).subscribe(
      res => {
       // console.log(res)
        for (let i = 0; i < res.length; i++) {
          var sender = ""
          var re = /-/gi;
          var d = res[i]['messageDateTime'].split("T", 2)
          var time = d[1].substring(0, 8)
          var tdate = d[0].toString().replace(re, "/")
          var date = tdate.replace(re, "/")
          date = moment(date).locale('fa').format('YYYY/M/D');
          var datetime = ""
          if (res[i]['sender_id'] == this.curentuid) {
            sender = "me"
            datetime = date + " -- " + time
          }
          else {
            sender = "someone"
            datetime = time + " -- " + date
          }
          this.messages.push({
            id: res[i]['id'],
            sender: sender,
            text: res[i]['messageText'],
            datetime: datetime
          })
        }
        setTimeout(() => this.scrolltop = this.chatcontent.nativeElement.scrollHeight, 0);
      },
      err => {
       console.log(err)
      }
    )

  }
  scrolltop: number | null = null;
  @ViewChild('chatcontent') chatcontent: ElementRef;
  send() {
    var token = this.tokencookies.get('T')
    this.api.getdatetimenow(token).subscribe(
      res => {
        var re = /-/gi;
        var d = res.split("T", 2)
        var time = d[1].substring(0, 8)
        var tdate = d[0].toString().replace(re, "/")
        var date = tdate.replace(re, "/")
        date = moment(date).locale('fa').format('YYYY/M/D');
        var datetime = date + " -- " + time
        this.messages.push({
          id: this.messages.length.toString(),
          sender: "me",
          text: this.sendmessage,
          datetime: datetime
        })
        this.messages.splice(1,0);
        this.sendmessage=""
        var token = this.tokencookies.get('T')
        this.api.sendmessages(token, this.selected.uid, this.sendmessage).subscribe(
          res => {
           // console.log(res)
            this.api.sendmessagenotification(token, this.curentuid, this.selected.uid, this.sendmessage).subscribe(
              res => {
               // console.log(res)
              },
              err => {
                console.log(err)
              }
            )
            setTimeout(() => this.scrolltop = this.chatcontent.nativeElement.scrollHeight, 50);
          },
          err => {
            console.log(err)
          }
        )
      },
      err => {
        console.log(err)
      }
    )
  }
  recieve(sender: any) {
    if (this.selected.uid == sender) {
      this.getUserMessage(sender)
    }
    else {
      var idx = -1
      idx = this.users.findIndex(item => item.uid == sender)
      if (idx != -1) {
        var cunread = Number(this.users[idx].unread)
        this.users[idx].nobadge = false
        this.users[idx].unread = (cunread + 1).toString()
      }
      else {
        var token = this.tokencookies.get('T')
        var uid = [sender]
        this.api.getuserchatstatus(token, uid).subscribe(
          res => {
           // console.log(res)
            for (let i = 0; i < res.length; i++) {
              var idx = -1

              this.users.push(
                {
                  uid: res[i]['user_id'],
                  pid: res[i]['person_id']!,
                  fullname: res[i]['firstName'] + " " + res[i]['lastName'],
                  subname: "Masih",
                  pic: this.picurl + res[i]['pic'],
                  status: res[i]['status'],
                  active: "deactive",
                  unread: "1",
                  nobadge: false
                }
              )
            }

          },
          err => {
           console.log(err)
          }
        )
      }
    }
  }
  keypress(event: any) {
    if (event.key == "Enter") {
      this.send()
      // this.sendmessage = ""
    }
  }
  keyup(event: any) {
    if (event.key == "Enter") {
      // this.sendmessage = ""
    }
  }

}
