import { Component, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
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
import { faLessThanEqual } from '@fortawesome/free-solid-svg-icons';
import { MatTable } from '@angular/material/table';
import * as moment from 'jalali-moment';
import { Jalali } from 'jalali-ts';
import { IDatepickerTheme } from 'ng-persian-datepicker';



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
  maptitle = 'mapir-angular-test';
  center: { lng: number, lat: number } = { lng: 1, lat: 1 };
  apiKey: string = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImY1YjQxNGI0YjA0NWRhYjU5MDI0NjNiOTc1ZWQ5Y2JlNTIwMTg2NWJkMDc5ZTJiZTFkMTdlYTlkNjlmYjU2ODgwM2M2YTNjZDlmZDM4NjQ3In0.eyJhdWQiOiIxODg3NiIsImp0aSI6ImY1YjQxNGI0YjA0NWRhYjU5MDI0NjNiOTc1ZWQ5Y2JlNTIwMTg2NWJkMDc5ZTJiZTFkMTdlYTlkNjlmYjU2ODgwM2M2YTNjZDlmZDM4NjQ3IiwiaWF0IjoxNjU4ODUwMzk1LCJuYmYiOjE2NTg4NTAzOTUsImV4cCI6MTY2MTQ0MjM5NSwic3ViIjoiIiwic2NvcGVzIjpbImJhc2ljIl19.BBTA6uG2NU-Mk29jtZ6AapmJSfKp0k5GduBg-zyTESv1Vfoi0Mya6-E9HgiAmgsjtpK2JkNeWIAlBnw3bAo4wM1gwOvfKGR3Ngrs-QVKFQTfJ5batCu8NMcf1Kj5mL3o9xrH_YNInvgXO_D5XNk48sQ0rufjWy-AF-zsznx4bihluF5oyIU4Rwae6UaANMXpB7sLjkLB4ijw0kCaQ_Cj0fUe_KlX6Ymial4RUJ_ngk1uNdacjuJ0V2HpW-5cKuYiINKnxOD3WBZXN4bqhRrTcje6D0dwVU1y9zHjXDzeGwOUa7mayfXG2sQoO6eVkYg7X1MNELpcl-yGr3O_FfZPnQ";
  timerange = ["بین 9 تا 12", "بین 12 تا 15", "بین 15 تا 18", "بین 18 تا 21"];
  selectedtime: string = "";
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
  subtasks: { name: string, completed: boolean, lowprice?: string, highprice?: string }[] = [];
  selectedsubtasks: { name: string, completed: boolean, lowprice?: string, highprice?: string }[] = [];
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
  brands?: { brand: string, brandpic: string, models: { model: string, description: string }[] }[] = []
  models?: { model: string, description: string }[] = []
  showmodels: boolean = false;
  showbrands: boolean = false;
  firstFormGroupError: string = "";
  firstFormGroup = this._formBuilder.group({
    firstCtrl: [''],
  });
  searchvalue: string = "";
  secondFormGroupError: string = "";
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  thirdFormGroupError: string = "";
  thirdFormGroup = this._formBuilder.group({
    thirdCtrl: ['', Validators.required],
    
  });
  fourthFormGroupError: string = "";
  fourthFormGroup = this._formBuilder.group({
    fourthCtrl: ['', Validators.required],
    radioCtrl: ['', Validators.required],
  });
  hasmodel: boolean = false;
  stepperOrientation: Observable<StepperOrientation>;
  applience: { title: string, pic: string, desc: string, brands: { brand: string, brandpic: string, models: { model: string, description: string }[] }[] }[] = []
  constructor(private scroller: ViewportScroller, private _formBuilder: FormBuilder, breakpointObserver: BreakpointObserver) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));

  }
  ngOnInit() {
    this.firstFormGroupError = "فرآیند انتخاب خدمت ناقص است!";
    this.secondFormGroupError = "فرآیند انتخاب ناقص است!";
    this.thirdFormGroupError = "فرآیند انتخاب آدرس است!";
    this.fourthFormGroupError = "فرآیند ثبت سفارش ناقص است!";
    this.applience.push({ title: "ساید بای ساید", pic: "../../../assets/images/devices/refrigerator-1.png", desc: "", brands: [{ brand: "Bosch", brandpic: "../../../assets/images/brands/bosch.png", models: [{ model: "1", description: "" }, { model: "2", description: "" }, { model: "3", description: "" }] }, { brand: "AEG", brandpic: "../../../assets/images/brands/aeg.png", models: [{ model: "1", description: "" }, { model: "2", description: "" }, { model: "3", description: "" }] }, { brand: "Samsung", brandpic: "../../../assets/images/brands/samsung.png", models: [{ model: "1", description: "" }, { model: "2", description: "" }, { model: "3", description: "" }] }] });
    this.applience.push({ title: "لباس شویی", pic: "../../../assets/images/devices/01.png", desc: "", brands: [{ brand: "Bosch", brandpic: "../../../assets/images/brands/bosch.png", models: [{ model: "1", description: "" }, { model: "2", description: "" }, { model: "3", description: "" }] }, { brand: "AEG", brandpic: "../../../assets/images/brands/aeg.png", models: [{ model: "1", description: "" }, { model: "2", description: "" }, { model: "3", description: "" }] }, { brand: "پارس خزر", brandpic: "../../../assets/images/brands/pars.png", models: [{ model: "1", description: "" }, { model: "2", description: "" }, { model: "3", description: "" }] }] });
    this.applience.push({ title: "جارو برقی", pic: "../../../assets/images/devices/washing-machine-2.png", desc: "", brands: [{ brand: "Bosch", brandpic: "../../../assets/images/brands/bosch.png", models: [{ model: "1", description: "" }, { model: "2", description: "" }, { model: "3", description: "" }] }, { brand: "Samsung", brandpic: "../../../assets/images/brands/samsung.png", models: [{ model: "1", description: "" }, { model: "2", description: "" }, { model: "3", description: "" }] }] });
    this.applience.push({ title: "ظرفشویی", pic: "../../../assets/images/devices/dish-washer.png", desc: "", brands: [{ brand: "Bosch", brandpic: "../../../assets/images/brands/bosch.png", models: [{ model: "1", description: "" }, { model: "2", description: "" }, { model: "3", description: "" }] }, { brand: "AEG", brandpic: "../../../assets/images/brands/aeg.png", models: [{ model: "1", description: "" }, { model: "2", description: "" }, { model: "3", description: "" }] }, { brand: "Samsung", brandpic: "../../../assets/images/brands/samsung.png", models: [{ model: "1", description: "" }, { model: "2", description: "" }, { model: "3", description: "" }] }] });
    this.applience.push({ title: "یخچال", pic: "../../../assets/images/devices/washing-machine-1.png", desc: "", brands: [{ brand: "هایر", brandpic: "../../../assets/images/brands/haier.png", models: [{ model: "1", description: "" }, { model: "2", description: "" }, { model: "3", description: "" }] }, { brand: "AEG", brandpic: "../../../assets/images/brands/aeg.png", models: [{ model: "1", description: "" }, { model: "2", description: "" }, { model: "3", description: "" }] }, { brand: "Samsung", brandpic: "../../../assets/images/brands/samsung.png", models: [{ model: "1", description: "" }, { model: "2", description: "" }, { model: "3", description: "" }] }] });
    this.applience.push({ title: "ماکروویر", pic: "../../../assets/images/devices/washing-machine-10.png", desc: "", brands: [{ brand: "miele", brandpic: "../../../assets/images/brands/miele.png", models: [{ model: "1", description: "" }, { model: "2", description: "" }, { model: "3", description: "" }] }, { brand: "AEG", brandpic: "../../../assets/images/brands/aeg.png", models: [{ model: "1", description: "" }, { model: "2", description: "" }, { model: "3", description: "" }] }, { brand: "Samsung", brandpic: "../../../assets/images/brands/samsung.png", models: [{ model: "1", description: "" }, { model: "2", description: "" }, { model: "3", description: "" }] }] });
    this.applience.push({ title: "کولر گازی", pic: "../../../assets/images/devices/fan-2.png", desc: "", brands: [{ brand: "Bosch", brandpic: "../../../assets/images/brands/bosch.png", models: [{ model: "1", description: "" }, { model: "2", description: "" }, { model: "3", description: "" }] }, { brand: "AEG", brandpic: "../../../assets/images/brands/aeg.png", models: [{ model: "1", description: "" }, { model: "2", description: "" }, { model: "3", description: "" }] }, { brand: "Samsung", brandpic: "../../../assets/images/brands/samsung.png", models: [{ model: "1", description: "" }, { model: "2", description: "" }, { model: "3", description: "" }] }] });
    this.applience.push({ title: "تصفیه آب", pic: "../../../assets/images/devices/icon01-2.png", desc: "", brands: [{ brand: "Bosch", brandpic: "../../../assets/images/brands/bosch.png", models: [{ model: "1", description: "" }, { model: "2", description: "" }, { model: "3", description: "" }] }, { brand: "LG", brandpic: "../../../assets/images/brands/lg.png", models: [{ model: "1", description: "" }, { model: "2", description: "" }, { model: "3", description: "" }] }, { brand: "Samsung", brandpic: "../../../assets/images/brands/samsung.png", models: [{ model: "1", description: "" }, { model: "2", description: "" }, { model: "3", description: "" }] }] });
    this.applience = this.applience.slice(0);
    this.subtasks = [
      { name: 'نصب اولیه گارانتی', completed: false, lowprice: '1000000', highprice: '2000000' },
      { name: 'نصب مجدد و آموزش', completed: false, lowprice: '2000000', highprice: '3000000' },
      { name: 'تایمر شستشو خراب', completed: false, lowprice: '1500000', highprice: '2500000' },
      { name: 'وان شستشو شکسته', completed: false, lowprice: '100000', highprice: '200000' },
      { name: 'آب را تخلیه نمیکند', completed: false, lowprice: '1800000', highprice: '2800000' },
      { name: 'روشن نمیشود', completed: false, lowprice: '1100000', highprice: '1200000' },
      { name: 'سایر', completed: false, lowprice: 'نامشخص', highprice: 'نامشخص' },
    ]
    this.yesterday = Jalali.parse(Jalali.now().add(-1, 'day').toString()).valueOf()
    this.initdateforcal(Jalali.now().toString().substring(0, 10))

    this.center.lng = 51.367918;
    this.center.lat = 35.712706;
    
    // var app: any;
    // $(document).ready(function() {
    //   var app = new (Mapp as any)({
    //       element: '#app',
    //       presets: {
    //           latlng: {
    //               lat: 32,
    //               lng: 52,
    //           },
    //           zoom: 12,
    //       },
    //       apiKey: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImY1YjQxNGI0YjA0NWRhYjU5MDI0NjNiOTc1ZWQ5Y2JlNTIwMTg2NWJkMDc5ZTJiZTFkMTdlYTlkNjlmYjU2ODgwM2M2YTNjZDlmZDM4NjQ3In0.eyJhdWQiOiIxODg3NiIsImp0aSI6ImY1YjQxNGI0YjA0NWRhYjU5MDI0NjNiOTc1ZWQ5Y2JlNTIwMTg2NWJkMDc5ZTJiZTFkMTdlYTlkNjlmYjU2ODgwM2M2YTNjZDlmZDM4NjQ3IiwiaWF0IjoxNjU4ODUwMzk1LCJuYmYiOjE2NTg4NTAzOTUsImV4cCI6MTY2MTQ0MjM5NSwic3ViIjoiIiwic2NvcGVzIjpbImJhc2ljIl19.BBTA6uG2NU-Mk29jtZ6AapmJSfKp0k5GduBg-zyTESv1Vfoi0Mya6-E9HgiAmgsjtpK2JkNeWIAlBnw3bAo4wM1gwOvfKGR3Ngrs-QVKFQTfJ5batCu8NMcf1Kj5mL3o9xrH_YNInvgXO_D5XNk48sQ0rufjWy-AF-zsznx4bihluF5oyIU4Rwae6UaANMXpB7sLjkLB4ijw0kCaQ_Cj0fUe_KlX6Ymial4RUJ_ngk1uNdacjuJ0V2HpW-5cKuYiINKnxOD3WBZXN4bqhRrTcje6D0dwVU1y9zHjXDzeGwOUa7mayfXG2sQoO6eVkYg7X1MNELpcl-yGr3O_FfZPnQ'
    //   });
    // app.addLayers();
    // });
  }
  ngAfterViewChecked() {

    this.scrollHelper.doScroll();
    //// baraye inke befhamim to kodoom step rafte va vaghti raft haserror true beshe ////
    this.stepper.selectionChange
      .pipe(pluck("selectedIndex"))
      .subscribe((res: number) => {
        switch (res) {
          case 0: {
            this.firststeperror = true;
            break;
          }
          case 1: {
            this.secondsteperror = true;
            break;
          }
          case 2: {
            this.thirdsteperror = true;
            break;
          }
          case 3: {
            this.fourthteperror = true;
            break;
          }
        }
      });
  }
  selectapplience(i: any) {
    this.title = i;
    this.showbrands = true;
    this.brands = this.applience.find(item => item.title == i)?.brands
    this.scrollHelper.scrollToFirst("selectbrand");
  }

  selectbrand(i: any) {
    this.brandtitle = i;
    this.showmodels = true;
    this.firststeperror = false;
    this.firstcomplete = true;
    this.hasmodel = true;
    this.models = this.brands?.find(item => item.brand == i)?.models
    this.scrollHelper.scrollToFirst("selectmodels");
  }
  updateAllComplete(name: string) {
    let ch = this.subtasks.find(item => item.name == name)?.completed
    if (ch == true) {
      if (name == "سایر") {
        this.showcomment = true;
      }
      var ss = this.subtasks.find(item => item.name == name)
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
      var ss = this.selectedsubtasks.find(item => item.name == name)
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

  initdateforcal(date: string) {
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
}