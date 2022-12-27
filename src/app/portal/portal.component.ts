import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { NONE_TYPE } from '@angular/compiler';
import { ApiServicesService } from '../api-services.service';
import { CookieService } from 'ngx-cookie-service';
import { FormBuilder } from '@angular/forms';
import { FlexAlignStyleBuilder } from '@angular/flex-layout';
@Component({
  selector: 'app-portal',
  templateUrl: './portal.component.html',
  styleUrls: ['./portal.component.css'],
  animations: [
    trigger('widthGrow', [
      state('closed', style({
        width: 0,
      })),
      state('open', style({
        width: 350
      })),
      transition('* => *', animate(300))
    ]),
  ]
})
export class PortalComponent implements OnInit {
  @ViewChild('sidenav', { static: true }) public sidenav: any;
  menu: any;
  state = "open";
  constructor(
    private tokencookie: CookieService,
    private router: Router,
    private api: ApiServicesService,
    private _formBuilder: FormBuilder
  ) {
    this.menu = [
      { name: "داشبورد", submenu: [] },
      { name: "تنظیمات", submenu: [{ sub: "کاربران ستاد" }, { sub: "مناطق جغرافیایی" }, { sub: "مدیریت خدمات" }, { sub: "مدیریت لوازم خانگی" }, { sub: "مدیریت پورسانت" }, { sub: "مدیریت اختصاص خدمت" }] },
      { name: "ثبت نام", submenu: [{ sub: "مشتری" }, { sub: "تکنسین" }] },
      { name: "سفارشات", submenu: [{ sub: "ثبت سفارش" }, { sub: "گزارش" }] }
    ]
  }
  userpic: string;
  user: string;
  isShowing: boolean;
  userid: any;
  ngOnInit() {
    var token = this.tokencookie.get('T')
    this.api.getPersonDetails(token).subscribe(
      res => {
       console.log(res)
        this.userpic = res[0]['picture']
        this.user = res[0]['firstName'] + " " + res[0]['lastName']

      },
      err => {
       console.log(err)

      })

  }
  ngAfterViewInit() {
    this.isShowing = true;
    // this.router.navigate(['/portal/dashboard']);
  }
  closeside() {
    this.isShowing = false;
  }
  menuclick(itemname: string) {
    // alert(itemname);
    switch (itemname) {
      case "داشبورد":
        this.router.navigate(['/portal/dashboard']);
        break;
      case "کاربران ستاد":
        this.router.navigate(['/portal/users']);
        break;

    }
  }
  signout() {
    this.api.logout().subscribe(
      res => {
        this.router.navigate(['']);
      },
      err => {
       console.log(err)
      }
    )
  }
  sidenavwidth: number = 250;
  mainmargin: string = "260px";
  showtoolbaruser: boolean = false;
  checked: boolean = true;
  changeState(): void {

    if (this.state == "closed") {
      this.checked = false;
      this.state = "open";
      this.sidenavwidth = 250;
      this.mainmargin = "260px";
      this.showtoolbaruser = false;
     
    }
    else {
      this.checked = true;
      this.state = "closed";
      this.sidenavwidth = 0;
      this.mainmargin = "10px";
      this.showtoolbaruser = true;
      
    }
  }
  changeState1() {
    if (this.checked) {
      this.checked = false
    }
    else {
      this.checked = true
    }
  }

}