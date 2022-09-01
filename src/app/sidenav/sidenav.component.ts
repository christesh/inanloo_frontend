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
    this.menu = [{ name: "item1", submenu: [{ sub: "subitem1" }, { sub: "subitem2" }] },
    { name: "item2", submenu: [{ sub: "subitem1" }, { sub: "subitem2" }] },
    { name: "item3", submenu: [] }
  ]

    
  }
  menuclick(itemname:string){
  
    
  }
}
