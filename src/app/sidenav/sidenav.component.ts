import { CdkAccordionItem } from "@angular/cdk/accordion";
import { Component, OnInit, Input, ViewChild } from "@angular/core";
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
    this.menu = [
      { name: "داشبورد", submenu: [] },
      { name: "کاربران", submenu: [{ sub: "مشتریان" }, { sub: "تکنسین‌ها" }] },
      { name: "سفارشات", submenu: [{ sub: "ثبت سفارش" }, { sub: "گزارشات" }] },
      { name: "مدیریت انبار", submenu: [{ sub: "نعریف اولیه" }, { sub: "ورود کالا" }, { sub: "خروج کالا" },{ sub: "گزارشات" }] },
      { name: "مدیریت مالی", submenu: [{ sub: "مالی" }, { sub: "گزارشات" }, { sub: "تنظیمات" }] },
      { name: "مدیریت پشتیبانی", submenu: [{ sub: "تیکت‌ها" }, { sub: "پشتیبانی آنلاین" }, { sub: "گزارشات" }, { sub: "تنظیمات" }] },
      { name: "تنظیمات", submenu: [{ sub: "کاربران ستاد" }, { sub: "گروه های کاربری" }, { sub: "مناطق جغرافیایی" }, { sub: "مدیریت برندها" }, { sub: "مدیریت لوازم خانگی" }, { sub: "مدیریت پورسانت" }, { sub: "مدیریت اختصاص خدمت" }] },

    ]
  }
  menuclick(itemname: string) {
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
      case "مدیریت برندها":
        this.router.navigate(['/portal/Brands']);
        break;
      case "ثبت سفارش":
        this.router.navigate(['/portal/orderbystaff']);
        break;
      case "مشتریان":
        this.router.navigate(['/portal/Customers']);
        break;
      case "تکنسین‌ها":
        this.router.navigate(['/portal/Technicians']);
        break;
      case "تیکت‌ها":
        this.router.navigate(['/portal/Ticketing']);
        break;
      case "پشتیبانی آنلاین":
        this.router.navigate(['/portal/chat']);
        break;
        case  "نعریف اولیه":
          this.router.navigate(['/portal/WarehousesInfo']);
    }

  }
}
