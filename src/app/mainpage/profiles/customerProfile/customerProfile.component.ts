import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, Input, Inject } from '@angular/core';
import { IDatepickerTheme } from 'ng-persian-datepicker';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AnimationStyleMetadata } from '@angular/animations';
import { Jalali } from 'jalali-ts';
import { hide } from '@popperjs/core';
import { NgbModal, NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { faListSquares } from '@fortawesome/free-solid-svg-icons';
import { CustomerProfile, Address, Mobile, Telephone, Counties, Province, Cities, Regions, Nighbourhoods } from '../profile';
import { ApiServicesService } from 'src/app/api-services.service';
import { CookieOptions, CookieService } from 'ngx-cookie-service';
import { GlobalvarService } from 'src/app/globalvar.service';
import { control } from 'leaflet';
import { Router } from '@angular/router';
import { DialogData } from '../../orderpage/orderpage.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

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
  addressForm: FormGroup;
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
  curentCustomer: CustomerProfile;

  openSnackBar(message: string, action: string, alertkind: string, showtime: number, hp?: MatSnackBarHorizontalPosition, vp?: MatSnackBarVerticalPosition) {
    this._snackBar.open(message, action, {
      duration: showtime * 1000,
      panelClass: [alertkind],
      horizontalPosition: hp,
      verticalPosition: vp
    });
  }

  userid: any;
  name: any;

  ngOnInit() {
    if (!this.showBanner)
      this.showbanner = false;
    this.name = new FormControl('');
    var token = this.tokencookie.get('T')

    this.userid = localStorage.getItem('userID');
    this.api.getCustomersDetails(token, this.userid!).subscribe(
      res => {
        this.curentCustomer = res[0]
        console.log(this.curentCustomer)
        this.mobiles = this.curentCustomer.mobile;
        this.tels = this.curentCustomer.phones;
        this.address = this.curentCustomer.address;
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

          if (this.address[i].neighbourhood!= null)
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
        this.firstname.patchValue(this.curentCustomer.firstName);
        this.firstname.markAsDirty();

        this.lastname.patchValue(this.curentCustomer.lastName);
        this.lastname.markAsDirty();

        this.nationalid.patchValue(this.curentCustomer.nationalId);
        this.nationalid.markAsDirty();


        this.birthdate = this.curentCustomer.birthDate;
        this.disabled = true;
      },
      err => {
        console.log(err)
      }
    )
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
  selectprovince(event: any) {
    console.log(event)
    this.shahrestan = event.value.counties;
    this.city = []
    this.region = []
    this.neighbourhood = []
  }
  selectshahrestan(event: any) {
    console.log(event)
    this.city = event.value.cities;
    this.region = []
    this.neighbourhood = []
  }
  selectcity(event: any) {
    console.log(event)
    this.region = event.value.regions;
    this.neighbourhood = []
  }
  selectregion(event: any) {
    console.log(event)
    this.neighbourhood = event.value.neighbourhoods;
  }
  selectneighbour(event: any) {
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
      this.api.getCustomersDetails(token, userId!).subscribe(
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
    else
    {
      this.shownewaddress = false;
    }

  }
  progress: number;
  gurls: any = [];
  gimage: File[] = [];
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
    this.curentCustomer.firstName = this.firstname.value!;
    this.curentCustomer.lastName = this.lastname.value!;
    this.curentCustomer.nationalId = this.nationalid.value!;
    this.curentCustomer.birthDate = this.birthdate;
    this.editName = false;
    this.disabled = true;
    this.firstname.disable();
    this.lastname.disable();
    this.nationalid.disable();
    // this.router.navigate(['home/profile/technician']);
  }
  lastn: string = "fdsd";
  cancelname() {
    this.editName = false;
    this.disabled = true;
    this.firstname.patchValue(this.curentCustomer.firstName);
    this.firstname.markAsDirty();
    this.lastname.patchValue(this.curentCustomer.lastName);
    this.lastname.markAsDirty();
    this.nationalid.patchValue(this.curentCustomer.nationalId);
    this.nationalid.markAsDirty();
    this.birthdate = this.curentCustomer.birthDate;
    this.firstname.disable();
    this.lastname.disable();
    this.nationalid.disable();

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
    const dialogRef = this.editAdd.open(EditAddressDialogProfile, {
      width: '750px',
      data: { addressdata: data },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.btn == "save" || result.btn == "edit" || result.btn == "delete") {
        var token = this.tokencookie.get('T');
        var userId = localStorage.getItem('userID')
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
}
@Component({
  selector: 'edit-adddress-Dialog',
  templateUrl: 'editadd.html',
  styleUrls: ['./customerProfile.component.scss']
})
export class EditAddressDialogProfile implements OnInit {
  form = new FormGroup({
    groupName: new FormControl('', Validators.required),
  })
  private formSubmitAttempt!: boolean;
  addressforedit: any;
  constructor(
    private api: ApiServicesService,
    private modalService: NgbModal,
    private tokencookie: CookieService,
    public dialogRef: MatDialogRef<EditAddressDialogProfile>,
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