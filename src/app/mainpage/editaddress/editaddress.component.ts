import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomerProfile, Address, Mobile, Telephone, Counties, Province, Cities, Regions, Nighbourhoods } from '../profiles/profile';


import { ApiServicesService } from 'src/app/api-services.service';
import { CookieService } from 'ngx-cookie-service';
import { GlobalvarService } from 'src/app/globalvar.service';
import Swal from 'sweetalert2';
interface output {
  kind: string,
  addid: number,
}
@Component({
  selector: 'app-editaddress',
  templateUrl: './editaddress.component.html',
  styleUrls: ['./editaddress.component.css']
})
export class EditaddressComponent implements OnInit {
  @Input() initprovince: Province[];
  @Input() userId: string;
  @Input() addressInfo: any;
  @Output() editAddressEvent = new EventEmitter<output>();
  selectedProvince: string;
  selectedCounty: string;
  selectedCity: string;
  selectedRegion: string;
  selectedNeighbour: any;
  form = new FormGroup({
    mainstreet: new FormControl('', Validators.required),
    substreet: new FormControl(''),
    lane: new FormControl(''),
    building: new FormControl(''),
    no: new FormControl('', Validators.required),
    unit: new FormControl(''),
    floor: new FormControl(''),
  })
  private formSubmitAttempt!: boolean;
  province: Province[] = [];
  isMain: boolean = false;
  shahrestan: Counties[] = []
  city: Cities[] = []
  region: Regions[] = [];
  neighbourhood: Nighbourhoods[] = []
  mapEnable: boolean = true;
  address: Address[] = []
  showMap: boolean = false;
  maplat: number = 35.712706;
  maplong: number = 51.367918;
  pid: string = "";
  coid: string = "";
  cid: string = "";
  rid: string = "";
  nid: string = "";
  edit: boolean = false;
  shownewaddress: boolean = false;
  constructor(
    private api: ApiServicesService,
    private tokencookies: CookieService,
  ) { }

  ngOnInit() {
   // console.log(this.addressInfo)
    this.form.controls.mainstreet.patchValue('');
    this.form.controls.mainstreet.markAsDirty();
    this.form.controls.substreet.patchValue('');
    this.form.controls.substreet.markAsDirty();
    this.form.controls.lane.patchValue('');
    this.form.controls.lane.markAsDirty();
    this.form.controls.building.patchValue('');
    this.form.controls.building.markAsDirty();
    this.form.controls.no.patchValue('');
    this.form.controls.no.markAsDirty();
    this.form.controls.unit.patchValue('');
    this.form.controls.unit.markAsDirty();
    this.form.controls.floor.patchValue('');
    this.form.controls.floor.markAsDirty();
    var token = this.tokencookies.get('T')
    this.api.getRegins(token).subscribe(
      res => {
       // console.log(res)
        this.province = res
        if (this.addressInfo != null) {
          this.form.controls.mainstreet.patchValue(this.addressInfo.mainstreet);
          this.form.controls.mainstreet.markAsDirty();
          this.form.controls.substreet.patchValue(this.addressInfo.substreet);
          this.form.controls.substreet.markAsDirty();
          this.form.controls.lane.patchValue(this.addressInfo.lane);
          this.form.controls.lane.markAsDirty();
          this.form.controls.building.patchValue(this.addressInfo.building);
          this.form.controls.building.markAsDirty();
          this.form.controls.no.patchValue(this.addressInfo.no);
          this.form.controls.no.markAsDirty();
          this.form.controls.unit.patchValue(this.addressInfo.unit);
          this.form.controls.unit.markAsDirty();
          this.form.controls.floor.patchValue(this.addressInfo.floor);
          this.form.controls.floor.markAsDirty();
          this.selectedProvince = this.addressInfo.provinceid.toString();
          this.selectedCounty = this.addressInfo.countyid.toString();
          this.selectedCity = this.addressInfo.cityid.toString();
          this.selectedRegion = this.addressInfo.regionid.toString();
          this.selectedNeighbour = this.addressInfo.neighbourid.toString();

          this.shahrestan = this.province.find(item => item.id == Number(this.selectedProvince))!.counties;
          this.city = this.shahrestan.find(item => item.id == Number(this.selectedCounty))!.cities;
          this.region = this.city.find(item => item.id == Number(this.selectedCity))!.regions;
          if (this.region.length != 0)
            this.neighbourhood = this.region.find(item => item.id == Number(this.selectedRegion))!.neighbourhoods;

          this.edit = true;


          this.pid = this.selectedProvince;
          this.coid = this.selectedCounty;
          this.cid = this.selectedCity;
          this.rid = this.selectedRegion;
          this.nid = this.selectedNeighbour;

          this.isMain = this.addressInfo.ismain;
          this.maplat = this.addressInfo.lat;
          this.maplong = this.addressInfo.lng;

        }
      },
      err => {
       console.log(err)
      }
    )
  }
  selectprovince(event: any) {
   // console.log(event)
    this.shahrestan = this.province.find(item => item.id == Number(event.value))!.counties;
    this.pid = event.value
    this.city = []
    this.region = []
    this.neighbourhood = []
  }
  selectshahrestan(event: any) {
   // console.log(event)
    this.coid = event.value
    this.city = this.shahrestan.find(item => item.id == Number(event.value))!.cities;
    this.region = []
    this.neighbourhood = []
  }
  selectcity(event: any) {
   // console.log(event)
    this.cid = event.value
    this.region = this.city.find(item => item.id == Number(event.value))!.regions;
    this.neighbourhood = []
  }
  selectregion(event: any) {
    this.rid = event.value
   // console.log(event)

    this.neighbourhood = this.region.find(item => item.id == Number(event.value))!.neighbourhoods;
  }
  selectneighbour(event: any) {
    this.nid = event.value
   // console.log(event)
  }
  showmap() {
    this.showMap = true;
  }
  saveaddress() {
   // console.log(this.userId);
    var addid = "";
    if (this.addressInfo != null)
      addid = this.addressInfo.id;
    var newAddress = {
      addid: addid,
      uid: this.userId,
      pid: this.pid,
      coid: this.coid,
      cid: this.cid,
      rid: this.rid,
      nid: this.nid,
      mainstreet: this.form.controls.mainstreet.value?.toString(),
      substreet: this.form.controls.substreet.value?.toString(),
      lane: this.form.controls.lane.value?.toString(),
      building: this.form.controls.building.value?.toString(),
      no: this.form.controls.no.value?.toString(),
      unit: this.form.controls.unit.value?.toString(),
      floor: this.form.controls.floor.value?.toString(),
      lat: this.maplat,
      long: this.maplong,
      isMain: this.isMain
    }

   // console.log(newAddress)
    var token = this.tokencookies.get('T')
    if (this.addressInfo != null) {
      this.api.EditCustomerAddress(token, newAddress).subscribe(
        res => {
          this.editAddressEvent.emit({ kind: "edit", addid: res['Address ID'] })
         // console.log(res)
        },
        err => {
         console.log(err)
        }
      )
    }
    else {
      this.api.CreateCustomerAddress(token, newAddress).subscribe(
        res => {
          this.editAddressEvent.emit({ kind: "save", addid: res['Address ID'] })
         // console.log(res)
        },
        err => {
         console.log(err)
        }
      )
    }
  }
  getmapgeo(event: any) {
   // console.log(event);
    this.maplat = event.lat;
    this.maplong = event.long;
  }
  canceladdress() {
    this.editAddressEvent.emit({ kind: "cancel", addid: -1 })
    this.shownewaddress = false;
  }
  isFieldInvalid(field: string) {
    return (
      (!this.form.get(field)?.valid && this.form.get(field)?.touched) ||
      (this.form.get(field)?.untouched && this.formSubmitAttempt)
    );
  }
  ismainSelect(im: boolean) {
   // console.log(im)
  }
  deleteaddress() {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-danger',
        cancelButton: 'btn btn-success'
      },
    })
    swalWithBootstrapButtons.fire({
      title: 'حذف آدرس',
      text: "آیا از حذف آدرس اطمینان دارید؟",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '!آره, حذفش کن',
      cancelButtonText: 'نه، بی خیال'
    }).then((result) => {
      if (result.isConfirmed) {
        var token = this.tokencookies.get('T')
        if (this.addressInfo != null) {
          var addid = this.addressInfo.id;
          this.api.DeleteCustomerAddress(token, addid).subscribe(
            res => {
              this.editAddressEvent.emit({ kind: "delete", addid: res['Address ID'] })
            },
            err => {
             console.log(err)
            }
          )
        }
      }
    })
  }
}
