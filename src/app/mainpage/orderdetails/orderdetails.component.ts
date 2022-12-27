import { Component, Input, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ApiServicesService } from 'src/app/api-services.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import * as moment from 'jalali-moment';
import { Problem } from '../orderpage/Order';
import { faLessThanEqual } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-orderdetails',
  templateUrl: './orderdetails.component.html',
  styleUrls: ['./orderdetails.component.css']
})
export class OrderdetailsComponent implements OnInit {
  techChecklist: any[] = [];
  imgurl = environment.PIC_URL;
  orderID: string;
  custpmerproblempicurls: string[] = []
  selectedsubtasks: Problem[] = [];
  totlalowprice: number = 0;
  totlahighprice: number = 0;
  statusCssClass: string = ""
  displayedColumns: string[] = ['name', 'lowprice', 'highprice'];
  constructor(
    private api: ApiServicesService,
    private tokencookie: CookieService,
    private _Activatedroute: ActivatedRoute,
    private router: Router,
  ) { }
  broodati = []
  shooyande = []
  tamir = []
  order: any;
  modal = document.getElementById("myModal");
  img = document.getElementById("myImg");
  modalImg = document.getElementById("img01");
  captionText = document.getElementById("caption");
  validstaff: boolean = true;
  acceptG: boolean = false;
  gmsg: boolean = false;
  sKind: any = [];
  surveyTitle: string = ""
  result: any;
  customer: boolean = false;
  ngOnInit() {
    var personcCat = localStorage.getItem('userCat')
    if (personcCat == 'مشتری')
      this.customer = true;
    else
      this.customer = false
    this.validstaff = true;
    this.modal = document.getElementById("myModal");
    this.img = document.getElementById("myImg");
    this.modalImg = document.getElementById("img01");
    this.captionText = document.getElementById("caption");
    this.orderID = this._Activatedroute.snapshot.paramMap.get("orderID")!
   console.log(this.orderID)
    var token = this.tokencookie.get('T')
    this.api.getordersurvey(token, this.orderID).subscribe(
      res => {
       console.log(res)
        if (res.length == 0) {
          this.surveyTitle = "نظرسنجی"
        }
        else {
          this.surveyTitle = "مشاهده نظرسنجی"
        }
        this.result = this.surveyTitle
      }
      ,
      err => {
       console.log(err)
      }
    )
    this.api.getorder(token, this.orderID).subscribe(
      res => {
        console.log(res)
        this.order = res[0]

        if (this.order.Gaccept == null) {
          this.acceptG = false;
          this.gmsg = true;
        }
        else {
          this.acceptG = this.order.Gaccept
        }

        var regdate = this.order.registerDateTime
        regdate = regdate.split("T", 1)
        var re = /-/gi;
        regdate = regdate.toString().replace(re, "/")
        regdate = moment(regdate).locale('fa').format('YYYY/M/D');
        this.order.registerDateTime = regdate

        var date = this.order.orderDate
        date = date.split("T", 1)
        var re = /-/gi;
        date = date.toString().replace(re, "/")
        date = moment(date).locale('fa').format('YYYY/M/D');
        this.order.orderDate = date

        switch (this.order.orderStatus.status.trim()) {
          case "جدید":
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
        this.order.applianceBrand.a_brand.a_brandImage = this.imgurl + this.order.applianceBrand.a_brand.a_brandImage
        if (this.order.applianceGuarantee.length != 0) {
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

          this.order.applianceInvoice[0].invoicePic = this.imgurl + this.order.applianceInvoice[0].invoicePic
          this.order.applianceGuarantee[0].guaranteePic = this.imgurl + this.order.applianceGuarantee[0].guaranteePic
        }
        for (let i = 0; i < this.order.customerProblem.length; i++) {
          var cp = this.order.customerProblem[i]

          this.sKind.push(cp.problemKind_id)


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
          if (this.isNumber(cp.lowPrice))
            this.totlalowprice = this.totlalowprice + Number(cp.lowPrice)
          if (this.isNumber(cp.highPrice))
            this.totlahighprice = this.totlahighprice + Number(cp.highPrice)
        }

        for (let i = 0; i < this.order.customerProblemPic.length; i++) {
          this.custpmerproblempicurls.push(this.imgurl + this.order.customerProblemPic[i].problemImage)
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
  modalpic = ""
  openpopup(url: string) {
    this.modal!.style.display = "block";
    this.modalpic = url;
  }
  closemodal() {
    this.modal!.style.display = "none";
  }
  gchange: boolean = false;
  Gchange() {
    this.gchange = true;
    this.gmsg = false;
  }
  saveG() {
    var token = this.tokencookie.get('T')
    this.api.setguaranteeaccept(token, this.orderID, this.acceptG).subscribe(
      res => {
       console.log(res)
        this.gchange = false;
      },
      err => {
       console.log(err)
      }

    )
  }
  cancelG() {
    this.acceptG = this.order.Gaccept
    this.gchange = false;
  }
  ChecklistSelect(check: any) {

  }
  survey() {

    this.router.navigate(['/home/survey', { orderID: this.orderID, sKind: this.sKind }]);
  }
}
