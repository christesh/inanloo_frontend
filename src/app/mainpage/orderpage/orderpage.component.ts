import { Component, ViewChild, OnInit, assertPlatform } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/material/stepper';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ViewportScroller } from "@angular/common";
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { ScrollHelper } from './ScrollHelper';
import { MatStepper } from "@angular/material/stepper";
import { StepperSelectionEvent } from "@angular/cdk/stepper";
import { pluck } from "rxjs/operators";
import { faLessThanEqual, faListSquares } from '@fortawesome/free-solid-svg-icons';
import { MatTable } from '@angular/material/table';
import * as moment from 'jalali-moment';
import { Jalali } from 'jalali-ts';
import { IDatepickerTheme } from 'ng-persian-datepicker';
import Swal from 'sweetalert2';
import { Order, Applience, Brands, Models, Problem, TimeRange } from './Order'
import { ApiServicesService } from 'src/app/api-services.service';
import { CookieService } from 'ngx-cookie-service';
import { GlobalvarService } from 'src/app/globalvar.service';

declare var $: any;

@Component({
  selector: 'app-orderpage',
  templateUrl: './orderpage.component.html',
  styleUrls: ['./orderpage.component.scss'],

  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
})
export class OrderpageComponent {
  // timenow:{hour: number, minute: number}={hour: 12, minute: 12};
  mapEnable: boolean = false;
  maplat: number = 51.367918;
  maplong: number = 35.712706;
  maptitle = 'mapir-angular-test';
  center: { lng: number, lat: number } = { lng: 1, lat: 1 };
  apiKey: string = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImY1YjQxNGI0YjA0NWRhYjU5MDI0NjNiOTc1ZWQ5Y2JlNTIwMTg2NWJkMDc5ZTJiZTFkMTdlYTlkNjlmYjU2ODgwM2M2YTNjZDlmZDM4NjQ3In0.eyJhdWQiOiIxODg3NiIsImp0aSI6ImY1YjQxNGI0YjA0NWRhYjU5MDI0NjNiOTc1ZWQ5Y2JlNTIwMTg2NWJkMDc5ZTJiZTFkMTdlYTlkNjlmYjU2ODgwM2M2YTNjZDlmZDM4NjQ3IiwiaWF0IjoxNjU4ODUwMzk1LCJuYmYiOjE2NTg4NTAzOTUsImV4cCI6MTY2MTQ0MjM5NSwic3ViIjoiIiwic2NvcGVzIjpbImJhc2ljIl19.BBTA6uG2NU-Mk29jtZ6AapmJSfKp0k5GduBg-zyTESv1Vfoi0Mya6-E9HgiAmgsjtpK2JkNeWIAlBnw3bAo4wM1gwOvfKGR3Ngrs-QVKFQTfJ5batCu8NMcf1Kj5mL3o9xrH_YNInvgXO_D5XNk48sQ0rufjWy-AF-zsznx4bihluF5oyIU4Rwae6UaANMXpB7sLjkLB4ijw0kCaQ_Cj0fUe_KlX6Ymial4RUJ_ngk1uNdacjuJ0V2HpW-5cKuYiINKnxOD3WBZXN4bqhRrTcje6D0dwVU1y9zHjXDzeGwOUa7mayfXG2sQoO6eVkYg7X1MNELpcl-yGr3O_FfZPnQ";
  timerange: TimeRange[];
  selectedtime: string = "";
  selectedDate: string;
  showpopover: boolean = false;
  html = '<span class="btn btn-danger">Never trust not sanitized HTML!!!</span>';
  customTheme: Partial<IDatepickerTheme> = {
    selectedBackground: '#4cb53f',
    selectedText: '#FFFFFF',
  };
  calmonth: string = "";
  calday: string = "";
  showdatep: boolean = false;
  today: number;
  yesterday: number;
  dateValue = new FormControl();
  @ViewChild("stepper", { static: false }) private stepper: MatStepper;
  @ViewChild("MatTable", { static: false }) table: MatTable<any>;
  days: { day: string, date: string, time: string }[] = [];
  subtasks: Problem[] = [];
  selectedsubtasks2: Problem[] = [];
  selectedsubtasks: Problem[] = [];
  private scrollHelper: ScrollHelper = new ScrollHelper();
  showcomment: boolean = false;
  applienceClass: string;
  gridColumns = 3;
  title: string = "";
  brandtitle: string = "";
  progress: number;
  totlalowprice: number = 0;
  totlahighprice: number = 0;
  displayedColumns: string[] = ['name', 'lowprice', 'highprice'];
  firststeperror: boolean = false;
  secondsteperror: boolean = false;
  thirdsteperror: boolean = false;
  fourthteperror: boolean = false;
  firstcomplete: boolean = false;
  secondcomplete: boolean = false;
  thirdcomplete: boolean = false;
  fourthcomplete: boolean = false;
  brands?: Brands[] = []
  models?: Models[] = []
  showmodels: boolean = false;
  showbrands: boolean = false;
  firstFormGroupError: string = "";
  firstFormGroup: FormGroup;
  searchvalue: string = "";
  secondFormGroupError: string = "";
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  thirdFormGroupError: string = "";
  thirdFormGroup = this._formBuilder.group({
    thirdCtrl: ['', Validators.required],

  });
  // devicesreial: string="";
  // selectedmodel:string="";
  fourthFormGroupError: string = "";
  fourthFormGroup = this._formBuilder.group({
    fourthCtrl: ['', Validators.required],
    radioCtrl: ['', Validators.required],
  });

  hasmodel: boolean = false;
  stepperOrientation: Observable<StepperOrientation>;
  applience: Applience[] = []
  constructor(
    private globalVar:GlobalvarService,
    private scroller: ViewportScroller,
    private _formBuilder: FormBuilder,
    breakpointObserver: BreakpointObserver,
    private api: ApiServicesService,
    private tokencookie: CookieService
  ) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));

  }
  order = new Order();
  public picurl: string = "";
  ngOnInit() {
    this.picurl = "http://"
    this.firstFormGroup = this._formBuilder.group({
      selectedmodel: [null],
    });
    this.firstFormGroupError = "فرآیند انتخاب خدمت ناقص است!";
    this.secondFormGroupError = "فرآیند انتخاب مشکل ناقص است!";
    this.thirdFormGroupError = "فرآیند انتخاب تاریخ، زمان و آدرس ناقص است!";
    this.fourthFormGroupError = "فرآیند نهایی ثبت سفارش ناقص است!";
    var token = this.tokencookie.get('T');
    this.api.getAllApplience(token).subscribe(
      res => {
        this.applience = res
        console.log(this.applience)
      },
      err => {
        console.log(err)
      }
    )
    var userId=localStorage.getItem('userID')
    this.api.getCustomersDetails(token,userId!).subscribe(
      res=>{
        console.log(res)
      },
      err=>
      {
        console.log(err)
      }
    )
    // this.applience.push({ ID: 1, title: "ساید بای ساید", pic: "../../../assets/images/devices/refrigerator-1.png", desc: "", brands: [{ ID: 1, brand: "Bosch", brandpic: "../../../assets/images/brands/bosch.png", models: [{ ID: 1, model: "1", description: "" }, { ID: 2, model: "2", description: "" }, { ID: 3, model: "3", description: "" }] }, { ID: 4, brand: "AEG", brandpic: "../../../assets/images/brands/aeg.png", models: [{ ID: 1, model: "1", description: "" }, { ID: 2, model: "2", description: "" }, { ID: 3, model: "3", description: "" }] }, { ID: 5, brand: "Samsung", brandpic: "../../../assets/images/brands/samsung.png", models: [{ ID: 1, model: "1", description: "" }, { ID: 2, model: "2", description: "" }, { ID: 3, model: "3", description: "" }] }] });
    // this.applience.push({ ID: 2, title: "لباس شویی", pic: "../../../assets/images/devices/01.png", desc: "", brands: [{ ID: 1, brand: "Bosch", brandpic: "../../../assets/images/brands/bosch.png", models: [{ ID: 1, model: "1", description: "" }, { ID: 2, model: "2", description: "" }, { ID: 3, model: "3", description: "" }] }, { ID: 4, brand: "AEG", brandpic: "../../../assets/images/brands/aeg.png", models: [{ ID: 1, model: "1", description: "" }, { ID: 2, model: "2", description: "" }, { ID: 3, model: "3", description: "" }] }, { ID: 7, brand: "پارس خزر", brandpic: "../../../assets/images/brands/pars.png", models: [{ ID: 1, model: "1", description: "" }, { ID: 2, model: "2", description: "" }, { ID: 3, model: "3", description: "" }] }] });
    // this.applience.push({ ID: 3, title: "جارو برقی", pic: "../../../assets/images/devices/washing-machine-2.png", desc: "", brands: [{ ID: 1, brand: "Bosch", brandpic: "../../../assets/images/brands/bosch.png", models: [{ ID: 1, model: "1", description: "" }, { ID: 2, model: "2", description: "" }, { ID: 3, model: "3", description: "" }] }, { ID: 5, brand: "Samsung", brandpic: "../../../assets/images/brands/samsung.png", models: [{ ID: 1, model: "1", description: "" }, { ID: 2, model: "2", description: "" }, { ID: 3, model: "3", description: "" }] }] });
    // this.applience.push({ ID: 4, title: "ظرفشویی", pic: "../../../assets/images/devices/dish-washer.png", desc: "", brands: [{ ID: 1, brand: "Bosch", brandpic: "../../../assets/images/brands/bosch.png", models: [{ ID: 1, model: "1", description: "" }, { ID: 2, model: "2", description: "" }, { ID: 3, model: "3", description: "" }] }, { ID: 4, brand: "AEG", brandpic: "../../../assets/images/brands/aeg.png", models: [{ ID: 1, model: "1", description: "" }, { ID: 2, model: "2", description: "" }, { ID: 3, model: "3", description: "" }] }, { ID: 5, brand: "Samsung", brandpic: "../../../assets/images/brands/samsung.png", models: [{ ID: 1, model: "1", description: "" }, { ID: 2, model: "2", description: "" }, { ID: 3, model: "3", description: "" }] }] });
    // this.applience.push({ ID: 5, title: "یخچال", pic: "../../../assets/images/devices/washing-machine-1.png", desc: "", brands: [{ ID: 2, brand: "هایر", brandpic: "../../../assets/images/brands/haier.png", models: [{ ID: 1, model: "1", description: "" }, { ID: 2, model: "2", description: "" }, { ID: 3, model: "3", description: "" }] }, { ID: 4, brand: "AEG", brandpic: "../../../assets/images/brands/aeg.png", models: [{ ID: 1, model: "1", description: "" }, { ID: 2, model: "2", description: "" }, { ID: 3, model: "3", description: "" }] }, { ID: 5, brand: "Samsung", brandpic: "../../../assets/images/brands/samsung.png", models: [{ ID: 1, model: "1", description: "" }, { ID: 2, model: "2", description: "" }, { ID: 3, model: "3", description: "" }] }] });
    // this.applience.push({ ID: 6, title: "ماکروویر", pic: "../../../assets/images/devices/washing-machine-10.png", desc: "", brands: [{ ID: 3, brand: "miele", brandpic: "../../../assets/images/brands/miele.png", models: [{ ID: 1, model: "1", description: "" }, { ID: 2, model: "2", description: "" }, { ID: 3, model: "3", description: "" }] }, { ID: 4, brand: "AEG", brandpic: "../../../assets/images/brands/aeg.png", models: [{ ID: 1, model: "1", description: "" }, { ID: 2, model: "2", description: "" }, { ID: 3, model: "3", description: "" }] }, { ID: 5, brand: "Samsung", brandpic: "../../../assets/images/brands/samsung.png", models: [{ ID: 1, model: "1", description: "" }, { ID: 2, model: "2", description: "" }, { ID: 3, model: "3", description: "" }] }] });
    // this.applience.push({ ID: 7, title: "کولر گازی", pic: "../../../assets/images/devices/fan-2.png", desc: "", brands: [{ ID: 1, brand: "Bosch", brandpic: "../../../assets/images/brands/bosch.png", models: [{ ID: 1, model: "1", description: "" }, { ID: 2, model: "2", description: "" }, { ID: 3, model: "3", description: "" }] }, { ID: 4, brand: "AEG", brandpic: "../../../assets/images/brands/aeg.png", models: [{ ID: 1, model: "1", description: "" }, { ID: 2, model: "2", description: "" }, { ID: 3, model: "3", description: "" }] }, { ID: 5, brand: "Samsung", brandpic: "../../../assets/images/brands/samsung.png", models: [{ ID: 1, model: "1", description: "" }, { ID: 2, model: "2", description: "" }, { ID: 3, model: "3", description: "" }] }] });
    // this.applience.push({ ID: 8, title: "تصفیه آب", pic: "../../../assets/images/devices/icon01-2.png", desc: "", brands: [{ ID: 1, brand: "Bosch", brandpic: "../../../assets/images/brands/bosch.png", models: [{ ID: 1, model: "1", description: "" }, { ID: 2, model: "2", description: "" }, { ID: 3, model: "3", description: "" }] }, { ID: 6, brand: "LG", brandpic: "../../../assets/images/brands/lg.png", models: [{ ID: 1, model: "1", description: "" }, { ID: 2, model: "2", description: "" }, { ID: 3, model: "3", description: "" }] }, { ID: 5, brand: "Samsung", brandpic: "../../../assets/images/brands/samsung.png", models: [{ ID: 1, model: "1", description: "" }, { ID: 2, model: "2", description: "" }, { ID: 3, model: "3", description: "" }] }] });
    // this.applience = this.applience.slice(0);
    // this.subtasks = [
    //   { ID: 1, title: 'نصب اولیه گارانتی', description: '', checked: false, lowprice: '1000000', highprice: '2000000' },
    //   { ID: 2, title: 'نصب مجدد و آموزش', description: '', checked: false, lowprice: '2000000', highprice: '3000000' },
    //   { ID: 3, title: 'تایمر شستشو خراب', description: '', checked: false, lowprice: '1500000', highprice: '2500000' },
    //   { ID: 4, title: 'وان شستشو شکسته', description: '', checked: false, lowprice: '100000', highprice: '200000' },
    //   { ID: 5, title: 'آب را تخلیه نمیکند', description: '', checked: false, lowprice: '1800000', highprice: '2800000' },
    //   { ID: 6, title: 'روشن نمیشود', checked: false, description: '', lowprice: '1100000', highprice: '1200000' },
    //   { ID: 7, title: 'سایر', checked: false, description: '', lowprice: 'نامشخص', highprice: 'نامشخص' },
    // ]
    this.yesterday = Jalali.parse(Jalali.now().add(-1, 'day').toString()).valueOf()
    this.initdateforcal(Jalali.now().toString().substring(0, 10))
    this.hasguarantee = false;
    // this.center.lng = 51.367918;
    // this.center.lat = 35.712706;  
    this.dateValue = new FormControl(new Date().valueOf());
    console.log(this.dateValue.value)

    this.timerange = [{ ID: 1, title: "بین 9 تا 12" }, { ID: 2, title: "بین 12 تا 15" }, { ID: 3, title: "بین 15 تا 18" }, { ID: 3, title: "بین 18 تا 21" }];
  }
  ngAfterViewChecked() {
    this.scrollHelper.doScroll();
    //// baraye inke befhamim to kodoom step rafte va vaghti raft haserror true beshe ////
    this.stepper.selectionChange
      .pipe(pluck("selectedIndex"))
      .subscribe((res: number) => {
        switch (res) {
          case 0: {

            // this.firststeperror = true;
            break;
          }
          case 1: {
            // this.secondsteperror = true;
            break;
          }
          case 2: {
            // this.thirdsteperror = true;
            break;
          }
          case 3: {
            // this.fourthteperror = true;
            break;
          }
        }
      });
  }
  private formSubmitAttempt!: boolean;
  isFieldInvalid(field: string) { // {6}
    return (
      (!this.firstFormGroup.get(field)?.valid && this.firstFormGroup.get(field)?.touched) ||
      (this.firstFormGroup.get(field)?.untouched && this.formSubmitAttempt)
    );
  }
  applienceID: number;
  brandID: number;
  modelID: number;
  hasguarantee?: boolean;
  selectapplience(i: any) {
    this.title = i;
    this.showbrands = true;
    this.applienceID = this.applience.find(item => item.title == i)!.ID
    this.brands = this.applience.find(item => item.title == i)?.brands
    this.scrollHelper.scrollToFirst("selectbrand");
  }

  selectbrand(i: any) {
    this.scrollHelper.scrollToFirst("selectmodelsdiv");
    this.brandtitle = i;
    this.showmodels = true;
    this.firststeperror = false;
    this.firstcomplete = true;
    this.hasmodel = true;
    this.brandID = this.brands!.find(item => item.brand == i)!.ID
    this.models = this.brands?.find(item => item.brand == i)?.models

  }

  selectmodel() {
    console.log(this.firstFormGroup.value.selectedmodel)
  }
  modelserial: string = "";
  serialchange(event: any) {
    this.modelserial = event.target.value
  }
  problemSelect(name: string) {
    let ch = this.subtasks.find(item => item.title == name)?.checked
    if (ch == true) {
      if (name == "سایر") {
        this.showcomment = true;
      }
      var ss = this.subtasks.find(item => item.title == name)
      this.selectedsubtasks.push(ss!)
      if (this.isNumber(ss?.highprice!)) {
        this.totlahighprice += Number(ss?.highprice!);
        this.totlalowprice += Number(ss?.lowprice!);
      }
    }
    else {
      if (name == "سایر") {
        this.showcomment = false;
      }
      var ss = this.selectedsubtasks.find(item => item.title == name)
      var indx = this.selectedsubtasks.indexOf(ss!)
      this.selectedsubtasks.splice(indx, 1)
      if (this.isNumber(ss?.highprice!)) {
        this.totlahighprice -= Number(ss?.highprice!);
        this.totlalowprice -= Number(ss?.lowprice!);
      }
    }
    if (this.selectedsubtasks.length != 0) {
      this.secondsteperror = false;
      this.secondcomplete = true;
    }
    this.table.renderRows();
  }
  hasGuarantee() {
    this.hasguarantee = !this.hasguarantee;

  }

  firststepnext() {
    var token = this.tokencookie.get('T')
    var app = "";
    var brand = "";
    var model = "";
    if (this.applienceID != null) {
      this.order.applienceID = this.applienceID!;
      app = this.applienceID!.toString();
    }
    if (this.brandID != null) {
      this.order.brandID = this.brandID!;
      brand=this.brandID!.toString();
    }
    if (this.firstFormGroup.value.selectedmodel != null){
      this.order.modelID = this.firstFormGroup.value.selectedmodel;
      model=this.firstFormGroup.value.selectedmodel['ID'].toString()
    }
    
    this.subtasks = []
    this.order.deviceSerial = this.modelserial;
    this.order.hasGuarantee = this.hasguarantee!;
    this.api.getProblems(token, app, brand, model).subscribe(
      res => {
        for (let i = 0; i < res.length; i++) {
          this.subtasks.push({ ID: i, title: res[i]['problemTitle'], description: res[i]['problemDescription'], checked: false, lowprice: res[i]['lowPrice'], highprice: res[i]['highPrice'] })
        }
        this.subtasks.push({ ID: res.length, title: 'سایر', checked: false, description: '', lowprice: 'نامشخص', highprice: 'نامشخص' });
        console.log(this.subtasks)
      }
      ,
      err => {
        console.log(err)
      }
    )
  }
  secondstepnext() {
    this.problem();
    this.order.problem = this.selectedsubtasks
    this.order.problemPics = this.urls;

  }
  thirdstepnext() {
    console.log(this.selectedtime)
    var timerangeid = this.selectedtime;
    if (this.selectedtime == "") {
      this.thirdsteperror = true
    }
    else {
      this.thirdsteperror = false
    }
    this.order.orderDate = this.selectedDate
    this.order.timeRange = Number(timerangeid!);
    console.log(this.order)
  }
  onSelectFile(event: any) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();
        this.image[i] = event.target.files[i]
        reader.onload = (event: any) => {
          this.urls.push(event.target.result);
        }
        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }
  image: File[] = [];
  urls: any = [];
  deleteimg(url: any) {
    if (url != null) {
      const index: number = this.urls.indexOf(url);
      if (index !== -1) {
        this.urls.splice(index, 1);
      }
    }
  }
  filterTerm!: string;
  searchChange(event: any) {
    this.brands = this.applience.find(item => item.title == this.title)?.brands;
    var b = [];
    if (event.target.value != "") {
      for (let i = 0; i < this.brands?.length!; i++) {
        var brandname = this.brands![i].brand.toLowerCase()
        var searchv = event.target.value.toLowerCase()
        if (brandname.includes(searchv)) {
          b.push(this.brands![i])
        }
      }
      this.brands = b;
    }
    else {
      this.brands = this.applience.find(item => item.title == this.title)?.brands;
    }
  }
  isNumber(val: any) {
    return (
      !isNaN(Number(Number.parseFloat(String(val)))) &&
      isFinite(Number(val))
    );

  }
  showdatepicker() {
    if (!this.showdatep) {
      this.showdatep = true;
      this.showpopover = true;
    }
    else {
      this.showdatep = false;
      this.showpopover = false;
    }
  }
  changedate(event: any) {
    this.initdateforcal(event['shamsi'])
    if (!this.showdatep) {
      this.showdatep = true;
      this.showpopover = true;
    }
    else {
      this.showdatep = false;
      this.showpopover = false;

    }
  }
  problem() {
    if (this.selectedsubtasks.length == 0) {
      this.secondsteperror = true;
    }
    else {
      this.secondsteperror = false;
    }
    this.selectedsubtasks2 = this.selectedsubtasks
    console.log(this.selectedsubtasks2)
  }

  initdateforcal(date: string) {
    this.selectedDate = date;
    var month = date.substring(5, 7)
    this.calday = date.substring(8, 10)
    switch (month) {
      case "01":
        this.calmonth = "فروردین";
        break;
      case "02":
        this.calmonth = "اردیبهشت";
        break;
      case "03":
        this.calmonth = "خرداد";
        break;
      case "04":
        this.calmonth = "تیر";
        break;
      case "05":
        this.calmonth = "مرداد";
        break;
      case "06":
        this.calmonth = "شهریور";
        break;
      case "07":
        this.calmonth = "مهر";
        break;
      case "08":
        this.calmonth = "آبان";
        break;
      case "09":
        this.calmonth = "آذر";
        break;
      case "10":
        this.calmonth = "دی";
        break;
      case "11":
        this.calmonth = "بهمن";
        break;
      case "12":
        this.calmonth = "اسفند";
        break;

    }
  }
  registerOrder() {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: 'ثبت سفارش',
      text: ".سفارش شما با موفقیت ثبت شد",
      icon: 'success',
      confirmButtonText: '!متوجه شدم',
      reverseButtons: true
    })

  }

}