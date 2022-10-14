import { CdkAccordionItem } from "@angular/cdk/accordion";
import { Component, OnInit, Input,ViewChild } from "@angular/core";
import { Router } from "@angular/router";


@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],

})

export class SidenavComponent {
  @ViewChild("accordionItem") accordionItem: CdkAccordionItem
  acc = document.getElementsByClassName("accordion")
  menu: { name: string, submenu?: { sub: string }[] }[]
  constructor(
    private router: Router
    ) {
    this.menu = [{ name: "داشبورد", submenu: [] },
    { name: "تنظیمات", submenu: [{ sub: "کاربران ستاد" },{ sub: "گروه های کاربری" }, { sub: "مناطق جغرافیایی" },{ sub: "مدیریت خدمات" },{ sub: "مدیریت لوازم خانگی" },{ sub: "مدیریت پورسانت" },{ sub: "مدیریت اختصاص خدمت" }] },
    { name: "ثبت نام", submenu: [{ sub: "مشتری" }, { sub: "تکنسین" }] },
    { name: "سفارشات", submenu: [{ sub: "ثبت سفارش" }, { sub: "گزارش" }] }
  ]

    
  }
  menuclick(itemname:string){
    switch (itemname) {
      case "داشبورد":
        this.router.navigate(['/portal/dashboard']);
        break;
      case "کاربران ستاد":
        this.router.navigate(['/portal/users']);
        break;
      case "گروه های کاربری":
        this.router.navigate(['/portal/usersgroup']);
        break;
      case "مناطق جغرافیایی":
          this.router.navigate(['/portal/geo']);
          break;
      case "مدیریت لوازم خانگی":
            this.router.navigate(['/portal/appliance']);
            break;

    }
    
  }
}
