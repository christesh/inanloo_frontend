import { CdkAccordionItem } from "@angular/cdk/accordion";
import { Component, OnInit, Input,ViewChild } from "@angular/core";


@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],

})

export class SidenavComponent {
  @ViewChild("accordionItem") accordionItem: CdkAccordionItem
  acc = document.getElementsByClassName("accordion")
  menu: { name: string, submenu?: { sub: string }[] }[]
  constructor() {
    this.menu = [{ name: "داشبورد", submenu: [] },
    { name: "سفارشات", submenu: [{ sub: "درحال اجرا" }, { sub: "اتمام" }] },
    { name: "مالی", submenu: [{ sub: "پورسانت" }, { sub: "گردش مالی" }] }
  ]

    
  }
  menuclick(itemname:string){
  
    
  }
}
