import { Component, Input, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ApiServicesService } from 'src/app/api-services.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import * as moment from 'jalali-moment';
import { Problem } from '../orderpage/Order';
@Component({
  selector: 'app-orderdetails',
  templateUrl: './orderdetails.component.html',
  styleUrls: ['./orderdetails.component.css']
})
export class OrderdetailsComponent implements OnInit {
  imgurl = environment.PIC_URL;
  orderID: string;

  selectedsubtasks: Problem[] = [];
  totlalowprice: number = 0;
  totlahighprice: number = 0;
  statusCssClass: string = ""
  displayedColumns: string[] = ['name', 'lowprice', 'highprice'];
  constructor(
    private api: ApiServicesService,
    private tokencookie: CookieService,
    private _Activatedroute: ActivatedRoute
  ) { }
  order: any;
  ngOnInit() {
    this.orderID = this._Activatedroute.snapshot.paramMap.get("orderID")!
    console.log(this.orderID)
    var token = this.tokencookie.get('T')
    this.api.getorder(token, this.orderID).subscribe(
      res => {
        console.log(res)
        this.order = res[0]

        var regdate = this.order.registerDateTime
        regdate = regdate.split("T", 1)
        var re = /-/gi;
        regdate = regdate.toString().replace(re, "/")
        regdate = moment(regdate).locale('fa').format('YYYY/M/D');
        this.order.registerDateTime = regdate

        switch (this.order.orderStatus.status) {
          case "باز":
            this.statusCssClass = "status1"
            break;
          case "در انتظار قطعه":
            this.statusCssClass = "status2"
            break;
          case "انجام شده":
            this.statusCssClass = "status3"
            break;
          case "لغو":
            this.statusCssClass = "status4"
            break;
        }

        this.order.applianceBrand.a_barndCategory.a_categoryImage = this.imgurl + this.order.applianceBrand.a_barndCategory.a_categoryImage;
        this.order.applianceBrand.a_brandImage = this.imgurl + this.order.applianceBrand.a_brandImage

        var gsdate = this.order.applianceGuarantee[0].guaranteeStartDate
        gsdate = gsdate.split("T", 1)
        var re = /-/gi;
        gsdate = gsdate.toString().replace(re, "/")
        gsdate = moment(gsdate).locale('fa').format('YYYY/M/D');
        this.order.applianceGuarantee[0].guaranteeStartDate = gsdate

        var gedate = this.order.applianceGuarantee[0].guaranteeEndDate
        gedate = gedate.split("T", 1)
        var re = /-/gi;
        gedate = gedate.toString().replace(re, "/")
        gedate = moment(gedate).locale('fa').format('YYYY/M/D');
        this.order.applianceGuarantee[0].guaranteeEndDate = gedate

        var odate = this.order.orderDate
        odate = odate.split("T", 1)
        var re = /-/gi;
        odate = odate.toString().replace(re, "/")
        odate = moment(odate).locale('fa').format('YYYY/M/D');
        this.order.orderDate = odate

        for (let i = 0; i < this.order.customerProblem.length; i++) {
          var cp = this.order.customerProblem[i]
          this.selectedsubtasks.push({
            ID: i,
            pID: Number(cp.id),
            kind: (cp.problemKind_id).toString,
            title: cp.problemTitle,
            checked: false,
            description: cp.problemDescription,
            lowprice: cp.lowPrice,
            highprice: cp.highPrice,
            type: "",
          })
          if(this.isNumber(cp.lowPrice))
            this.totlalowprice=this.totlalowprice+Number(cp.lowPrice)
          if(this.isNumber(cp.highPrice))
            this.totlahighprice=this.totlahighprice+Number(cp.highPrice)
        }


      },
      err => {
        console.log(err)
      }
    )
  }
  isNumber(val: any) {
    return (
      !isNaN(Number(Number.parseFloat(String(val)))) &&
      isFinite(Number(val))
    );
  }
  
  

}
