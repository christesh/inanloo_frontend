import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IDatepickerTheme } from 'ng-persian-datepicker';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AnimationStyleMetadata } from '@angular/animations';
import { Jalali } from 'jalali-ts';
import { hide } from '@popperjs/core';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { faListSquares } from '@fortawesome/free-solid-svg-icons';
import { CustomerProfile,Address,Mobile,Telephone,Shahrestan,Province,City } from '../profile';
@Component({
  selector: 'app-customerProfile',
  templateUrl: './customerProfile.component.html',
  styleUrls: ['./customerProfile.component.scss']
})
export class CustomerProfileComponent implements OnInit {
  customTheme: Partial<IDatepickerTheme> = {
    selectedBackground: '#4cb53f',
    selectedText: '#FFFFFF',
  };

  @ViewChild("p", { static: false }) popover1: NgbPopover;

  constructor(private fb: FormBuilder, private _snackBar: MatSnackBar,) { }
  addressForm:FormGroup;
  form1!: FormGroup;
  form2!: FormGroup;
  form3!: FormGroup;
  form4!: FormGroup;
  fname = new FormControl('', [Validators.required]);
  lname = new FormControl('', [Validators.required]);
  mobilenumber: string = "";
  mobilenumberisvalid: boolean = false;
  telnumber: string = "";
  telnumberisvalid: boolean = false;
  private formSubmitAttempt!: boolean;
  dateValue1 = new FormControl();
  showdatep: boolean = false;
  showpopover: boolean = false;
  mobiles: Mobile[] = [];
  tels: Telephone[] = [];
  showMap: boolean = false;
  province: Province[] = []
  shahrestan: Shahrestan[] = []
  city: City[] = []
  disabled: boolean = true;
  firstname: string = "";
  lastname: string = "";
  nationalid: string = "";
  birthdate: string = "";
  
  fullAddress:Address[];

  region:string="";
  mainstreet:string="";
  substreet:string="";
  lane:string="";
  building:string="";
  no:string="";
  unit:string="";
  desciription:string="";
 
  openSnackBar(message: string, action: string, alertkind: string, showtime: number, hp?: MatSnackBarHorizontalPosition, vp?: MatSnackBarVerticalPosition) {
    this._snackBar.open(message, action, {
      duration: showtime * 1000,
      panelClass: [alertkind],
      horizontalPosition: hp,
      verticalPosition: vp
    });
  }

  ngOnInit() {
    this.province = [{ id: 1, name: "تهران" }, { id: 2, name: "البرز" }]
    this.shahrestan = [{ id: 1, name: "کرج" }, { id: 2, name: "هشتگرد" }]
    this.city = [{ id: 1, name: "کرج" }, { id: 2, name: "فردیس" }]
    this.typevalue = false;
    this.mobiles = [{ number: '09120762744', ismain: true }, { number: '09365472389', ismain: false }]
    this.tels = [{ number: '02122380377' }, { number: '02122380277' }]
    this.disabled = true;
    this.firstname = "مسیح";
    this.lastname = "ابراهیم نژاد";
    this.nationalid = "12123123";
    this.birthdate = "1363/03/29";
    
  }
 
  selectprovince() {

  }
  selectshahrestan() {

  }
  selectcity() {

  }
  showmap() {
    this.showMap = true;
  }
  isFieldInvalid(field: string) { // {6}
    // alert(this.mobilenumber.match(/09(1[0-9]|3[1-9]|2[1-9])-?[0-9]{3}-?[0-9]{4}/))
    return (
      true
    );
  }
  onDateChange(event: any) {
    console.log(event);
    console.log(this.dateValue1.value)
    this.birthdate = event['shamsi']
  }
  onInit(event: any) {
    console.log(event)
    event = { shamsi: this.birthdate, gregoian: '', timestamp: 1663356600000 }

  }

  calmonth: string = "";
  calday: string = "";
  selectedtime: string = "";
  selectedDate: string;
  mapenable: boolean = false;
  maplat: number = 51.367918;
  maplong: number = 35.712706;
  editMobile:boolean=false;
  mobiledisabled:boolean=true;
  editTel:boolean=false;
  teldisabled:boolean=true;
  
  datepickeropen:boolean=false;
  showdatepicker(pp:any) {
    if (!this.disabled && !this.datepickeropen) {  
    pp.open();
    this.datepickeropen=true;
    }
    else
    {
      pp.close();
      this.datepickeropen=false;
    }
  
  }
  editmobile(){
    this.editMobile = true;
    this.mobiledisabled = false;
  }
  savemobile(){
    this.editMobile = false;
    this.mobiledisabled = true;
  }
  cancelmobile(){
    this.editMobile = false;
    this.teldisabled = true;
  }
  edittel(){
    this.editTel = true;
    this.teldisabled = false;
  }
  savetel(){
    this.editTel = false;
    this.teldisabled = true;
  }
  canceltel(){
    this.editTel = false;
    this.teldisabled = true;
  }

  changedate(event: any) {
    this.birthdate = event['shamsi'];
    this.showpopover = true;
    this.popover1.close();
    this.datepickeropen=false;
  }
  isDisabled(po:any){
    
    return this.disabled;
  }
  addmobile() {
    if (this.mobilenumberisvalid) {
      var index = this.mobiles.find(item => item.number == this.mobilenumber)
      if (index == null) {
        this.mobiles.push({ number: this.mobilenumber, ismain: false });
        this.mobilenumber = '';
        this.mobilenumberisvalid = false;
        this.typevalue = false;
      }
      else {
        this.openSnackBar('شماره تلفن همراه وارد شده تکراری است!', '', 'red-snackbar', 5)
      }
    }
  }
  addtel() {
    if (this.telnumberisvalid) {
      var index = this.tels.find(item => item.number == this.telnumber)
      if (index == null) {
        this.tels.push({ number: this.telnumber });
        this.telnumber = '';
        this.telnumberisvalid = false;
        this.teltypevalue = false;
      }
      else {
        this.openSnackBar('شماره تلفن وارد شده تکراری است!', '', 'red-snackbar', 5)
      }
    }
  }
  deletemobile(i: any) {
    this.mobiles.splice(i, 1);
  }
  deletetel(i: any) {
    this.tels.splice(i, 1);
  }
  typevalue: boolean = false;
  teltypevalue: boolean = false;

  checkmobilevalidation(event: any) {
    if (event.target.value != "") {
      this.typevalue = true;
      this.mobilenumber = event.target.value;
      this.mobilenumberisvalid = /09(0[0-5]|1[0-9]|3[1-9]|2[1-9])-?[0-9]{3}-?[0-9]{4}/.test(event.target.value)
    }
    else {
      this.typevalue = false;
    }
  }
  checktelvalidation(event: any) {
    if (event.target.value != "") {
      this.teltypevalue = true;
      this.telnumber = event.target.value;
      this.telnumberisvalid = /0-?[0-9]{2}-?[0-9]{4}-?[0-9]{4}/.test(event.target.value)
    }
    else {
      this.teltypevalue = false;
    }
  }
  shownewaddress: boolean = false;
  createaddress() {
    this.shownewaddress = true;
  }
  saveaddress() {

  }
  canceladdress() {
    this.shownewaddress = false;
  }
  editName: boolean = false;
  editname() {
    this.editName = true;
    this.disabled = false;
  }
  savename() {
    this.editName = false;
    this.disabled = true;
  }
  cancelname() {
    this.editName = false;
    this.disabled = true;
  }
}
