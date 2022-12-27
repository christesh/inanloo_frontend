import { Component, ViewChild, OnInit, assertPlatform, Output, EventEmitter, Input, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/material/stepper';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
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
import { Address } from '../profiles/profile';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { stringToKeyValue } from '@angular/flex-layout/extended/style/style-transforms';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ThemeService } from 'ng2-charts';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

declare var $: any;
export interface DialogData {
  addressdata: {
    id: number,
    mainstreet: string,
    substreet: string,
    lane: string,
    building: string,
    no: string,
    unit: string,
    floor: string,
    provincename: string,
    provinceid: string,
    countyname: string,
    countyid: string,
    cityname: string,
    cityid: string,
    regionname: string,
    regionid: string,
    neighbourname: string,
    neighbourid: string,
    ismain: boolean,
    lat: number,
    lng: number,
  }
}
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
  @Output() newOrderEvent = new EventEmitter<Order>();
  @Input() showBanner: boolean;
  baseurl = environment.API_URL;
  // baseurl = "http://localhost:8000";
  // baseurl = "http://api-is.mersa-group.ir";
  imgurl = "http://mersa-group.ir";
  // timenow:{hour: number, minute: number}={hour: 12, minute: 12};
  ruleChecked:boolean= false;
  showbanner: boolean = true;
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
  problemskind: { ID: string, title: string, problem: Problem[] }[] = []
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
  allsubtasks: Problem[] = [];
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
  curentCustomer: any;
  address: Address[];
  addresses: { id: number, text: string, isMainAddress: boolean, maplong: number, maplat: number }[] = []
  showmodels: boolean = false;
  showbrands: boolean = false;
  firstFormGroupError: string = "";
  summery: {
    appcat: string,
    appcatpic: string,
    brand: string,
    brandpic: string,
    model?: string,
    serial?: string,
    hasG: boolean,
    GstartDate?: string,
    GendDate?: string,
    orderDate: string,
    Gpic?: string,
    Invpic: string,
    ordeTime: string,
    orderAdd: string,
    maplat: number,
    maplong: number,
    problimpics: string[],
  } = {
      appcat: "",
      appcatpic: "",
      brand: "",
      brandpic: "",
      model: "",
      serial: "",
      hasG: false,
      GstartDate: "",
      GendDate: "",
      orderDate: "",
      Gpic: "",
      Invpic: "",
      ordeTime: "",
      orderAdd: "",
      maplat: 0,
      maplong: 0,
      problimpics: [],
    }
  showsummery: boolean = false;
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
  problemsearchvalue: any;
  hasmodel: boolean = false;
  stepperOrientation: Observable<StepperOrientation>;
  applience: Applience[] = []
  userid: any;
  constructor(
    private router: Router,
    private http: HttpClient,
    private ng2ImgMax: Ng2ImgMaxService,
    private globalVar: GlobalvarService,
    private scroller: ViewportScroller,
    private _formBuilder: FormBuilder,
    breakpointObserver: BreakpointObserver,
    private api: ApiServicesService,
    private tokencookie: CookieService,
    public editAdd: MatDialog,
    private _snackBar: MatSnackBar,
  ) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));


  }
  order: any;
  public picurl: string = "";
  guaranteeDateForm = new FormGroup({
    startdate: new FormControl('',Validators.required),
    enddate: new FormControl('',Validators.required)
  })
  fromdate: string;
  todate: string;
  dateValue1 = new FormControl();
  firstFormGroup = new FormGroup({
    selectedmodel: new FormControl(''),
    modelserial: new FormControl(''),
    gfile: new FormControl(''),
    ifile: new FormControl(''),
  });
  @ViewChild("psd", { static: false }) popover1: NgbPopover;
  @ViewChild("ped", { static: false }) popover2: NgbPopover;
  datepickeropen: boolean = false;
  showdatepickergsdate(pp: any) {
    if (!this.datepickeropen) {
      pp.open();
      this.datepickeropen = true;
    }
    else {
      pp.close();
      this.datepickeropen = false;
    }
  }
  showdatepickergedate(pp: any) {
    if (!this.datepickeropen) {
      pp.open();
      this.datepickeropen = true;
    }
    else {
      pp.close();
      this.datepickeropen = false;
    }
  }
  showpopovergd: boolean = false;
  changedateto(event: any) {
    this.fromdate = event['shamsi'];
    this.showpopovergd = true;
    this.popover1.close();
    this.datepickeropen = false;
  }
  changedatefrom(event: any) {
    this.todate = event['shamsi'];
    this.showpopovergd = true;
    this.popover2.close();
    this.datepickeropen = false;
  }
  ngOnInit() {
    this.userid = localStorage.getItem('personID');
    // this.problemskind.push({ID:"1",title:"نصب"})
    // this.problemskind.push({ID:"2",title:"تعمیر"})
    // this.problemskind.push({ID:"3",title:"بازدید دوره‌ای"})
    if (!this.showBanner)
      this.showbanner = false;
    this.order = new Order();
    this.order.orderConfirm = false;
    this.firstFormGroup.controls.modelserial.setValue("");
    this.firstFormGroup.controls.modelserial.markAsDirty();
    this.firstFormGroupError = "فرآیند انتخاب خدمت ناقص است!";
    this.secondFormGroupError = "فرآیند انتخاب مشکل ناقص است!";
    this.thirdFormGroupError = "فرآیند انتخاب تاریخ، زمان و آدرس ناقص است!";
    this.fourthFormGroupError = "فرآیند نهایی ثبت سفارش ناقص است!";
    var token = this.tokencookie.get('T');
    this.api.getAllApplience(token).subscribe(
      res => {
        this.applience = res
       console.log(this.applience)
        for (let i = 0; i < this.applience.length; i++) {
          this.applience[i].pic = this.imgurl + this.applience[i].pic;
          for (let j = 0; j < this.applience[i].brands.length; j++) {
            this.applience[i].brands[j].brandpic = this.imgurl + this.applience[i].brands[j].brandpic;
          }
        }
      },
      err => {
       console.log(err)
      }
    )
    var userId = localStorage.getItem('personID')
    this.api.getCustomersDetails(token, userId!).subscribe(
      res => {
       console.log(res)
        this.curentCustomer = res[0];
        this.address = this.curentCustomer.address;
        for (let i = 0; i < this.address.length; i++) {
          var addtext = ""
          if (this.address[i].province.provinceName != "")
            addtext += "استان: " + this.address[i].province.provinceName;

          if (this.address[i].county.countyName != "")
            addtext += ", شهرستان: " + this.address[i].county.countyName;

          if (this.address[i].city.cityName != "")
            addtext += ", شهر: " + this.address[i].city.cityName;

          if (this.address[i].region.regionName != "")
            addtext += ", " + this.address[i].region.regionName;

          if (this.address[i].neighbourhood.neighbourhoodName != "")
            addtext += ", " + this.address[i].neighbourhood.neighbourhoodName;

          if (this.address[i].addressStreet != "")
            addtext += ", " + this.address[i].addressStreet;

          if (this.address[i].addressSubStreet != "")
            addtext += ", " + this.address[i].addressSubStreet;

          if (this.address[i].addressLane != "")
            addtext += ", " + this.address[i].addressLane;

          if (this.address[i].addressNo != "")
            addtext += ", پلاک: " + this.address[i].addressNo;

          if (this.address[i].addressUnit != "")
            addtext += ", واحد: " + this.address[i].addressUnit;

          if (this.address[i].addressFloor != "")
            addtext += ", طبقه: " + this.address[i].addressFloor;
          this.addresses.push({ id: this.address[i].id, text: addtext, maplat: Number(this.address[i].addressLat), maplong: Number(this.address[i].addressLong), isMainAddress: Boolean(this.address[i].isMain) })
        }
      },
      err => {
       console.log(err)
      }
    )

    this.yesterday = Jalali.parse(Jalali.now().add(-1, 'day').toString()).valueOf()
    this.initdateforcal(Jalali.now().toString().substring(0, 10))
    this.hasguarantee = false;
    // this.center.lng = 51.367918;
    // this.center.lat = 35.712706;  
    this.dateValue = new FormControl(new Date().valueOf());
   console.log(this.dateValue.value)
    this.timerange = [{ ID: 1, title: "بین 9 تا 12" }, { ID: 2, title: "بین 12 تا 15" }, { ID: 3, title: "بین 15 تا 18" }, { ID: 3, title: "بین 18 تا 21" }];
  }
  shownewaddress: boolean = false;
  createaddress() {
    this.shownewaddress = true;
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
  modelselected:any;
  selectapplience(i: any) {
    this.title = i;
    this.showbrands = true;
    this.applienceID = this.applience.find(item => item.title == i)!.ID
    this.summery.appcat = this.applience.find(item => item.title == i)!.title
    this.summery.appcatpic = this.applience.find(item => item.title == i)!.pic
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
    this.summery.brand = this.brands!.find(item => item.brand == i)!.brand
    this.summery.brandpic = this.brands!.find(item => item.brand == i)!.brandpic
    this.models = this.brands?.find(item => item.brand == i)?.models

  }

  selectmodel(model:any) {
    //console.log(this.firstFormGroup.controls.selectedmodel.value)
   console.log(model)
  }
  modelserial: string = "";
  serialchange(event: any) {
    // this.modelserial = event.target.value
  }
  problemSelect(name: string, sid: any, pid: any) {

    var pki = this.problemskind.findIndex(item => item.ID == pid)
    var si = this.problemskind[pki].problem.findIndex(item => item.ID == sid)
    let ch = this.problemskind[pki].problem[si].checked

    if (ch == true) {
      if (name == "سایر") {
        this.showcomment = true;
      }
     console.log(this.subtasks[sid].type)
      this.selectedsubtasks.push(this.subtasks[sid])
      if (this.isNumber(this.subtasks[sid].highprice!)) {
        this.totlahighprice += Number(this.subtasks[sid].highprice!);
        this.totlalowprice += Number(this.subtasks[sid].lowprice!);
      }
    }
    else {
      if (name == "سایر") {
        this.showcomment = false;
      }
      var indx = this.selectedsubtasks.indexOf(this.subtasks[sid])
      this.selectedsubtasks.splice(indx, 1)
      if (this.isNumber(this.subtasks[sid].highprice!)) {
        this.totlahighprice -= Number(this.subtasks[sid].highprice!);
        this.totlalowprice -= Number(this.subtasks[sid].lowprice!);
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
    if (this.hasguarantee) {
      this.firstFormGroup.controls.modelserial.addValidators(Validators.required);
      this.firstFormGroup.controls.selectedmodel.addValidators(Validators.required);
      this.firstFormGroup.controls.gfile.addValidators(Validators.required);
      this.firstFormGroup.controls.ifile.addValidators(Validators.required);
    }
    else {
      this.firstFormGroup.controls.modelserial.clearValidators();
      this.firstFormGroup.controls.selectedmodel.clearValidators();
      this.firstFormGroup.controls.gfile.clearValidators();
      this.firstFormGroup.controls.ifile.clearValidators();
    }
  }
  openSnackBar(message: string, action: string, alertkind: string, showtime: number, hp?: MatSnackBarHorizontalPosition, vp?: MatSnackBarVerticalPosition) {
    this._snackBar.open(message, action, {
      duration: showtime * 1000,
      panelClass: [alertkind],
      horizontalPosition: hp,
      verticalPosition: vp

    });
  }
  firststepnext() {
    if (this.hasguarantee) {
      if (this.firstFormGroup.controls.gfile.value == '') {
        this.openSnackBar(' بارگذاری تصویر کارت گارانتی الزامیست!', '', 'red-snackbar', 5)
      }
      if (this.firstFormGroup.controls.ifile.value == '') {
        this.openSnackBar(' بارگذاری تصویر فاکتور خرید الزامیست!', '', 'red-snackbar', 5)
      }
 
    }
    var token = this.tokencookie.get('T')
    var app = "";
    var brand = "";
    var model = "";
    var modelobj: any;
    this.order.customerID = Number(localStorage.getItem('personID'))
    this.order.registerID = Number(localStorage.getItem('staffID'))
    if (this.applienceID != null) {
      this.order.applienceID = this.applienceID!;
      app = this.applienceID!.toString();
    }
    if (this.brandID != null) {
      this.order.brandID = this.brandID!;
      brand = this.brandID!.toString();
    }
    if (this.firstFormGroup.controls.selectedmodel.value != null) {
      var mid = this.firstFormGroup.controls.selectedmodel.value;
      this.order.modelID = mid
      this.summery.model = this.models?.find(item => item.ID.toString() == mid!)?.model
      if (this.summery.model == undefined)
        this.summery.model = ""

      modelobj = this.firstFormGroup.controls.selectedmodel.value;
      model = modelobj.ID;
    }
    else {
      this.order.modelID = null;
    }
    this.modelserial=this.firstFormGroup.controls.modelserial.value!;
    this.subtasks = []
    this.allsubtasks = []
    this.order.modelSerial = this.modelserial;
    this.summery.serial = this.modelserial;
    this.order.hasGuarantee = this.hasguarantee!;
    this.summery.hasG = this.hasguarantee!;
    if (this.hasguarantee) {
      this.order.guaranteePic = this.gimage[0];
      this.order.invoicePic = this.iimage[0];
      this.order.guaranteeStartDate=this.fromdate;
      this.order.guaranteeEndDate=this.todate;
      this.summery.Gpic = this.gurls[0];
      this.summery.Invpic = this.iurls[0];
      this.summery.GstartDate = this.fromdate;
      this.summery.GendDate = this.todate;
    }
    else {
      this.order.guaranteePic = [];
      this.order.invoicePic = []
      this.order.guaranteeStartDate = "";
      this.order.guaranteeEndDate = "";
      this.summery.Gpic = "";
      this.summery.Invpic = "";
      this.summery.GstartDate = "";
      this.summery.GendDate = "";

    }
    this.api.getProblems(token, app, brand, model).subscribe(
      res => {
       console.log(res)
        for (let i = 0; i < res.length; i++) {
         console.log(res[i]['pkind'])
          var pkindex = this.problemskind.findIndex(item => item.title == res[i]['problemKind__title'])
          this.subtasks.push({ ID: i, pID: res[i]['id'], kind: res[i]['problemKind_id'], title: res[i]['problemTitle'], description: res[i]['problemDescription'], checked: false, lowprice: res[i]['lowPrice'], highprice: res[i]['highPrice'], type: res[i]['pkind'] })
          if (pkindex != -1) {
            this.problemskind[pkindex].problem.push(this.subtasks[this.subtasks.length - 1])
          }
          if (pkindex == -1) {
            var p = { ID: i, pID: res[i]['id'], kind: res[i]['problemKind_id'], title: res[i]['problemTitle'], description: res[i]['problemDescription'], checked: false, lowprice: res[i]['lowPrice'], highprice: res[i]['highPrice'], type: res[i]['pkind'] }
            this.problemskind.push({ ID: this.problemskind.length.toString(), title: res[i]['problemKind__title'], problem: [p] })
          }

        }
        
        this.subtasks.push({ ID: res.length, pID: -1, kind: 'other', title: 'سایر', checked: false, description: '', lowprice: 'نامشخص', highprice: 'نامشخص', type: 'نامشخص' });
        //console.log(this.subtasks)
        this.allsubtasks = this.subtasks
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
    this.order.problemPics = this.image;
  }
  seletAddress(add: any) {
    if (add.isMainAddress) {
     console.log(add)
      for (let i = 0; i < this.addresses.length; i++) {
        add.isMainAddress = true;
        if (this.addresses[i].id !== add.id)
          this.addresses[i].isMainAddress = false;
      }
    }
  }
  thirdstepnext() {
   console.log(this.selectedtime)
    this.showsummery = true;
    var timerangeid = this.selectedtime;
    if (this.selectedtime == "") {
      this.thirdsteperror = true
    }
    else {
      this.thirdsteperror = false
      this.thirdcomplete = true;
    }
    if (this.selectedDate == "") {
      this.thirdsteperror = true
    }
    else {
      this.thirdsteperror = false
      this.thirdcomplete = true;
    }
    this.order.orderDate = this.selectedDate
    this.summery.orderDate = this.selectedDate
    this.order.timeRange = Number(timerangeid!);
    var tr = this.timerange.find(item => item.ID == Number(timerangeid!))?.title
    if (tr != undefined)
      this.summery.ordeTime = tr
    for (let i = 0; i < this.addresses.length; i++) {
      if (this.addresses[i].isMainAddress) {
        this.order.orderAddressID = this.addresses[i].id;
        this.summery.orderAdd = this.addresses[i].text;

        this.summery.maplat = this.addresses[i].maplat;
        this.summery.maplong = this.addresses[i].maplong;
        break;
      }
    }
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
  gimage: File[] = [];
  iimage: File[] = [];
  urls: any = [];
  gurls: any = [];
  iurls: any = [];
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
        var brandname = this.brands![i].description.toLowerCase()
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
    this.newOrderEvent.emit(this.order);
    var token = this.tokencookie.get('T');
    this.order.orderConfirm = true;
   console.log(this.order)
    this.api.createorder(token, this.order).subscribe(
      res => {

       console.log(res)
        var orderids = res['result'].split(":", 2)
        var orderid = orderids[1]
        const swalWithBootstrapButtons = Swal.mixin({
          customClass: {

            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger'

          },
          buttonsStyling: false
        })
        if (this.hasguarantee) {
          this.api.createcustomerappliance(token, this.order.customerID, this.order.modelID, this.order.modelSerial).subscribe(
            res => {
             console.log(res)
              ////فاکتور خرید///
              for (let i = 0; i < this.iimage.length; i++) {
                var compimg = this.iimage[i]
                var myHeaders = new Headers();
                myHeaders.append("Authorization", "Token " + token);
                this.progress = 1;
                var formdata1 = new FormData();
                formdata1.append("customerAppliance", res);
                formdata1.append("invoicePic", compimg, this.iimage[i].name);
               console.log("parameter to send image:" + formdata1)
                this.http.post(this.baseurl + "/order/uploaduaranteeinvoicepic/", formdata1, {
                  headers: new HttpHeaders({
                    'Authorization': 'Token  ' + token
                  }),
                  responseType: 'text',
                  reportProgress: true,
                  observe: "events"
                })
                  .pipe(
                    map((event: any) => {
                      if (event.type == HttpEventType.UploadProgress) {
                        this.progress = Math.round((100 / event.total) * event.loaded);
                      } else if (event.type == HttpEventType.Response) {
                       console.log("images is uploaded:" + event.body)
                        var res = event.body;
                      }
                    }),
                    catchError((err: any) => {
                     console.log(err.message);
                      return throwError("error1 to upload img:" + err.message);
                    })
                  )
                  .subscribe(
                    response => {
                     console.log(response)
                    },
                    err => {
                     console.log("error2 to upload img:" + err)
                    }
                  )

              }
              ////گارانتی///
              for (let i = 0; i < this.gimage.length; i++) {
                var compimg = this.gimage[i]
                var myHeaders = new Headers();
                myHeaders.append("Authorization", "Token " + token);
                this.progress = 1;
                var formdata1 = new FormData();
                var sdate=moment.from(this.order.guaranteeStartDate, 'fa', 'YYYY/MM/DD').format('YYYY/MM/DD');
                var edate=moment.from(this.order.guaranteeEndDate, 'fa', 'YYYY/MM/DD').format('YYYY/MM/DD');
                formdata1.append("customerAppliance", res);
                formdata1.append("guaranteeStartDate",sdate );
                formdata1.append("guaranteeEndDate",edate);
                formdata1.append("guaranteePic", compimg, this.gimage[i].name);
               console.log("parameter to send image:" + formdata1)
                this.http.post(this.baseurl + "/order/uploadguaranteepic/", formdata1, {
                  headers: new HttpHeaders({
                    'Authorization': 'Token  ' + token
                  }),
                  responseType: 'text',
                  reportProgress: true,
                  observe: "events"
                })
                  .pipe(
                    map((event: any) => {
                      if (event.type == HttpEventType.UploadProgress) {
                        this.progress = Math.round((100 / event.total) * event.loaded);
                      } else if (event.type == HttpEventType.Response) {
                       console.log("images is uploaded:" + event.body)
                        var res = event.body;
                      }
                    }),
                    catchError((err: any) => {
                     console.log(err.message);
                      return throwError("error1 to upload img:" + err.message);
                    })
                  )
                  .subscribe(
                    response => {
                     console.log(response)
                    },
                    err => {
                     console.log("error2 to upload img:" + err)
                    }
                  )

              }
            },
            err => {
             console.log(err)
            }
          )
        }
        ////مشکلات////
       console.log(this.selectedsubtasks2)
        for (let i = 0; i < this.image.length; i++) {
          var compimg = this.image[i]
          var myHeaders = new Headers();
          myHeaders.append("Authorization", "Token " + token);
          this.progress = 1;
          
          var formdata1 = new FormData();

          formdata1.append("order", orderid);
          formdata1.append("problemImage", compimg, this.image[i].name);
         
          this.http.post(this.baseurl + "/order/uploadcustomersproblemspic/", formdata1, {
            headers: new HttpHeaders({
              'Authorization': 'Token  ' + token
            }),
            responseType: 'text',
            reportProgress: true,
            observe: "events"
          })
            .pipe(
              map((event: any) => {
                if (event.type == HttpEventType.UploadProgress) {
                  this.progress = Math.round((100 / event.total) * event.loaded);
                } else if (event.type == HttpEventType.Response) {
                 console.log("images is uploaded:" + event.body)
                  var res = event.body;
                }
              }),
              catchError((err: any) => {
               console.log(err.message);
                return throwError("error1 to upload img:" + err.message);
              })
            )
            .subscribe(
              response => {
               console.log(response)
              },
              err => {
               console.log("error2 to upload img:" + err)
              }
            )

        }
        swalWithBootstrapButtons.fire({
          title: 'ثبت سفارش',
          text: ".سفارش شما با موفقیت ثبت شد",
          icon: 'success',
          confirmButtonText: '!متوجه شدم',
          reverseButtons: true
        })
        this.router.navigate(['home/orderslist']);
      },
      err => {
       console.log(err)
      }
    )
  }
  EditAddress(id: any) {
   console.log(id)
    var index = this.address.findIndex(item => item.id == id)
    var data = {
      id: this.address[index].id,
      mainstreet: this.address[index].addressStreet,
      substreet: this.address[index].addressSubStreet,
      lane: this.address[index].addressLane,
      building: this.address[index].addressBuilding,
      no: this.address[index].addressNo,
      unit: this.address[index].addressUnit,
      floor: this.address[index].addressFloor,
      provincename: this.address[index].province.provinceName,
      provinceid: this.address[index].province.id,
      countyname: this.address[index].county.countyName,
      countyid: this.address[index].county.id,
      cityname: this.address[index].city.cityName,
      cityid: this.address[index].city.id,
      regionname: this.address[index].region.regionName,
      regionid: this.address[index].region.id,
      neighbourname: this.address[index].neighbourhood.neighbourhoodName,
      neighbourid: this.address[index].neighbourhood.id,
      ismain: this.addresses[index].isMainAddress,
      lat: this.addresses[index].maplat,
      lng: this.addresses[index].maplong,
    }
    const dialogRef = this.editAdd.open(EditAddressDialog, {
      width: '750px',

      data: { addressdata: data },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.btn == "save" || result.btn == "edit") {

        var token = this.tokencookie.get('T');
        var userId = localStorage.getItem('personID')
        this.api.getCustomersDetails(token, userId!).subscribe(
          res => {
            this.addresses = []
            this.address = res[0].address;
            for (let i = 0; i < this.address.length; i++) {
              var addtext = ""
              if (this.address[i].province.provinceName != "")
                addtext += "استان: " + this.address[i].province.provinceName;

              if (this.address[i].county.countyName != "")
                addtext += ", شهرستان: " + this.address[i].county.countyName;

              if (this.address[i].city.cityName != "")
                addtext += ", شهر: " + this.address[i].city.cityName;

              if (this.address[i].region.regionName != "")
                addtext += ", " + this.address[i].region.regionName;

              if (this.address[i].neighbourhood.neighbourhoodName != "")
                addtext += ", " + this.address[i].neighbourhood.neighbourhoodName;

              if (this.address[i].addressStreet != "")
                addtext += ", " + this.address[i].addressStreet;
              if (this.address[i].addressSubStreet != "")
                addtext += ", " + this.address[i].addressSubStreet;

              if (this.address[i].addressLane != "")
                addtext += ", " + this.address[i].addressLane;

              if (this.address[i].addressNo != "")
                addtext += ", پلاک: " + this.address[i].addressNo;

              if (this.address[i].addressUnit != "")
                addtext += ", واحد: " + this.address[i].addressUnit;

              if (this.address[i].addressFloor != "")
                addtext += ", طبقه: " + this.address[i].addressFloor;

              this.addresses.push({ id: this.address[i].id, text: addtext, maplat: Number(this.address[i].addressLat), maplong: Number(this.address[i].addressLong), isMainAddress: Boolean(this.address[i].isMain) })
            }
          },
          err => {
           console.log(err)
          }
        )
      }
    });
  }
  onSelectGaurantee(event: any) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();
        this.gimage[i] = event.target.files[i]
        reader.onload = (event: any) => {
          this.gurls.push(event.target.result);
        }
        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }
  onSelectInvoice(event: any) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();
        this.iimage[i] = event.target.files[i]
        reader.onload = (event: any) => {
          this.iurls.push(event.target.result);
        }
        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }
  deletegimg(url: any) {
    if (url != null) {
      const index: number = this.gurls.indexOf(url);
      if (index !== -1) {
        this.gurls.splice(index, 1);
        this.firstFormGroup.controls.gfile.patchValue("");
      }
    }
  }
  deleteiimg(url: any) {
    if (url != null) {
      const index: number = this.iurls.indexOf(url);
      if (index !== -1) {
        this.iurls.splice(index, 1);
        this.firstFormGroup.controls.ifile.patchValue("");
      }
    }
  }
  ProblemSearchChange(event: any) {
    var s = [];
    if (event.target.value != "") {
      for (let i = 0; i < this.allsubtasks.length!; i++) {
        var protitle = this.allsubtasks![i].title.toLowerCase()
        var searchv = event.target.value.toLowerCase()
        if (protitle.includes(searchv)) {
          s.push(this.allsubtasks![i])
        }
      }
      this.subtasks = s;
    }
    else {
      this.subtasks = this.allsubtasks
    }

  }
}


@Component({
  selector: 'edit-adddress-Dialog',
  templateUrl: 'editadd.html',
  styleUrls: ['./orderpage.component.scss']
})
export class EditAddressDialog implements OnInit {
  form = new FormGroup({
    groupName: new FormControl('', Validators.required),
  })
  private formSubmitAttempt!: boolean;
  addressforedit: any;
  constructor(
    private api: ApiServicesService,
    private modalService: NgbModal,
    private tokencookie: CookieService,
    public dialogRef: MatDialogRef<EditAddressDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { }

  isFieldInvalid(field: string) {
    return (
      (!this.form.get(field)?.valid && this.form.get(field)?.touched) ||
      (this.form.get(field)?.untouched && this.formSubmitAttempt)
    );
  }
  ngOnInit() {

   console.log(this.data.addressdata)
    this.addressforedit = this.data.addressdata
  }
  getValues(sg: any) {
   console.log(sg)
  }
  editadd(event: any) {
   console.log(event);
    if (event.kind == "edit") {
      var data: { btn: string, addid: number } = { btn: "edit", addid: event.addid }
      this.dialogRef.close(data);
    }
    if (event.kind == "save") {
      var data: { btn: string, addid: number } = { btn: "save", addid: event.addid }
      this.dialogRef.close(data);
    }
  }
  close() {
    var data: { btn: string } = { btn: "cancel" }
    this.dialogRef.close(data);
  }
}