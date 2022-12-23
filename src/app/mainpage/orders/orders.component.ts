import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { IDatepickerTheme } from 'ng-persian-datepicker';
import { CookieService } from 'ngx-cookie-service';
import { ApiServicesService } from 'src/app/api-services.service';
import { Order, Problem } from '../orderpage/Order';
import * as moment from 'jalali-moment';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  imgurl =environment.PIC_URL;
  orders: {
    id: string,
    status: string,
    app: string,
    brand: string,
    model: string,
    apppic: string,
    brandpic: string,
    regdate: string,
    date: string,
    timeRange: string,
    address: string,
    problems: Problem[],
    lcost: string,
    hcost: string,
    techpic: string,
    techfullname: string,
    techrate: string
    statusCssClass: string,
  }[] = []
  statusCssClass: string;
  fromdate: string;
  todate: string;
  selectedServiceKind: any;
  serviceKinds: { id: 1, title: "همه سفارشات" }[] = []
  customTheme: Partial<IDatepickerTheme> = {
    selectedBackground: '#4cb53f',
    selectedText: '#FFFFFF',
  };
  dateValue1 = new FormControl();
  @ViewChild("p", { static: false }) popover1: NgbPopover;
  @ViewChild("p1", { static: false }) popover2: NgbPopover;
  constructor(
    private api: ApiServicesService,
    private tokencookie: CookieService,

  ) { }

  ngOnInit() {
    var pro: Problem[] = [];

    var token = this.tokencookie.get('T')
    var problemKind: any[] = []
    this.api.getproblemkind(token).subscribe(
      ress => {
        problemKind = ress
        var userID = localStorage.getItem('personID')
        var usercat=localStorage.getItem('userCat')
        if (usercat == 'تکنسین')
        {
          this.api.getalltechorders(token, userID!).subscribe(
            res => {
              var id = 0;  
              for (let i = 0; i < res.length; i++) {
                var cp = res[i]['customerProblem']
                pro=[]
                var lowp=0;
                var highp=0
                for (let j = 0; j < cp.length; j++) {
                  console.log(cp[j])
                  var pk = cp[j][0]['problemKind_id']
                  var kind = problemKind.find(item => item.id == pk).title
                  var keys = Object.keys(cp[j][0])
                  var pclass=""
                  switch (keys[1]) {
                    case 'appliancescategory_id':
                        pclass="appliance"
                        break;
                    case 'appliancesBrands_id':
                          pclass="brand"
                          break;
                    case 'appliances_id':
                        pclass="model"
                        break;
                  }
                  lowp+=Number(cp[j][0]['lowPrice'])
                  highp+=Number(cp[j][0]['highPrice'])
                  pro.push({
                    ID: id,
                    pID: cp[j][0]['id'],
                    kind: kind,
                    title: cp[j][0]['problemTitle'],
                    checked: false,
                    description: cp[j][0]['problemDescription'],
                    lowprice: cp[j][0]['lowPrice'],
                    highprice: cp[j][0]['highPrice'],
                    type: pclass
                  })
                  id++
                }
                var app = res[i]['applianceBrand'].a_barndCategory.a_categoryName
  
                var apppic = this.imgurl+res[i]['applianceBrand'].a_barndCategory.a_categoryImage
                var techpic = ""
                var techfullname = ""
                var techrate = ""
                var regdate = res[i]['registerDateTime']
                var date = res[i]['orderDate']
                regdate = regdate.split("T", 1)
                var re = /-/gi;
                regdate = regdate.toString().replace(re, "/")
                date = date.replace(re, "/")
                date = moment(date).locale('fa').format('YYYY/M/D');
                regdate = moment(regdate).locale('fa').format('YYYY/M/D');
                // console.log(regdate)
                if (res[i]['technician'] != null) {
                  techpic = res[i]['technician']['picture']
                  techfullname = res[i]['technician']['firstName'] + " " + res[i]['technician']['lastName']
                  if (res[i]['technician']['technicianRank'] != undefined)
                    techrate = res[i]['technician']['technicianRank']
                  else
                    techrate = ""
                }
                console.log(apppic)
                this.orders.push(
                  {
                    id: res[i]['id'],
                    status: res[i]['orderStatus']['status'],
                    app: app,
                    brand: res[i]['applianceBrand']['a_brandName'],
                    model: res[i]['applianceModel'],
                    apppic: apppic,
                    brandpic:this.imgurl+ res[i]['applianceBrand']['a_brandImage'],
                    regdate: regdate,
                    date: date,
                    timeRange: res[i]['orderTimeRange']['timeRange'],
                    address: res[i]['orderAddress']['province']['provinceName'] + ", " + res[i]['orderAddress']['county']['countyName'] + ", " + res[i]['orderAddress']['city']['cityName'] + ", "
                      + res[i]['orderAddress']['region']['regionName'] + ", " + res[i]['orderAddress']['neighbourhood']['neighbourhoodName'] + ", " + res[i]['orderAddress']['addressStreet'] + ", "
                      + res[i]['orderAddress']['addressSubStreet'] + ", " + res[i]['orderAddress']['addressLane'] + ", " + res[i]['orderAddress']['addressBuilding']
                      + res[i]['orderAddress']['addressNo'] + ", " + res[i]['orderAddress']['addressUnit'] + ", " + res[i]['orderAddress']['addressFloor'],
                    problems: pro,
                    lcost:lowp.toString() ,
                    hcost:highp.toString() ,
                    techpic: techpic,
                    techfullname: techfullname,
                    techrate: techrate,
                    statusCssClass: 'status1'
                  })
                console.log(this.orders)
              }
              console.log(this.orders)
            },
            err => {
              console.log(err)
            }
          )
        }
        else{
        this.api.getalluserorders(token, userID!).subscribe(
          res => {
            var id = 0;  
            for (let i = 0; i < res.length; i++) {
              var cp = res[i]['customerProblem']
              pro=[]
              var lowp=0;
              var highp=0
              for (let j = 0; j < cp.length; j++) {
                console.log(cp[j])
                var pk = cp[j][0]['problemKind_id']
                var kind = problemKind.find(item => item.id == pk).title
                var keys = Object.keys(cp[j][0])
                var pclass=""
                switch (keys[1]) {
                  case 'appliancescategory_id':
                      pclass="appliance"
                      break;
                  case 'appliancesBrands_id':
                        pclass="brand"
                        break;
                  case 'appliances_id':
                      pclass="model"
                      break;
                }
                lowp+=Number(cp[j][0]['lowPrice'])
                highp+=Number(cp[j][0]['highPrice'])
                pro.push({
                  ID: id,
                  pID: cp[j][0]['id'],
                  kind: kind,
                  title: cp[j][0]['problemTitle'],
                  checked: false,
                  description: cp[j][0]['problemDescription'],
                  lowprice: cp[j][0]['lowPrice'],
                  highprice: cp[j][0]['highPrice'],
                  type: pclass
                })
                id++
              }
              var app = res[i]['applianceBrand'].a_barndCategory.a_categoryName

              var apppic = this.imgurl+res[i]['applianceBrand'].a_barndCategory.a_categoryImage
              var techpic = ""
              var techfullname = ""
              var techrate = ""
              var regdate = res[i]['registerDateTime']
              var date = res[i]['orderDate']
              regdate = regdate.split("T", 1)
              var re = /-/gi;
              regdate = regdate.toString().replace(re, "/")
              date = date.replace(re, "/")
              date = moment(date).locale('fa').format('YYYY/M/D');
              regdate = moment(regdate).locale('fa').format('YYYY/M/D');
              // console.log(regdate)
              if (res[i]['technician'] != null) {
                techpic = res[i]['technician']['picture']
                techfullname = res[i]['technician']['firstName'] + " " + res[i]['technician']['lastName']
                if (res[i]['technician']['technicianRank'] != undefined)
                  techrate = res[i]['technician']['technicianRank']
                else
                  techrate = ""
              }
              console.log(apppic)
              var ccsstatus=""
              switch (res[i]['orderStatus']['status']){
                case "باز":
                  ccsstatus="status1"
                  break;
                case "در انتظار قطعه":
                  ccsstatus="status2"
                  break;
                case "انجام شده":
                  ccsstatus="status3"
                  break;
                case "لغو":
                  ccsstatus="status4"
                  break;
              }
              this.orders.push(
                {
                  id: res[i]['id'],
                  status: res[i]['orderStatus']['status'],
                  app: app,
                  brand: res[i]['applianceBrand']['a_brandName'],
                  model: res[i]['applianceModel'],
                  apppic: apppic,
                  brandpic:this.imgurl+ res[i]['applianceBrand']['a_brandImage'],
                  regdate: regdate,
                  date: date,
                  timeRange: res[i]['orderTimeRange']['timeRange'],
                  address: res[i]['orderAddress']['province']['provinceName'] + ", " + res[i]['orderAddress']['county']['countyName'] + ", " + res[i]['orderAddress']['city']['cityName'] + ", "
                    + res[i]['orderAddress']['region']['regionName'] + ", " + res[i]['orderAddress']['neighbourhood']['neighbourhoodName'] + ", " + res[i]['orderAddress']['addressStreet'] + ", "
                    + res[i]['orderAddress']['addressSubStreet'] + ", " + res[i]['orderAddress']['addressLane'] + ", " + res[i]['orderAddress']['addressBuilding']
                    + res[i]['orderAddress']['addressNo'] + ", " + res[i]['orderAddress']['addressUnit'] + ", " + res[i]['orderAddress']['addressFloor'],
                  problems: pro,
                  lcost:lowp.toString() ,
                  hcost:highp.toString() ,
                  techpic: techpic,
                  techfullname: techfullname,
                  techrate: techrate,
                  statusCssClass: ccsstatus
                })
              
            }
            console.log(this.orders)
          },
          err => {
            console.log(err)
          }
        )
        }
      },
      err => {

      }
    )
  }
  selectServiceKind(event: any) {

  }
  datepickeropen: boolean = false;
  showdatepicker(pp: any) {
    if (!this.datepickeropen) {
      pp.open();
      this.datepickeropen = true;
    }
    else {
      pp.close();
      this.datepickeropen = false;
    }
  }
  showdatepicker1(pp: any) {
    if (!this.datepickeropen) {
      pp.open();
      this.datepickeropen = true;
    }
    else {
      pp.close();
      this.datepickeropen = false;
    }
  }
  showpopover: boolean = false;
  changedateto(event: any) {
    this.fromdate = event['shamsi'];
    this.showpopover = true;
    this.popover1.close();
    this.datepickeropen = false;
  }
  changedatefrom(event: any) {
    this.todate = event['shamsi'];
    this.showpopover = true;
    this.popover2.close();
    this.datepickeropen = false;
  }
  filter() { }
}
