
import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, Input, Inject, Output, EventEmitter, Injectable } from '@angular/core';
import { IDatepickerTheme } from 'ng-persian-datepicker';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AnimationStyleMetadata } from '@angular/animations';
import { Jalali } from 'jalali-ts';
import { hide } from '@popperjs/core';
import { NgbModal, NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { faListSquares } from '@fortawesome/free-solid-svg-icons';
import { CustomerProfile, Address, Mobile, Telephone, Counties, Province, Cities, Regions, Nighbourhoods, ThechnicianProfile } from '../profile';
import { ApiServicesService } from 'src/app/api-services.service';
import { CookieOptions, CookieService } from 'ngx-cookie-service';
import { GlobalvarService } from 'src/app/globalvar.service';
import { control } from 'leaflet';
import { Router } from '@angular/router';
import { DialogData } from '../../orderpage/orderpage.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppliencemanagementComponent } from 'src/app/portal/appliencemanagement/appliencemanagement.component';
import { Applience, Brands } from '../../orderpage/Order';
import { LngLatLike } from 'mapbox-gl';
import { environment } from '../../../../environments/environment';
import { NavigationControl, Map } from 'mapbox-gl';
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';
import { DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import { ViewCell } from 'ng2-smart-table';
import { ThemeService } from 'ng2-charts';
import * as moment from 'jalali-moment';


@Component({
  selector: 'button-view',
  template: `
    <input id="myCheck" type="checkbox" id="rule" [checked]="checkboxval" (change)="changeStatus()"
                style="direction: rtl;cursor: pointer;" >
  `,
})

export class ButtonViewComponent implements ViewCell, OnInit {
  renderValue: string;
  checkboxval: boolean = false;

  @Input() value: string | number;
  @Input() rowData: any;
  @Input() disabled: boolean;

  @Output() save: EventEmitter<any> = new EventEmitter();
  constructor() {
  }
  ngOnInit() {
    this.disabled = true;
    this.renderValue = this.value.toString().toUpperCase();
    if (this.value.toString().toUpperCase() == "بله")
      this.checkboxval = true;
    else
      this.checkboxval = false;
  }

  changeStatus() {
    if (this.checkboxval) {
      this.checkboxval = false;
    }
    else {
      this.checkboxval = true;
    }
    var rd = { row: this.rowData, checkboxValue: this.checkboxval }
    this.save.emit(rd);
  }
}

@Component({
  selector: 'app-technicianProfile',
  templateUrl: './technicianProfile.component.html',
  styleUrls: ['./technicianProfile.component.scss']
})
export class TechnicianProfileComponent {
  emailFormControl = new FormControl('');
  customTheme: Partial<IDatepickerTheme> = {
    selectedBackground: '#4cb53f',
    selectedText: '#FFFFFF',
  };

  @ViewChild("p", { static: false }) popover1: NgbPopover;
  @Input() showBanner: boolean;
  profilePic: any;
  private picurl = environment.PIC_URL;
  private baseurl = environment.API_URL;
  constructor(
    private _sanitizer: DomSanitizer,
    private router: Router,
    private globalVar: GlobalvarService,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private api: ApiServicesService,
    private tokencookie: CookieService,
    public editAdd: MatDialog,

  ) {

  }
  defultpic = '../../../../assets/images/techProfile.png'
  newSkillID = 0;
  newDstrictID = 0;
  showbanner: boolean = true;
  info: FormGroup;
  addressForm: FormGroup;
  form1!: FormGroup;
  // apiKey= environment.API_URL;
  apiKey: string = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImY1YjQxNGI0YjA0NWRhYjU5MDI0NjNiOTc1ZWQ5Y2JlNTIwMTg2NWJkMDc5ZTJiZTFkMTdlYTlkNjlmYjU2ODgwM2M2YTNjZDlmZDM4NjQ3In0.eyJhdWQiOiIxODg3NiIsImp0aSI6ImY1YjQxNGI0YjA0NWRhYjU5MDI0NjNiOTc1ZWQ5Y2JlNTIwMTg2NWJkMDc5ZTJiZTFkMTdlYTlkNjlmYjU2ODgwM2M2YTNjZDlmZDM4NjQ3IiwiaWF0IjoxNjU4ODUwMzk1LCJuYmYiOjE2NTg4NTAzOTUsImV4cCI6MTY2MTQ0MjM5NSwic3ViIjoiIiwic2NvcGVzIjpbImJhc2ljIl19.BBTA6uG2NU-Mk29jtZ6AapmJSfKp0k5GduBg-zyTESv1Vfoi0Mya6-E9HgiAmgsjtpK2JkNeWIAlBnw3bAo4wM1gwOvfKGR3Ngrs-QVKFQTfJ5batCu8NMcf1Kj5mL3o9xrH_YNInvgXO_D5XNk48sQ0rufjWy-AF-zsznx4bihluF5oyIU4Rwae6UaANMXpB7sLjkLB4ijw0kCaQ_Cj0fUe_KlX6Ymial4RUJ_ngk1uNdacjuJ0V2HpW-5cKuYiINKnxOD3WBZXN4bqhRrTcje6D0dwVU1y9zHjXDzeGwOUa7mayfXG2sQoO6eVkYg7X1MNELpcl-yGr3O_FfZPnQ";
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
  shahrestan: Counties[] = []
  city: Cities[] = []
  region: Regions[] = [];
  neighbourhood: Nighbourhoods[] = []
  disabled: boolean = true;
  firstname = new FormControl('');
  lastname = new FormControl('');
  nationalid = new FormControl('');
  nationalid1: string = "";
  birthdate: string = "";
  mapEnable: boolean = true;
  fullAddress: Address[];
  customertablevalue: LocalDataSource;
  customerTable: any;
  mainstreet: string = "";
  substreet: string = "";
  lane: string = "";
  building: string = "";
  خیر: string = "";
  unit: string = "";
  floor: string = "";
  address: Address[] = []
  addresses: { id: number, text: string, isMainAddress: boolean, maplong: number, maplat: number }[] = []
  maplat: number = 51.367918;
  maplong: number = 35.712706;
  curentTechnician: ThechnicianProfile;
  showdestrictstable: boolean = true;
  openSnackBar(message: string, action: string, alertkind: string, showtime: number, hp?: MatSnackBarHorizontalPosition, vp?: MatSnackBarVerticalPosition) {
    this._snackBar.open(message, action, {
      duration: showtime * 1000,
      panelClass: [alertkind],
      horizontalPosition: hp,
      verticalPosition: vp
    });
  }
  appliances: Applience[] = [];
  brands: { id: string, bid: string, brand: string, job: string }[] = [];
  brandsname: Brands[] = []
  brandidselected: any;
  selectedGroup: any;
  userid: any;
  name: any;
  progress: number;
  gurls: any = [];
  gimage: File[] = [];
  profilePicFile: File;
  brandselected: any[];
  appselected: any;
  districtTablevalue: LocalDataSource;
  destrictTableSetting: any;
  skillTablevalue: LocalDataSource;
  skillTableSetting: any;
  companyMembertablevalue: LocalDataSource;
  companyMembersTable: any;
  interstsForm = new FormGroup({
    interests: new FormControl(''),
  })
  public input: string = '<input type="checkbox"></input>';
  displayedColumns: string[];
  displayeddistrictColumns: string[];
  profilefill: boolean = false;
  skillfill: boolean = false;
  districtfill: boolean = false;
  ngOnInit() {
    this.profilePic = this.defultpic;
    if (this.cardMode) {
      this.showskillscard = true;
      this.showskillstable = true;
    }
    else {
      this.showskillscard = false;
      this.showskillstable = true;
    }
    if (!this.showBanner)
      this.showbanner = false;
    this.name = new FormControl('');
    var token = this.tokencookie.get('T')
    this.userid = localStorage.getItem('personID');
    this.skillTableSetting = {
      editable: true,
      pager: {
        display: true,
        perPage: 20
      },
      actions: {
        columnTitle: "عملیات",
        add: false,
        edit: false,
        delete: false,
        position: 'left',
        custom: [

          { name: 'deleterecord', title: '&nbsp;&nbsp;<i class="fa  fa-trash" ></i>' }]

      },
      columns: {

        applianceName: {
          title: "نوع دستگاه",
          editable: false
        },
        brand: {
          title: "برند",
          editable: false
        },
        setup: {
          title: "نصب",
          type: 'custom',
          renderComponent: ButtonViewComponent,
          onComponentInitFunction: (instance: { save: { subscribe: (arg0: (row: any) => void) => void; }; }) => {
            instance.save.subscribe((row: any) => {
              this.setupchange(row);
            });
          },

        },

        fix: {
          title: 'تعمیر',
          type: 'custom',
          renderComponent: ButtonViewComponent,
          onComponentInitFunction: (instance: { save: { subscribe: (arg0: (row: any) => void) => void; }; }) => {
            instance.save.subscribe((row: any) => {
              this.fixchange(row);
            });
          },

        },
      },
      attr: {
        class: "table table-responsive"
      },

      noDataMessage: "هیچ اطلاعاتی یافت نشد"
    };
    this.customerTable = {
      editable: false,

      pager: {
        display: true,
        perPage: 50
      },
      actions: {
        columnTitle: "عملیات",
        add: false,
        edit: false,
        delete: false,
        position: 'left',
        custom: [
          { name: 'viewrecord', title: '<i class="fa fa-eye"  ></i>' },
          { name: 'makeorder', title: '&nbsp;&nbsp;<i class="fa fa-plus-square" ></i>' }]
      },
      columns: {
        mobile: {
          title: "شماره موبایل"
        },
        national_id: {
          title: "کد ملی "
        },
        f_name: {
          title: "نام "
        },
        l_name: {
          title: "نام خانوادگی "
        },
        class: {
          title: "کلاس"
        },

      },
      attr: {
        class: "table table-responsive"
      },
      noDataMessage: "هیچ اطلاعاتی یافت نشد"
    };
    this.destrictTableSetting = {
      editable: true,
      pager: {
        display: true,
        perPage: 20
      },
      actions: {
        columnTitle: "عملیات",
        add: false,
        edit: false,
        delete: false,
        custom: [
          { name: 'deleterecord', title: '&nbsp;&nbsp;<i class="fa  fa-trash" ></i>' }]
      },
      columns: {
        pName: {
          title: "استان",
        },
        coName: {
          title: "شهرستان"
        },
        cName: {
          title: "شهر"
        },
        rName: {
          title: "منطقه"
        },
        nName: {
          title: "محله"
        },

      },
      attr: {
        class: "table table-responsive"
      },

      noDataMessage: "هیچ اطلاعاتی یافت نشد"
    };
    this.api.gettechniciansdetails(token, this.userid!).subscribe(
      res => {
        this.curentTechnician = res[0]
       // console.log(this.curentTechnician)
        this.interstsForm.controls['interests'].disable()
        this.mobiles = this.curentTechnician.mobile;
        this.tels = this.curentTechnician.phones;

        if (this.curentTechnician.picture != null)
          this.profilePic = this.picurl + this.curentTechnician.picture;
        else
          this.profilePic = 'http://is.mersa-group.ir/assets/images/profile.png'
       // console.log(this.profilePic)
        this.address = this.curentTechnician.address;
        var bd = this.curentTechnician.birthDate;
        if (bd != null) {
          this.birthdate = moment(bd).locale('fa').format('YYYY/M/D');
        }
        this.curentTechnician.birthDate = this.birthdate;
        for (let i = 0; i < this.address.length; i++) {
          var addtext = ""
          if (this.address[i].province != null)
            addtext += "استان: " + this.address[i].province.provinceName;

          if (this.address[i].county != null)
            addtext += ", شهرستان: " + this.address[i].county.countyName;

          if (this.address[i].city != null)
            addtext += ", شهر: " + this.address[i].city.cityName;

          if (this.address[i].region != null)
            addtext += ", " + this.address[i].region.regionName;

          if (this.address[i].neighbourhood != null)
            addtext += ", " + this.address[i].neighbourhood.neighbourhoodName;

          if (this.address[i].addressStreet != "")
            addtext += ", " + this.address[i].addressStreet;

          if (this.address[i].addressSubStreet != "")
            addtext += ", " + this.address[i].addressSubStreet;

          if (this.address[i].addressLane != "")
            addtext += ", " + this.address[i].addressLane;

          if (this.address[i].addressBuilding != "")
            addtext += ", " + this.address[i].addressBuilding;

          if (this.address[i].addressNo != "")
            addtext += ", پلاک: " + this.address[i].addressNo;

          if (this.address[i].addressUnit != "")
            addtext += ", واحد: " + this.address[i].addressUnit;

          if (this.address[i].addressFloor != "")
            addtext += ", طبقه: " + this.address[i].addressFloor;

          this.addresses.push({ id: this.address[i].id, text: addtext, maplat: Number(this.address[i].addressLat), maplong: Number(this.address[i].addressLong), isMainAddress: Boolean(this.address[i].isMain) })
        }
        this.typevalue = false;

        this.interstsForm.controls['interests'].patchValue(this.curentTechnician.technicianFavourite);
        this.interstsForm.controls['interests'].markAsDirty();

        this.firstname.patchValue(this.curentTechnician.firstName);
        this.firstname.markAsDirty();

        this.lastname.patchValue(this.curentTechnician.lastName);
        this.lastname.markAsDirty();

        this.nationalid.patchValue(this.curentTechnician.nationalId);
        this.nationalid.markAsDirty();

        if (this.mobiles.length != 0 && this.addresses.length != 0 && this.tels.length != 0)
          this.profilefill = true;
        else
          this.profilefill = false;

        this.disabled = true;
        this.api.gettechnicianskills(token, this.userid).subscribe(
          res => {
           // console.log(res)
            if (res.length != 0)
              this.skillfill = true;
            for (let i = 0; i < res.length; i++) {
              var fix = "";
              if (res[i].fix)
                fix = 'بله'
              else
                fix = 'خیر'
              var setup = "";
              if (res[i].installation)
                setup = 'بله'
              else
                setup = 'خیر'
              this.skillTableData.push({ skillid: res[i].id, appid: res[i].applianceID, applianceName: res[i].applianceName, brandid: res[i].brandID, brand: res[i].brandName, fix: fix, setup: setup })
              this.skillTableDataShow.push({ applianceName: res[i].applianceName, brand: res[i].brandName, fix: res[i].fix, setup: res[i].installation })
            }
            this.skillTablevalue = new LocalDataSource(this.skillTableData)
            this.displayedColumns = ['appliance', 'brand', 'setup', 'fix'];

          },
          err => {
           console.log(err)
          }
        )
        this.api.gettechniciandistricts(token, this.userid).subscribe(
          res => {
           // console.log(res)
            if (res.length != 0)
              this.districtfill = true;
            for (let i = 0; i < res.length; i++) {
              this.districtTableDate.push({
                districtid: res[i].id,
                pid: res[i].provinceID, pName: res[i].provinceName, coid: res[i].countyID, coName: res[i].countyName, cid: res[i].cityID, cName: res[i].cityName
                , rid: res[i].regionID, rName: res[i].regionName, nid: res[i].neighbourhoodID, nName: res[i].neighbourhoodName
              })
              this.districtTableDateShow.push({
                pName: res[i].provinceName, coName: res[i].countyName, cName: res[i].cityName
                , rName: res[i].regionName, nName: res[i].neighbourhoodName
              })
            }
            this.districtTableDateShow = [...this.districtTableDateShow]
            this.districtTablevalue = new LocalDataSource(this.districtTableDate)
            this.displayeddistrictColumns = ['pName', 'coName', 'cName'
              , 'rName', 'nName']
          },
          err => {
           console.log(err)
          }
        )
        this.api.getRegins(token).subscribe(
          res => {
           // console.log(res)
            this.province = res
          }
          , err => {
           console.log(err);
          })
        this.api.getAllApplience(token).subscribe(
          res => {
           // console.log(res);
            this.appliances = res;

          },
          err => {
           console.log(err);
          }
        )
      },
      err => {
       console.log(err)
      }
    )
  }
  private setupchange(row: any) {
    var index = this.skillTableData.findIndex(item => item.appid == row.row.appid && item.brandid == row.row.brandid)
    if (row.row.setup == "خیر")
      this.skillTableData[index].setup! = "بله"
    else
      this.skillTableData[index].setup! = "خیر"
  }
  private fixchange(row: any) {
    var index = this.skillTableData.findIndex(item => item.appid == row.row.appid && item.brandid == row.row.brandid)
    if (row.row.fix == "خیر")
      this.skillTableData[index].fix = "بله"
    else
      this.skillTableData[index].fix = "خیر"
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////profile///////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  deletegimg() {
    this.profilePic = this.defultpic;
    this.hasImage = false;
  }
  onSelectprofile(event: any) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();
        this.profilePicFile = event.target.files[i]
        reader.onload = (event: any) => {
          this.gurls.push(event.target.result)
          this.profilePic = event.target.result;
        }
        reader.readAsDataURL(event.target.files[i]);
        this.hasImage = true;
      }
    }
  }
  ngAfterViewInit() {
    // alert("salam")
    this.nationalid.disable();
    this.lastname.disable();
    this.firstname.disable();
  }
  provincechange(event: any) {
   // console.log(event)
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
   // console.log(event);
   // console.log(this.dateValue1.value)
    this.birthdate = event['shamsi']
  }
  calmonth: string = "";
  calday: string = "";
  selectedtime: string = "";
  selectedDate: string;
  mapenable: boolean = false;
  editMobile: boolean = false;
  mobiledisabled: boolean = true;
  editTel: boolean = false;
  teldisabled: boolean = true;
  datepickeropen: boolean = false;
  showdatepicker(pp: any) {
    if (!this.disabled && !this.datepickeropen) {
      pp.open();
      this.datepickeropen = true;
    }
    else {
      pp.close();
      this.datepickeropen = false;
    }

  }
  editmobile() {
    this.editMobile = true;
    this.mobiledisabled = false;
  }

  savemobile() {
    this.editMobile = false;
    this.mobiledisabled = true;
    var token = this.tokencookie.get('T')
    var mobiles: string[] = []
    for (let i = 0; i < this.mobiles.length; i++) {
      mobiles.push(this.mobiles[i].mobileNumber)
    }
    this.api.saveusersmobile(token, this.userid, mobiles).subscribe(
      res => {
        if (this.mobiles.length != 0 && this.addresses.length != 0 && this.tels.length != 0)
          this.profilefill = true;
        else
          this.profilefill = false;
        if (this.profilefill && this.skillfill && this.districtfill) {
          this.api.setfillprofileture(token, this.userid).subscribe(
            res => {   console.log(res) }
            , err => { console.log(err) }
          )
        }
        else {
          this.api.setfillprofilefalse(token, this.userid).subscribe(
            res => {   console.log(res) }
            , err => { console.log(err) }
          )
        }
       // console.log(res)
      },
      err => {
       console.log(err)
      }
    )
  }
  cancelmobile() {
    this.editMobile = false;
    this.teldisabled = true;
  }
  edittel() {
    this.editTel = true;
    this.teldisabled = false;
  }
  savetel() {
    this.editTel = false;
    this.teldisabled = true;
    var token = this.tokencookie.get('T')
    var telephones: string[] = []
    for (let i = 0; i < this.tels.length; i++) {
      telephones.push(this.tels[i].phoneNumber)
    }
    this.api.saveuserstel(token, this.userid, telephones).subscribe(
      res => {
        if (this.mobiles.length != 0 && this.addresses.length != 0 && this.tels.length != 0)
          this.profilefill = true;
        else
          this.profilefill = false;
        if (this.profilefill && this.skillfill && this.districtfill) {
          this.api.setfillprofileture(token, this.userid).subscribe(
            res => {   console.log(res) }
            , err => {  console.log(err) }
          )
        }
        else {
          this.api.setfillprofilefalse(token, this.userid).subscribe(
            res => {   console.log(res) }
            , err => {  console.log(err) }
          )
        }
       // console.log(res)
      },
      err => {
       console.log(err)
      }
    )
  }
  canceltel() {
    this.editTel = false;
    this.teldisabled = true;
  }
  changedate(event: any) {
    this.birthdate = event['shamsi'];
    this.showpopover = true;
    this.popover1.close();
    this.datepickeropen = false;
  }
  isDisabled(po: any) {

    return this.disabled;
  }
  addmobile() {
    if (this.mobilenumberisvalid) {
      var index = this.mobiles.find(item => item.mobileNumber == this.mobilenumber)
      var idIndex = this.mobiles.length
      if (index == null) {
        this.mobiles.push({ id: idIndex, mobileNumber: this.mobilenumber, isMain: false, person: this.userid });
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
      var index = this.tels.find(item => item.phoneNumber == this.telnumber)
      var telidx = this.tels.length
      if (index == null) {
        this.tels.push({ id: telidx, phoneNumber: this.telnumber });
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
  createadd(event: any) {
    if (event.kind == 'save') {
      var token = this.tokencookie.get('T');
      var userId = localStorage.getItem('personID')


      this.api.gettechniciansdetails(token, userId!).subscribe(
        res => {
          this.addresses = []
          this.address = res[0].address;
          this.shownewaddress = false;
          for (let i = 0; i < this.address.length; i++) {
            var addtext = ""
            if (this.address[i].province.provinceName != "")
              addtext += "استان: " + this.address[i].province.provinceName;

            if (this.address[i].county.countyName != "")
              addtext += ", شهرستان: " + this.address[i].county.countyName;

            if (this.address[i].city.cityName != "")
              addtext += ", شهر: " + this.address[i].city.cityName;

            if (this.address[i].region != null)
              addtext += ", " + this.address[i].region.regionName;

            if (this.address[i].neighbourhood != null)
              addtext += ", " + this.address[i].neighbourhood.neighbourhoodName;

            if (this.address[i].addressStreet != "")
              addtext += ", " + this.address[i].addressStreet;

            if (this.address[i].addressSubStreet != "")
              addtext += ", " + this.address[i].addressSubStreet;

            if (this.address[i].addressLane != "")
              addtext += ", " + this.address[i].addressLane;

            if (this.address[i].addressBuilding != "")
              addtext += ", " + this.address[i].addressBuilding;

            if (this.address[i].addressNo != "")
              addtext += ", پلاک: " + this.address[i].addressNo;

            if (this.address[i].addressUnit != "")
              addtext += ", واحد: " + this.address[i].addressUnit;

            if (this.address[i].addressFloor != "")
              addtext += ", طبقه: " + this.address[i].addressFloor;

            this.addresses.push({ id: this.address[i].id, text: addtext, maplat: Number(this.address[i].addressLat), maplong: Number(this.address[i].addressLong), isMainAddress: Boolean(this.address[i].isMain) })
            if (this.mobiles.length != 0 && this.addresses.length != 0 && this.tels.length != 0)
              this.profilefill = true;
            else
              this.profilefill = false;
            if (this.profilefill && this.skillfill && this.districtfill) {
              this.api.setfillprofileture(token, this.userid).subscribe(
                res => {   console.log(res) }
                , err => {  console.log(err) }
              )
            }
            else {
              this.api.setfillprofilefalse(token, this.userid).subscribe(
                res => {   console.log(res) }
                , err => {  console.log(err) }
              )
            }
          }
        },
        err => {
         console.log(err)
        }
      )
    }
    else {
      this.shownewaddress = false;
    }

  }
  canceladdress() {
    this.shownewaddress = false;
  }
  editName: boolean = false;
  hasImage: boolean = false;
  editname() {
    this.editName = true;
    this.disabled = false;
    this.firstname.enable();
    this.lastname.enable();
    this.nationalid.enable();

  }
  savename() {
    this.curentTechnician.firstName = this.firstname.value!;
    this.curentTechnician.lastName = this.lastname.value!;
    this.curentTechnician.nationalId = this.nationalid.value!;
    this.curentTechnician.birthDate = this.birthdate;
    this.editName = false;
    this.disabled = true;
    this.firstname.disable();
    this.lastname.disable();
    this.nationalid.disable();
    var token = this.tokencookie.get('T')
    this.api.editprofile(token, this.userid, this.firstname.value!, this.lastname.value!, this.nationalid.value!, this.birthdate).subscribe(
      res => {
       // console.log(res)
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Token " + token);
        var formdata = new FormData();
        formdata.append("id", this.userid);
        formdata.append("profilePic", this.profilePicFile, this.profilePicFile.name);

        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: formdata,
        };
        fetch(this.baseurl + "/personal/technicianuploadpic/", requestOptions)
          .then(response => response.text())
          .then(result =>   console.log(result))
          .catch(error => console.log('error', error));

      },
      err => {
       console.log(err)
      }
    )

  }
  lastn: string = "fdsd";
  cancelname() {
    this.editName = false;
    this.disabled = true;
    this.firstname.patchValue(this.curentTechnician.firstName);
    this.firstname.markAsDirty();
    this.lastname.patchValue(this.curentTechnician.lastName);
    this.lastname.markAsDirty();
    this.nationalid.patchValue(this.curentTechnician.nationalId);
    this.nationalid.markAsDirty();
    this.birthdate = this.curentTechnician.birthDate;
    this.firstname.disable();
    this.lastname.disable();
    this.nationalid.disable();

  }
  EditAddress(id: any) {
   // console.log(id)
    var index = this.address.findIndex(item => item.id == id)
    var regname = "";
    var regid = -1;
    if (this.address[index].region != null) {
      regname = this.address[index].region.regionName
      regid = this.address[index].region.id
    }
    var nabname = "";
    var nabid = -1;
    if (this.address[index].region != null) {
      nabname = this.address[index].neighbourhood.neighbourhoodName
      nabid = this.address[index].neighbourhood.id
    }
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
      regionname: regname,
      regionid: regid,
      neighbourname: nabname,
      neighbourid: nabid,
      ismain: this.addresses[index].isMainAddress,
      lat: this.addresses[index].maplat,
      lng: this.addresses[index].maplong,
    }
    const dialogRef = this.editAdd.open(TechEditAddressDialogProfile, {
      width: '750px',
      data: { addressdata: data },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.btn == "save" || result.btn == "edit" || result.btn == "delete") {
        var token = this.tokencookie.get('T');
        var userId = localStorage.getItem('personID')
        this.api.gettechniciansdetails(token, userId!).subscribe(
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

              if (this.address[i].region != null)
                addtext += ", " + this.address[i].region.regionName;

              if (this.address[i].neighbourhood != null)
                addtext += ", " + this.address[i].neighbourhood.neighbourhoodName;

              if (this.address[i].addressStreet != "")
                addtext += ", " + this.address[i].addressStreet;

              if (this.address[i].addressSubStreet != "")
                addtext += ", " + this.address[i].addressSubStreet;

              if (this.address[i].addressLane != "")
                addtext += ", " + this.address[i].addressLane;

              if (this.address[i].addressBuilding != "")
                addtext += ", " + this.address[i].addressBuilding;

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
  seletAddress(add: any) {
    if (add.isMainAddress) {
     // console.log(add)
      for (let i = 0; i < this.addresses.length; i++) {
        add.isMainAddress = true;
        if (this.addresses[i].id !== add.id)
          this.addresses[i].isMainAddress = false;
      }
    }
  }
  getAppValues(a: any) {
    this.brands = [];
    this.brandsname = []
    this.brandselected = [];
    this.appselected = a;
    var b = this.appliances.find(item => item.ID == a)!.brands
    this.brandsname = b;
    var idx = 0;
    for (let i = 0; i < b.length; i++) {
      this.brands.push({ id: idx.toString(), bid: b[i].ID.toString(), brand: b[i].brand, job: "نصب" })
      idx++
      this.brands.push({ id: idx.toString(), bid: b[i].ID.toString(), brand: b[i].brand, job: "تعمیر" })
      idx++
    }
  }


  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////skills////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  public ngSearchFn = (searchTerm: string, item: any) => {
    return item.brand.toLowerCase().indexOf(searchTerm) > -1 || item.job.toLowerCase().indexOf(searchTerm) > -1;
  }
  skilltableeditable: boolean = false;
  showskillscard: boolean = false;
  showskillstable: boolean = false;
  cardMode: boolean = false;
  skills: { id: string, app: string, apppic: string, kind: { id: string, brand: string, skill: string[] }[] }[] = []
  skillTableData: { skillid: string, appid: any, applianceName: string, brandid: any, brand: string, fix: string, setup: string }[] = []
  skillTableDataShow: { applianceName: string, brand: string, fix: boolean, setup: boolean }[] = []
  EditSkills() {
    if (this.skilltableeditable)
      this.skilltableeditable = false;
    else
      this.skilltableeditable = true;
  }
  CancelSkill() {
    this.skilltableeditable = false;
  }
  AddSkill() {
    if (this.cardMode) {
      this.showskillscard = true;
      this.showskillstable = false;
    }
    else {
      this.showskillscard = false;
      this.showskillstable = true;
    }

    if (this.appselected != "" && this.brandidselected != null) {
      for (let i = 0; i < this.brandidselected.length; i++) {
        var skillindx = -1;
        skillindx = this.skillTableData.findIndex(item => item.appid == this.appselected && item.brandid == this.brandidselected[i])
        if (skillindx != -1) {
          //// appliance and brand exist in table
        }
        else {
          var apptitle = this.appliances.find(item => item.ID == this.appselected)?.title
          var btitle = this.brandsname.find(item => item.ID == this.brandidselected[i])?.brand
          this.newSkillID = this.newSkillID - 1;
          this.skillTableData.push({ skillid: this.newSkillID.toString(), appid: this.appselected, applianceName: apptitle!, brandid: this.brandidselected[i], brand: btitle!, fix: 'خیر', setup: 'خیر' })
          this.skillTableDataShow.push({ applianceName: apptitle!, brand: btitle!, fix: false, setup: false })
          this.skillTableDataShow = [...this.skillTableDataShow]

          this.skillTablevalue = new LocalDataSource(this.skillTableData)
        }
      }
      this.brandidselected = []
      this.appselected = []
      this.brandsname = []
      // if (skillindx != -1) {
      //   var fixval = "خیر"
      //   var setupval = "خیر"
      //   var apptitle = this.appliances.find(item => item.ID == this.appselected)?.title
      //   for (let i = 0; i < this.brandselected.length; i++) {
      //     var jobindex = -1;
      //     jobindex = this.skills[skillindx].kind.findIndex(item => item.id == this.brandselected[i]);
      //     var bid = this.brands.find(item => item.id == this.brandselected[i])?.bid
      //     var aid = this.appliances.find(item => item.ID == this.appselected)?.ID
      //     if (jobindex == -1) {
      //       var btitle = this.brands.find(item => item.id == this.brandselected[i])?.brand

      //       var bjob = this.brands.find(item => item.id == this.brandselected[i])?.job
      //       var bindex = -1
      //       bindex = this.skills[skillindx].kind.findIndex(item => item.brand == btitle)
      //       if (bindex != -1) {
      //         this.skills[skillindx].kind[bindex].skill.push(bjob!)
      //       }
      //       else {
      //         var job: string[] = []
      //         job.push(bjob!)
      //         this.skills[skillindx].kind.push({ id: this.brandselected[i].toString(), brand: btitle!, skill: job! })
      //       }
      //     }
      //     if (bjob == 'نصب')
      //       setupval = "بله"
      //     else
      //       fixval = "بله"
      //     var rowOfSkillTabel = -1
      //     rowOfSkillTabel = this.skillTableData.findIndex(item => item.appid == aid && item.brandid == bid)
      //     if (rowOfSkillTabel != -1) {
      //       if (bjob == 'نصب')
      //         this.skillTableData[rowOfSkillTabel].setup = "بله";
      //       else
      //         this.skillTableData[rowOfSkillTabel].fix = "بله";
      //       this.skillTablevalue = new LocalDataSource(this.skillTableData)
      //     }
      //     else {
      //       this.skillTableData.push({ appid: this.appselected, applianceName: apptitle!, brandid: bid, brand: btitle!, fix: fixval, setup: setupval, button: "true" })
      //       this.skillTablevalue = new LocalDataSource(this.skillTableData)
      //     }
      //   }
      // }
      // else {
      //   var fixval = "خیر"
      //   var setupval = "خیر"
      //   var apptitle = this.appliances.find(item => item.ID == this.appselected)?.title
      //   var apppic = this.appliances.find(item => item.ID == this.appselected)?.pic
      //   var brandskill: { id: string, brand: string, skill: string[] }[] = [];
      //   for (let i = 0; i < this.brandselected.length; i++) {
      //     var btitle = this.brands.find(item => item.id == this.brandselected[i])?.brand
      //     var bid = this.brands.find(item => item.id == this.brandselected[i])?.bid
      //     var bjob = this.brands.find(item => item.id == this.brandselected[i])?.job
      //     var bindex = -1
      //     bindex = brandskill.findIndex(item => item.brand == btitle)
      //     if (bindex != -1) {
      //       brandskill[bindex].skill.push(bjob!)
      //       rowOfSkillTabel = this.skillTableData.findIndex(item => item.appid == this.appselected && item.brand == btitle)
      //       if (rowOfSkillTabel != -1) {
      //         if (bjob == 'نصب')
      //           this.skillTableData[rowOfSkillTabel].setup = "بله";
      //         else
      //           this.skillTableData[rowOfSkillTabel].fix = "بله";
      //       }
      //     }
      //     else {
      //       var job: string[] = []
      //       job.push(bjob!)
      //       brandskill.push({ id: this.brandselected[i].toString(), brand: btitle!, skill: job! })
      //       if (bjob == 'نصب')
      //         setupval = "بله"
      //       else
      //         fixval = "بله"
      //         this.skillTableData.push({ appid: this.appselected, applianceName: apptitle!, brandid: bid, brand: btitle!, fix: fixval, setup: setupval, button: "true" })
      //     }


      //   }
      //   // this.skillTableData.push({ appid: this.appselected, applianceName: apptitle!, brandid: bid, brand: btitle!, fix: fixval, setup: setupval, button: "true" })
      //   this.skillTablevalue = new LocalDataSource(this.skillTableData)
      //   this.skills.push({ id: this.appselected, app: apptitle!, apppic: apppic!, kind: brandskill! })
      // }
    }
  }

  SaveSkill() {
    var token = this.tokencookie.get('T')
    var skills = [];
    var deletecheck: Boolean = false;
    for (let i = 0; i < this.skillTableData.length; i++) {
      var s: boolean = true
      var f: boolean = true
      if (this.skillTableData[i].setup == 'خیر')
        s = false
      if (this.skillTableData[i].fix == 'خیر')
        f = false
      if (!s && !f) {
       // console.log(s + "   ///  " + f)

        Swal.fire({
          title: 'هشدار',
          text: "برای دستگاه " + this.skillTableData[i].applianceName + "/" + this.skillTableData[i].brand + " هیچ تخصص انتخاب نشده است، با این کار این دستگاه از لیست تخصص های شما حذف می شود. آیا از ادامه کار اطمینان دارید؟",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: '!آره, حذفش کن',
          cancelButtonText: 'نه، بی خیال'
        }).then((result) => {
          if (result.isConfirmed) {
            var token = this.tokencookie.get('T')
            this.api.deletetechnicianskill(token, this.skillTableData[i].skillid).subscribe(
              res => {
               // console.log(res)
                var idx = this.skillTableData.findIndex(item => item.skillid == this.skillTableData[i].skillid)
                this.skillTableData.splice(idx, 1)
                this.skillTableDataShow.splice(idx, 1)
                this.skillTableDataShow = [...this.skillTableDataShow]
                this.skillTablevalue = new LocalDataSource(this.skillTableData)
              },
              err => {
               console.log(err)
              }
            )
          }
          deletecheck = true;
        })


      }
      else {
        skills.push({ brandid: this.skillTableData[i].brandid, setup: s, fix: f })
        this.skillTableDataShow[i].fix = f;
        this.skillTableDataShow[i].setup = s;
      }
    }
    this.api.createtechnicianskills(token, this.userid, skills).subscribe(
      res => {
        if (this.skillTableData.length != 0)
          this.skillfill = true
        else
          this.skillfill = false
        if (this.profilefill && this.skillfill && this.districtfill) {
          this.api.setfillprofileture(token, this.userid).subscribe(
            res => {   console.log(res) }
            , err => {  console.log(err) }
          )
        }
        else {
          this.api.setfillprofilefalse(token, this.userid).subscribe(
            res => {  console.log(res) }
            , err => {  console.log(err) }
          )
        }
       // console.log(res)
        Swal.fire({
          title: 'بروزرسانی تخصص',
          text: 'تعداد' + res.result.create + 'وسیله به تخصص اضافه شد و ' + res.result.update + ' وسیله بروزرسانی شد',
          icon: 'success',
          confirmButtonText: '!متوجه شدم',
        }
        )
        this.skilltableeditable = false;
      },
      err => {
       console.log(err)
      }
    )

  }

  SkillAction(event: any) {
    switch (event.action) {
      case 'deleterecord':
        var name = event.data.skillid
        const swalWithBootstrapButtons = Swal.mixin({
          customClass: {
            confirmButton: 'btn btn-danger',
            cancelButton: 'btn btn-success'
          },

        })
        swalWithBootstrapButtons.fire({
          title: 'حذف تخصص',
          text: "آیا از حذف تخصص انتخابی اطمینان دارید؟",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: '!آره, حذفش کن',
          cancelButtonText: 'نه، بی خیال'
        }).then((result) => {
          if (result.isConfirmed) {
            var token = this.tokencookie.get('T')
            this.api.deletetechnicianskill(token, event.data.skillid).subscribe(
              res => {
               // console.log(res)
                var idx = this.skillTableData.findIndex(item => item.skillid == event.data.skillid)
                this.skillTableData.splice(idx, 1)
                this.skillTableDataShow.splice(idx, 1)
                this.skillTableDataShow = [...this.skillTableDataShow]
                this.skillTablevalue = new LocalDataSource(this.skillTableData)
                Swal.fire({
                  title: 'حذف تخصص ',
                  text: '!تخصص انتخابی با موفقیت حذف شد',
                  icon: 'success',
                  confirmButtonText: '!متوجه شدم',
                }
                )
              },
              err => {
               console.log(err)
              }
            )
          }
        })
        break;
    }
  }

  // ChangeSkillShowMode() {
  //   if (this.showskillscard) {
  //     this.showskillscard = false;
  //     this.showskillstable = true;
  //   }
  //   else {
  //     this.showskillscard = true;
  //     this.showskillstable = false;
  //   }
  // }

  /////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////District/////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  selectedProvince: string;
  selectedCounty: string;
  selectedCity: string;
  selectedRegion: string;
  selectedNeighbour: any;
  selectedProvinceName: string;
  selectedCountyName: string;
  selectedCityName: string;
  selectedRegionName: string;
  selectedNeighbourName: any;
  pid: string = "";
  coid: string = "";
  cid: string = "";
  rid: string = "";
  nid: string = "";
  districttableeditable: boolean = false;
  districtTableDate: { districtid: string, pid: string, pName: string, coid: string, coName: string, cid: string, cName: string, rid: string, rName: string, nid: string, nName: string }[] = []
  districtTableDateShow: { pName: string, coName: string, cName: string, rName: string, nName: string }[] = []
  EditDistrict() {
    if (this.districttableeditable)
      this.districttableeditable = false;
    else
      this.districttableeditable = true;
  }
  CancelDistrict() {
    this.districttableeditable = false;
  }
  AddDistrict() {
    this.newDstrictID = this.newDstrictID - 1
    this.districtTableDate.push({
      districtid: this.newDstrictID.toString(),
      pid: this.pid, pName: this.selectedProvinceName, coid: this.coid, coName: this.selectedCountyName, cid: this.cid, cName: this.selectedCityName
      , rid: this.rid, rName: this.selectedRegionName, nid: this.nid, nName: this.selectedNeighbourName
    })
    this.districtTableDateShow.push({
      pName: this.selectedProvinceName, coName: this.selectedCountyName, cName: this.selectedCityName
      , rName: this.selectedRegionName, nName: this.selectedNeighbourName
    })
    this.districtTableDateShow = [...this.districtTableDateShow]
    this.districtTablevalue = new LocalDataSource(this.districtTableDate)
    this.selectedProvince = "";
    this.selectedCounty = "";
    this.selectedCity = "";
    this.selectedRegion = "";
    this.selectedNeighbour = "";
    this.selectedProvinceName = "";
  }
  SaveDistrict() {
    var token = this.tokencookie.get('T')
    var disticts = [];
    for (let i = 0; i < this.districtTableDate.length; i++) {
      if (this.districtTableDate[i].districtid == '-1') {
        disticts.push({
          provinceid: this.districtTableDate[i].pid,
          countyid: this.districtTableDate[i].coid,
          cityid: this.districtTableDate[i].cid,
          regionid: this.districtTableDate[i].rid,
          neighbourhoodid: this.districtTableDate[i].nid,
        })
      }
    }
    this.api.createtechniciandistricts(token, this.userid, disticts).subscribe(
      res => {
        if (this.districtTableDate.length != 0)
          this.districtfill = true
        else
          this.districtfill = false
        if (this.profilefill && this.skillfill && this.districtfill) {
          this.api.setfillprofileture(token, this.userid).subscribe(
            res => {   console.log(res) }
            , err => {  console.log(err) }
          )
        }
        else {
          this.api.setfillprofilefalse(token, this.userid).subscribe(
            res => {   console.log(res) }
            , err => {  console.log(err) }
          )
        }
       // console.log(res)
        Swal.fire({
          title: 'بروزرسانی محدوده کاری',
          text: 'تعداد' + res.result.create + 'محدوده کاری به تکنسین اضافه شد ',
          icon: 'success',
          confirmButtonText: '!متوجه شدم',
        }
        )
        this.districttableeditable = false;
      },
      err => {
       console.log(err)
      }
    )

  }
  DistrictAction(event: any) {
    switch (event.action) {
      case 'deleterecord':
        var name = event.data.districtid
        const swalWithBootstrapButtons = Swal.mixin({
          customClass: {
            confirmButton: 'btn btn-danger',
            cancelButton: 'btn btn-success'
          },

        })
        swalWithBootstrapButtons.fire({
          title: 'حذف محدوده کاری',
          text: "آیا از حذف محدوده کاری انتخابی اطمینان دارید؟",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: '!آره, حذفش کن',
          cancelButtonText: 'نه، بی خیال'
        }).then((result) => {
          if (result.isConfirmed) {
            var token = this.tokencookie.get('T')
            this.api.deletetechniciandistrict(token, event.data.ID).subscribe(
              res => {
               // console.log(res)
                var idx = this.districtTableDate.findIndex(item => item.districtid == event.data.districtid)
                this.districtTableDate.splice(idx, 1)
                this.districtTableDateShow.splice(idx, 1)
                this.districtTableDateShow = [...this.districtTableDateShow]
                this.districtTablevalue = new LocalDataSource(this.districtTableDate)
                Swal.fire({
                  title: 'حذف محدوده کاری ',
                  text: '!محدوده کاری انتخابی با موفقیت حذف شد',
                  icon: 'success',
                  confirmButtonText: '!متوجه شدم',
                }
                )
              },
              err => {
               console.log(err)
              }
            )
          }
        })
        break;
    }
  }

  selectprovince(event: any) {
    this.shahrestan = this.province.find(item => item.id == Number(event.value))!.counties;
    this.selectedProvinceName = this.province.find(item => item.id == Number(event.value))!.provinceName;
    this.pid = event.value
    this.city = []
    this.region = []
    this.neighbourhood = []
  }
  selectshahrestan(event: any) {
    this.coid = event.value
    this.city = this.shahrestan.find(item => item.id == Number(event.value))!.cities;
    this.selectedCountyName = this.shahrestan.find(item => item.id == Number(event.value))!.countyName;
    this.region = []
    this.neighbourhood = []
  }
  selectcity(event: any) {
    this.cid = event.value
    this.region = this.city.find(item => item.id == Number(event.value))!.regions;
    this.selectedCityName = this.city.find(item => item.id == Number(event.value))!.cityName;
    this.neighbourhood = []
  }
  selectregion(event: any) {
    this.rid = event.value
    this.neighbourhood = this.region.find(item => item.id == Number(event.value))!.neighbourhoods;
    this.selectedRegionName = this.region.find(item => item.id == Number(event.value))!.regionName;
  }
  selectneighbour(event: any) {
    this.nid = event.value
    this.selectedNeighbourName = this.neighbourhood.find(item => item.id == Number(event.value))!.neighbourhoodName;
  }
  clickpoint: LngLatLike = [
    51.337479339892525,
    35.76639453331079
  ];
  branchData: any[] = [];
  interact: boolean = true;
  geometry1: any[];
  title = "mapir-angular-test";
  center: LngLatLike = [
    51.337479339892525,
    35.76639453331079
  ];
  adddomaintion() {
    this.geometry1 = [{
      "coordinates": [
        [
          [
            51.33699011667957,
            35.77076096275786
          ],
          [
            51.337479339892525,
            35.76639453331079
          ],
          [
            51.331853272951605,
            35.75091162471527
          ],
          [
            51.34848686216944,
            35.75101088372354
          ],
          [
            51.349343002790505,
            35.756767694413796
          ],
          [
            51.34542921709175,
            35.77135636638209
          ],
          [
            51.33699011667957,
            35.77076096275786
          ]
        ]
      ],
      "type": "Polygon"
    }]
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////Interest//////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  editInterest: boolean = false;
  EditInterest() {
    this.editInterest = true;
    this.interstsForm.controls['interests'].enable()
  }
  SaveInterest() {
    this.editInterest = false;
    this.interstsForm.controls['interests'].disable()
    this.curentTechnician.technicianFavourite = this.interstsForm.controls['interests'].value!
    var token = this.tokencookie.get('T')
    this.api.edittechnicianfav(token, this.userid, this.interstsForm.controls['interests'].value!).subscribe(
      res => {
       // console.log(res)
      },
      err => {
       console.log(err)
      }
    )

  }
  CancelInterest() {
    this.editInterest = false;
    this.interstsForm.controls['interests'].patchValue(this.curentTechnician.technicianFavourite);
    this.interstsForm.controls['interests'].markAsDirty();
    this.interstsForm.controls['interests'].disable()
  }
}

@Component({
  selector: 'edit-adddress-Dialog',
  templateUrl: 'editadd.html',
  styleUrls: ['./technicianProfile.component.scss']
})

export class TechEditAddressDialogProfile implements OnInit {
  form = new FormGroup({
    groupName: new FormControl('', Validators.required),
  })
  private formSubmitAttempt!: boolean;
  addressforedit: any;
  constructor(
    private api: ApiServicesService,
    private modalService: NgbModal,
    private tokencookie: CookieService,
    public dialogRef: MatDialogRef<TechEditAddressDialogProfile>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { }

  isFieldInvalid(field: string) {
    return (
      (!this.form.get(field)?.valid && this.form.get(field)?.touched) ||
      (this.form.get(field)?.untouched && this.formSubmitAttempt)
    );
  }
  ngOnInit() {

   // console.log(this.data.addressdata)
    this.addressforedit = this.data.addressdata
  }
  getValues(sg: any) {
   // console.log(sg)
  }
  editadd(event: any) {
    var data: { btn: string, addid: number } = { btn: event.kind, addid: event.addid }
    this.dialogRef.close(data);
  }

}


// function EditSkillTable(row: any) {
//   TechnicianProfileComponent.
//   throw new Error('Function not implemented.');
// }

// function handleUpdatedUser(updatedUserData: any) {
//   throw new Error('Function not implemented.');
// }

