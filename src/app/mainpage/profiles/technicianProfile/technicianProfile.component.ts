
import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, Input, Inject } from '@angular/core';
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
  constructor(

    private router: Router,
    private globalVar: GlobalvarService,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private api: ApiServicesService,
    private tokencookie: CookieService,
    public editAdd: MatDialog,) { }
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


  mainstreet: string = "";
  substreet: string = "";
  lane: string = "";
  building: string = "";
  no: string = "";
  unit: string = "";
  floor: string = "";
  address: Address[] = []
  addresses: { id: number, text: string, isMainAddress: boolean, maplong: number, maplat: number }[] = []
  maplat: number = 51.367918;
  maplong: number = 35.712706;
  curentTechnician: ThechnicianProfile;

  openSnackBar(message: string, action: string, alertkind: string, showtime: number, hp?: MatSnackBarHorizontalPosition, vp?: MatSnackBarVerticalPosition) {
    this._snackBar.open(message, action, {
      duration: showtime * 1000,
      panelClass: [alertkind],
      horizontalPosition: hp,
      verticalPosition: vp
    });
  }
  appliances: Applience[] = [];
  brands: { id: string, brand: string, job: string }[] = [];
  selectedGroup: any;
  userid: any;
  name: any;
  progress: number;
  gurls: any = [];
  gimage: File[] = [];
  brandselected: any[];
  appselected: any;
  ngOnInit() {
    if (!this.showBanner)
      this.showbanner = false;
    this.name = new FormControl('');
    var token = this.tokencookie.get('T')
    this.userid = localStorage.getItem('userID');

    this.api.gettechniciansdetails(token, this.userid!).subscribe(
      res => {
        this.curentTechnician = res[0]
        console.log(this.curentTechnician)
        this.mobiles = this.curentTechnician.mobile;
        this.tels = this.curentTechnician.phones;
        this.address = this.curentTechnician.address;
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
        this.typevalue = false;
        this.firstname.patchValue(this.curentTechnician.firstName);
        this.firstname.markAsDirty();

        this.lastname.patchValue(this.curentTechnician.lastName);
        this.lastname.markAsDirty();

        this.nationalid.patchValue(this.curentTechnician.nationalId);
        this.nationalid.markAsDirty();

        this.birthdate = this.curentTechnician.birthDate;
        this.disabled = true;
        this.api.getRegins(token).subscribe(
          res => {
            console.log(res)
            this.province = res
          }
            ,err=>{
              console.log(err);
            })
        this.api.getAllApplience(token).subscribe(
          res => {
            console.log(res);
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
  deletegimg(url: any) {
    if (url != null) {
      const index: number = this.gurls.indexOf(url);
      if (index !== -1) {
        this.gurls.splice(index, 1);

      }
    }
  }
  onSelectprofile(event: any) {
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
  ngAfterViewInit() {
    // alert("salam")
    this.nationalid.disable();
    this.lastname.disable();
    this.firstname.disable();
  }
  provincechange(event: any) {
    console.log(event)
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
      var userId = localStorage.getItem('userID')
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
    console.log(id)
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
        var userId = localStorage.getItem('userID')
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
      console.log(add)
      for (let i = 0; i < this.addresses.length; i++) {
        add.isMainAddress = true;
        if (this.addresses[i].id !== add.id)
          this.addresses[i].isMainAddress = false;
      }
    }
  }

  getAppValues(a: any) {
    this.brands = [];
    this.brandselected = [];
    var b = this.appliances.find(item => item.ID == a)!.brands
    var idx = 0;
    for (let i = 0; i < b.length; i++) {
      this.brands.push({ id: idx.toString(), brand: b[i].brand, job: "نصب" })
      idx++
      this.brands.push({ id: idx.toString(), brand: b[i].brand, job: "تعمیر" })
      idx++
    }
  }
  public ngSearchFn = (searchTerm: string, item: any) => {
    return item.brand.toLowerCase().indexOf(searchTerm) > -1 || item.job.toLowerCase().indexOf(searchTerm) > -1;
  }
  showskills: boolean = false;
  skills: { id: string, app: string, apppic: string, kind: { id: string, brand: string, skill: string[] }[] }[] = []
  addskill() {
    if (this.appselected != "" && this.brandselected != null) {
      var skillindx = -1;
      skillindx = this.skills.findIndex(item => item.id == this.appselected)
      if (skillindx != -1) {
        for (let i = 0; i < this.brandselected.length; i++) {
          var jobindex = -1;
          jobindex = this.skills[skillindx].kind.findIndex(item => item.id == this.brandselected[i]);
          if (jobindex == -1) {
            var btitle = this.brands.find(item => item.id == this.brandselected[i])?.brand
            var bjob = this.brands.find(item => item.id == this.brandselected[i])?.job
            // var job:string[]=[]
            // job.push(bjob!)
            // this.skills[skillindx].kind.push({ id: this.brandselected[i].toString(), brand: btitle!, skill: job! })
            var bindex = -1
            bindex = this.skills[skillindx].kind.findIndex(item => item.brand == btitle)
            if (bindex != -1) {
              this.skills[skillindx].kind[bindex].skill.push(bjob!)
            }
            else {
              var job: string[] = []
              job.push(bjob!)
              this.skills[skillindx].kind.push({ id: this.brandselected[i].toString(), brand: btitle!, skill: job! })
            }
          }
        }
      }
      else {
        this.showskills = true;
        var apptitle = this.appliances.find(item => item.ID == this.appselected)?.title
        var apppic = this.appliances.find(item => item.ID == this.appselected)?.pic
        var brandskill: { id: string, brand: string, skill: string[] }[] = [];
        for (let i = 0; i < this.brandselected.length; i++) {
          var btitle = this.brands.find(item => item.id == this.brandselected[i])?.brand
          var bjob = this.brands.find(item => item.id == this.brandselected[i])?.job
          var bindex = -1
          bindex = brandskill.findIndex(item => item.brand == btitle)
          if (bindex != -1) {
            brandskill[bindex].skill.push(bjob!)
          }
          else {
            var job: string[] = []
            job.push(bjob!)
            brandskill.push({ id: this.brandselected[i].toString(), brand: btitle!, skill: job! })
          }
        }

        this.skills.push({ id: this.appselected, app: apptitle!, apppic: apppic!, kind: brandskill! })
      }
      this.brandselected = []
      this.appselected = []
      this.brands = []
    }
  }
  deletegbrand(b: any) {

  }
  deletegskill(b: any, s: any) {

  }
  deletegapp(a: any) {

  }
  editskill(){

  }
  saveskill(){

  }
  cancelskill(){

  }
  selectedProvince: string;
  selectedCounty: string;
  selectedCity: string;
  selectedRegion: string;
  selectedNeighbour: any;
  pid: string = "";
  coid: string = "";
  cid: string = "";
  rid: string = "";
  nid: string = "";
  selectprovince(event: any) {
    console.log(event)
    this.shahrestan = this.province.find(item => item.id == Number(event.value))!.counties;
    this.pid = event.value
    this.city = []
    this.region = []
    this.neighbourhood = []
  }
  selectshahrestan(event: any) {
    console.log(event)
    this.coid = event.value
    this.city = this.shahrestan.find(item => item.id == Number(event.value))!.cities;
    this.region = []
    this.neighbourhood = []
  }
  selectcity(event: any) {
    console.log(event)
    this.cid = event.value
    this.region = this.city.find(item => item.id == Number(event.value))!.regions;
    this.neighbourhood = []
  }
  selectregion(event: any) {
    this.rid = event.value
    console.log(event)

    this.neighbourhood = this.region.find(item => item.id == Number(event.value))!.neighbourhoods;
  }
  selectneighbour(event: any) {
    this.nid = event.value
    console.log(event)
  }
  clickpoint: LngLatLike=[
    51.337479339892525,
    35.76639453331079
  ];
  branchData:any[]=[];
  interact: boolean = true;
  geometry1:any[];
  title = "mapir-angular-test";
  center: LngLatLike=[
    51.337479339892525,
    35.76639453331079
  ];
  adddomaintion(){
    this.geometry1= [{
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

    console.log(this.data.addressdata)
    this.addressforedit = this.data.addressdata
  }
  getValues(sg: any) {
    console.log(sg)
  }
  editadd(event: any) {
    var data: { btn: string, addid: number } = { btn: event.kind, addid: event.addid }
    this.dialogRef.close(data);
  }

}