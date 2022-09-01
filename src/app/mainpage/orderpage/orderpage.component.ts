import { Component, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
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

@Component({
  selector: 'app-orderpage',
  templateUrl: './orderpage.component.html',
  styleUrls: ['./orderpage.component.css'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
})
export class OrderpageComponent {
  @ViewChild("stepper", { static: false }) private stepper: MatStepper;
  subtasks: { name: string, completed: boolean }[] = [];
  private scrollHelper: ScrollHelper = new ScrollHelper();
  showcomment: boolean = false;
  applienceClass: string;
  gridColumns = 3;
  title: string = "";
  brandtitle: string = "";
  progress: number;
  firststeperror: boolean = false;
  secondsteperror: boolean = false;
  thirdsteperror: boolean = false;
  fourthteperror: boolean = false;
  firstcomplete: boolean = false;
  secondcomplete: boolean = false;
  thirdcomplete: boolean = false;
  fourthcomplete: boolean = false;
  brands?: { brand: string, brandpic: string, models: { model: string, description: string }[] }[]
  models?: { model: string, description: string }[]
  showmodels: boolean = false;
  showbrands: boolean = false;
  firstFormGroupError: string = "";
  firstFormGroup = this._formBuilder.group({
    firstCtrl: [''],
  });
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
  });
  hasmodel: boolean = false;
  stepperOrientation: Observable<StepperOrientation>;
  applience: { title: string, pic: string, desc: string, brands: { brand: string, brandpic: string, models: { model: string, description: string }[] }[] }[] = []
  constructor(private scroller: ViewportScroller, private _formBuilder: FormBuilder, breakpointObserver: BreakpointObserver) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
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
      { name: 'نصب اولیه گارانتی', completed: false },
      { name: 'نصب مجدد و آموزش', completed: false },
      { name: 'تایمر شستشو خراب', completed: false },
      { name: 'وان شستشو شکسته', completed: false },
      { name: 'آب را تخلیه نمیکند', completed: false },
      { name: 'روشن نمیشود', completed: false },
      { name: 'سایر', completed: false },
    ];

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
    if (name == "سایر") {
      if (ch == true) {
        this.showcomment = true;
      }
      else {
        this.showcomment = false;
      }
    }
    for (let i = 0; i < this.subtasks.length; i++) {
      if (this.subtasks[i].completed == true) {
        this.secondsteperror = false;
        this.secondcomplete = true;
        break;
      }
    }
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
  urls:any = [];
  deleteimg(url:any) {
    if (url != null) {
      const index: number = this.urls.indexOf(url);
      if (index !== -1) {
        this.urls.splice(index, 1);
      }
    }
  }
}