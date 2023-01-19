import { Component, ViewChild, ElementRef, OnInit, ChangeDetectionStrategy, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'jalali-moment';
import { DatePipe } from '@angular/common';
import { LocalDataSource } from 'ng2-smart-table';
import { ApiServicesService } from 'src/app/api-services.service';
import { CookieService } from 'ngx-cookie-service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Token } from '@angular/compiler';
import { environment } from 'src/environments/environment';
import { faTruckMedical } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-ticketing',
  templateUrl: './ticketing.component.html',
  styleUrls: ['./ticketing.component.scss'],


})
export class TicketingComponent implements OnInit {
  baseurl = environment.API_URL;
  ticketTableSetting: any;
  ticketTableValue: LocalDataSource;
  formSubmitAttempt: boolean | undefined;
  SelectedSubject: any;
  SelectedPriority: any;
  SelectedOrder: any;
  ticketID: string;
  progress: number;
  subjects: any[] = []
  priority: any[] = []
  orders: any[] = []
  newTicket: boolean = false;
  openAccordion: boolean = true;
  staff: boolean = false;
  file: File[] = [];
  urls: any[] = [];
  ticketdate: string;
  ticketlastdate: string;
  ticketstatus: string;
  ticketsubject: string;
  ticketno: string;
  showticketchats: boolean = false;
  constructor(
    private api: ApiServicesService,
    private ticketCookies: CookieService
  ) {

  }
  ticketForm: FormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    comment: new FormControl('', Validators.required)
  })
  ticketFormanswer: FormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    comment: new FormControl('', Validators.required)
  })
  chats: { id: string, sender: string, date: string, answer: boolean, comment: string }[] = []
  answertoticket: boolean = false;
  reply() {
    this.answertoticket = true;
  }
  ngOnInit(): void {
    var usercat = localStorage.getItem('userCat');
    if (usercat == "ستاد") {
      this.staff = true;
    }
    else {
      this.staff = false;
    }
    var token = this.ticketCookies.get('T')
    this.api.getordersid(token).subscribe(
      res => {
        this.orders = res
        if (this.staff) {
          this.ticketTableSetting = {
            
            editable: false,
            pager: {
              display: true,
              perPage: 5
            },
            actions: {
              columnTitle: "عملیات",
              add: false,
              edit: false,
              delete: false,
              position: 'left',
              custom: [
                { name: 'viewrecord', title: '&nbsp;&nbsp<i class="fa fa-eye"  ></i>' }]
              // { name: 'makeorder', title: '&nbsp;&nbsp;<i class="fa fa-plus-square" ></i>' }]
            },
            columns: {
              ticketNo: {
                title: "شماره تیکت",
              },
              user: {
                title: "کاربر"
              },
              name: {
                title: "نام و نام‌خانوادگی"
              },
              priority:
              {
                title: 'اولویت'
              },
              ticketDate: {
                title: " تاریخ ایجاد"
              },
              ticketSubject: {
                title: "موضوع",
              },
              status: {
                title: "وضعیت  "
              },
            },
            attr: {
              class: "table table-responsive"
            },
            noDataMessage: "هیچ تیکتی تاکنون ثبت نشده است"
          };
          this.api.getalltickets(token).subscribe(
            res => {
              console.log(res)
              var ticketval: any[] = []
              for (let i = 0; i < res.length; i++) {
                var id = res[i]['id'];
                var ticketNo = res[i]['ticketNo'];
                var user = res[i]['person']['category_id__name'];
                var name = res[i]['person']['person_id__firstName'] + " " + res[i]['person']['person_id__lastName'];
                var cdate = res[i]['createDateTime']
                cdate = cdate.split("T", 1)
                var re = /-/gi;
                cdate = cdate.toString().replace(re, "/")
                cdate = moment(cdate).locale('fa').format('YYYY/M/D');
                var priority = res[i]['ticketPriority_id__priorityTitle']
                var subjet = res[i]['subject_id__title']
                var title = res[i]['title']
                var status = res[i]['ticketStatus_id__statusTitle']

                ticketval.push({ id: id, ticketNo: ticketNo, user: user, name: name, priority: priority, ticketDate: cdate, ticketSubject: subjet, ticketTitle: title, status: status })
              }
              this.ticketTableValue = new LocalDataSource(ticketval)
            },
            err => {
              console.log(err)
            }
          )
        }
        else {
          this.ticketTableSetting = {
            editable: false,
            pager: {
              display: true,
              perPage: 10
            },
            actions: {
              columnTitle: "عملیات",
              add: false,
              edit: false,
              delete: false,
              custom: [
                { name: 'viewrecord', title: '&nbsp;&nbsp<i class="fa fa-eye"  ></i>' }]
              // { name: 'makeorder', title: '&nbsp;&nbsp;<i class="fa fa-plus-square" ></i>' }]
            },
            columns: {
              ticketNo: {
                title: "شماره تیکت",
              },
              user: {
                title: "کاربر"
              },
              name: {
                title: "نام و نام‌خانوادگی"
              },
              priority:
              {
                title: 'اولویت'
              },
              ticketDate: {
                title: " تاریخ ایجاد"
              },
              ticketSubject: {
                title: "موضوع",
              },
              ticketTitle: {
                title: "عنوان "
              },

              status: {
                title: "وضعیت  "
              },
            },
            attr: {
              class: "table table-responsive"
            },
            noDataMessage: "هیچ تیکتی تاکنون ثبت نشده است"
          };
        }




        ////get ticket subjects///////
        this.api.getticketallstatusprioritysubject(token).subscribe(
          res => {
            console.log(res)
            this.newTicket = false;
            this.priority = res[1]['priority']
            this.subjects = res[2]['subject']
          },
          err => {
            console.log(err)
          }
        )

      },
      err => {
        console.log(err)
      })
  }
  isFieldInvalid(field: string) { // {6}
    return (
      (!this.ticketForm.get(field)?.valid && this.ticketForm.get(field)?.touched) ||
      (this.ticketForm.get(field)?.untouched && this.formSubmitAttempt)
    );
  }
  Createticket() {
    this.newTicket = true;
    this.ticketForm.controls['title'].patchValue("");
    this.ticketForm.controls['comment'].patchValue("");
    this.ticketForm.controls['title'].markAsDirty();
    this.ticketForm.controls['comment'].markAsDirty();
  }
  onSelectFile(event: any) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();
        this.file[i] = event.target.files[i]
        reader.onload = (event: any) => {
          this.urls.push(this.file[i].name);
        }
        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }
  SelectSubject(event: any) {

  }
  SelectPriority(event: any) {

  }
  SelectOrder(event: any) {

  }
  CancelTicket() {
    this.openAccordion = true;
    this.showticketchats = false
  }
  sendTicketChat() {

    this.answertoticket = false;
    var lastchatid = this.chats[this.chats.length - 1].id
    var token = this.ticketCookies.get('T')
    var title = this.ticketFormanswer.controls['title'].value
    var comment = this.ticketFormanswer.controls['comment'].value
    this.api.createticketchat(token, this.ticketID, lastchatid, title, comment).subscribe(
      res => {
        console.log(res)
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Token " + token);
        var formdata = new FormData();
        formdata.append("ticketNo", this.ticketID);
        formdata.append("sender", localStorage.getItem('userID')!);
        for (let i = 0; i < this.file.length; i++) {
          formdata.append("file", this.file[i], this.file[i].name);
        }
        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: formdata,
        };
        fetch(this.baseurl + "/support/uploadticketfile/", requestOptions)
          .then(response => response.text())
          .then(result => console.log(result))
          .catch(error => console.log('error', error));
      },
      err => {
        console.log(err)
      }
    )

  }
  CancelTicketChat() {
    this.answertoticket = false;
  }
  TableAction(event: any) {
    switch (event.action) {
      case "viewrecord":
        console.log(event)
        this.chats = []
        this.ticketno = event.data.ticketNo;
        this.ticketID = event.data.id;
        this.ticketdate = event.data.ticketDate;
        this.ticketstatus = event.data.status
        this.ticketsubject = event.data.ticketSubject;
        this.openAccordion = false;
        this.showticketchats = true;
        var token = this.ticketCookies.get('T')
        this.api.getticketschatbyno(token, this.ticketno).subscribe(
          res => {
            for (let i = 0; i < res.length; i++) {
              var sender = res[i]['sender_firstname'] + " " + res[i]['sender_lastname']
              var ans: boolean = false;
              if (sender == event.data.name)
                ans = true;
              var odate = res[i]['chatDate']
              odate = odate.split("T", 1)
              var re = /-/gi;
              odate = odate.toString().replace(re, "/")
              odate = moment(odate).locale('fa').format('YYYY/M/D');
              this.chats.push({
                id: res[i]['id'],
                sender: sender,
                date: odate,
                answer: ans,
                comment: res[i]['comment_text']
              })
            }
          },
          err => {
            console.log(err)
          }
        )
        break;
    }

  }
  SaveTicket() {
    var token = this.ticketCookies.get('T')
    this.api.createticket(token, this.SelectedOrder, this.SelectedPriority, this.SelectedSubject).subscribe(
      res => {
        console.log(res)
        this.api.createticketchat(token, res['result'], "", this.ticketForm.controls['title'].value, this.ticketForm.controls['comment'].value).subscribe(
          res => {
            console.log(res)
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Token " + token);
            var formdata = new FormData();
            formdata.append("ticketNo", this.ticketID);
            formdata.append("sender", localStorage.getItem('userID')!);
            for (let i = 0; i < this.file.length; i++) {
              formdata.append("file", this.file[i], this.file[i].name);
            }
            var requestOptions = {
              method: 'POST',
              headers: myHeaders,
              body: formdata,
            };
            fetch(this.baseurl + "/support/uploadticketfile/", requestOptions)
              .then(response => response.text())
              .then(result => console.log(result))
              .catch(error => console.log('error', error));
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
  Cancel() {
    this.newTicket = false;
    this.urls = []
  }

}